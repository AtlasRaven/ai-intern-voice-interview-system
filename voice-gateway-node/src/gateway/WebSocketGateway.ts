import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { URL } from 'url';
import { InterviewStateMachine } from '../fsm/InterviewStateMachine.js';
import { ProviderFactory } from '../providers/ProviderFactory.js';
import { SpringBackendClient } from '../services/SpringBackendClient.js';
import { GatewayEvent, ClientMessage } from '../types/events.js';

export class WebSocketGateway {
  private wss: WebSocketServer;
  private activeSessions = new Map<string, { fsm: InterviewStateMachine; ws: WebSocket }>();
  private backendClient: SpringBackendClient;

  constructor(wss: WebSocketServer) {
    this.wss = wss;
    this.backendClient = new SpringBackendClient();
    this.init();
  }

  private init(): void {
    this.wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
      try {
        const reqUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
        const token = reqUrl.searchParams.get('token');
        const sessionIdParam = reqUrl.searchParams.get('sessionId');

        if (!token && !sessionIdParam) {
          ws.send(JSON.stringify({ event: 'SESSION_ERROR', payload: { message: 'Missing session token or sessionId.' } }));
          ws.close(1008, 'Unauthorized');
          return;
        }

        const sessionKey = token || `sess_id_${sessionIdParam}`;
        const sessionId = sessionIdParam ? parseInt(sessionIdParam, 10) : 1;

        console.log(`[WebSocketGateway] Incoming connection for session key: ${sessionKey}`);

        // Check if reconnecting to an existing active session
        const existing = this.activeSessions.get(sessionKey);
        if (existing) {
          console.log(`[WebSocketGateway] Found existing session for key ${sessionKey}. Reconnecting...`);
          existing.ws = ws;
          existing.fsm.handleReconnect((event: GatewayEvent) => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify(event));
            }
          });
          this.setupSocketListeners(ws, existing.fsm, sessionKey);
          return;
        }

        // Fetch session context from Spring Boot Core Backend
        let context;
        try {
          context = await this.backendClient.fetchSessionContext(sessionId);
        } catch (err: any) {
          console.warn(`[WebSocketGateway] Failed to fetch context from Spring Boot (${err.message}). Using fallback context.`);
          context = {
            sessionId,
            candidateId: 1,
            candidateName: 'Ứng viên Intern',
            positionTitle: 'Java Backend Intern',
            questions: [
              {
                id: 1,
                content: 'Bạn hãy trình bày 4 đặc tính cơ bản của Lập trình Hướng đối tượng (OOP) và cho ví dụ?',
                difficulty: 'EASY',
                sampleAnswer: 'Đóng gói, Kế thừa, Đa hình, Trừu tượng.',
                evaluationRubric: 'Nêu đủ 4 tính chất (4đ), cho ví dụ đúng (6đ).'
              },
              {
                id: 4,
                content: 'Cơ chế Lazy Loading trong JPA và hiện tượng N+1 query xảy ra như thế nào?',
                difficulty: 'MEDIUM',
                sampleAnswer: 'Tải chậm liên kết, giải quyết bằng JOIN FETCH.',
                evaluationRubric: 'Giải thích N+1 và cách khắc phục.'
              }
            ]
          };
        }

        const stt = ProviderFactory.createSTTProvider();
        const tts = ProviderFactory.createTTSProvider();
        const llm = ProviderFactory.createLLMProvider();

        const emitEvent = (event: GatewayEvent) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(event));
          }
        };

        const fsm = new InterviewStateMachine(
          context,
          stt,
          tts,
          llm,
          this.backendClient,
          emitEvent
        );

        this.activeSessions.set(sessionKey, { fsm, ws });
        this.setupSocketListeners(ws, fsm, sessionKey);

        // Start the interview session FSM
        await fsm.start();
      } catch (err: any) {
        console.error('[WebSocketGateway] Connection initialization error:', err);
        ws.send(JSON.stringify({ event: 'SESSION_ERROR', payload: { message: err.message || 'Internal error' } }));
        ws.close(1011, 'Internal Error');
      }
    });
  }

  private setupSocketListeners(ws: WebSocket, fsm: InterviewStateMachine, sessionKey: string): void {
    ws.on('message', async (data: Buffer | string, isBinary: boolean) => {
      try {
        if (isBinary) {
          // Audio chunk from candidate's microphone
          const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data as string);
          fsm.handleAudioChunk(buffer);
        } else {
          // JSON control event
          const messageStr = data.toString();
          const parsed = JSON.parse(messageStr) as ClientMessage;

          switch (parsed.event) {
            case 'USER_BARGE_IN':
              fsm.handleBargeIn();
              break;
            case 'TEXT_ANSWER':
              await fsm.handleTextAnswer(parsed.payload?.text || '');
              break;
            case 'REQUEST_NEXT_QUESTION':
              await fsm.askCurrentQuestion();
              break;
            case 'END_SESSION_EARLY':
              await fsm.endEarly();
              break;
            default:
              console.log('[WebSocketGateway] Unknown client event:', (parsed as any).event);
          }
        }
      } catch (err) {
        console.error('[WebSocketGateway] Error handling client message:', err);
      }
    });

    ws.on('close', () => {
      console.log(`[WebSocketGateway] Socket closed for session: ${sessionKey}`);
      fsm.handleDisconnect();
    });

    ws.on('error', (err) => {
      console.error(`[WebSocketGateway] Socket error for session ${sessionKey}:`, err);
    });
  }
}
