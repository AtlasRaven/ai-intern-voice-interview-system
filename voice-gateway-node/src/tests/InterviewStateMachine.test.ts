import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InterviewStateMachine } from '../fsm/InterviewStateMachine.js';
import { SessionState, SessionContext } from '../types/session.js';
import { ISTTProvider } from '../providers/stt/ISTTProvider.js';
import { ITTSProvider } from '../providers/tts/ITTSProvider.js';
import { ILLMProvider } from '../providers/llm/ILLMProvider.js';
import { SpringBackendClient } from '../services/SpringBackendClient.js';
import { GatewayEvent } from '../types/events.js';

describe('InterviewStateMachine Test Suite', () => {
  let mockContext: SessionContext;
  let mockSTT: ISTTProvider;
  let mockTTS: ITTSProvider;
  let mockLLM: ILLMProvider;
  let mockBackendClient: SpringBackendClient;
  let emittedEvents: GatewayEvent[];
  let emitEvent: (event: GatewayEvent) => void;

  beforeEach(() => {
    mockContext = {
      sessionId: 'test-session-123',
      candidateName: 'Nguyễn Văn Test',
      positionTitle: 'Java Backend Intern',
      questions: [
        { id: 1, content: 'Tính kế thừa trong Java là gì?', difficulty: 'EASY', expectedPoints: 'extends keyword' },
        { id: 2, content: 'Phân biệt Interface và Abstract Class?', difficulty: 'MEDIUM', expectedPoints: 'multiple inheritance' }
      ]
    };

    mockSTT = {
      startStream: vi.fn((callback) => {
        // mock stream
      }),
      sendAudioChunk: vi.fn(),
      finishStream: vi.fn().mockResolvedValue('Em xin trả lời câu hỏi.'),
    };

    mockTTS = {
      synthesizeStream: vi.fn(async (text, onAudioChunk) => {
        onAudioChunk(Buffer.from([0, 1, 2]));
      }),
      cancel: vi.fn(),
    };

    mockLLM = {
      generateFollowUp: vi.fn().mockResolvedValue('Bạn có thể giải thích thêm không?'),
      evaluateRubric: vi.fn().mockResolvedValue({
        technicalScore: 8.5,
        problemSolvingScore: 8.0,
        communicationScore: 7.5,
        overallScore: 8.05,
        aiFeedback: 'Ứng viên trả lời rõ ràng và chuẩn xác.',
      }),
    };

    mockBackendClient = {
      saveTranscriptSegment: vi.fn().mockResolvedValue({}),
      submitEvaluation: vi.fn().mockResolvedValue({}),
      terminateSession: vi.fn().mockResolvedValue({}),
      getSessionContext: vi.fn().mockResolvedValue(mockContext),
    } as unknown as SpringBackendClient;

    emittedEvents = [];
    emitEvent = (event: GatewayEvent) => {
      emittedEvents.push(event);
    };
  });

  it('should initialize with INITIALIZING state', () => {
    const fsm = new InterviewStateMachine(mockContext, mockSTT, mockTTS, mockLLM, mockBackendClient, emitEvent);
    expect(fsm.getState()).toBe(SessionState.INITIALIZING);
    expect(fsm.getCurrentQuestionIndex()).toBe(0);
    expect(fsm.getTotalQuestions()).toBe(2);
  });

  it('should transition through GREETING, ASKING to LISTENING on start()', async () => {
    const fsm = new InterviewStateMachine(mockContext, mockSTT, mockTTS, mockLLM, mockBackendClient, emitEvent);
    await fsm.start();

    // After start(), it asked question 1 and transitioned to LISTENING
    expect(fsm.getState()).toBe(SessionState.LISTENING);
    expect(fsm.getCurrentQuestionIndex()).toBe(0);
    expect(mockTTS.synthesizeStream).toHaveBeenCalled();
    expect(mockSTT.startStream).toHaveBeenCalled();
  });

  it('should handle Barge-in during ASKING and switch immediately to LISTENING', async () => {
    // Delay synthesizeStream to simulate speaking duration
    mockTTS.synthesizeStream = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 300)));
    const fsm = new InterviewStateMachine(mockContext, mockSTT, mockTTS, mockLLM, mockBackendClient, emitEvent);
    
    // Start asking (in progress, state is ASKING)
    const askPromise = fsm.askCurrentQuestion();
    expect(fsm.getState()).toBe(SessionState.ASKING);

    // Candidate interrupts
    fsm.handleBargeIn();
    expect(mockTTS.cancel).toHaveBeenCalled();
    expect(fsm.getState()).toBe(SessionState.LISTENING);

    await askPromise;
  });

  it('should handle text answer and progress through all questions to COMPLETED', async () => {
    const fsm = new InterviewStateMachine(mockContext, mockSTT, mockTTS, mockLLM, mockBackendClient, emitEvent);
    await fsm.start();

    // Answer Q1
    await fsm.handleTextAnswer('Kế thừa trong Java dùng từ khóa extends');
    expect(mockBackendClient.saveTranscriptSegment).toHaveBeenCalledTimes(1);
    expect(fsm.getCurrentQuestionIndex()).toBe(1);

    // Answer Q2
    await fsm.handleTextAnswer('Interface có thể đa kế thừa còn Abstract Class thì đơn kế thừa');
    expect(mockBackendClient.saveTranscriptSegment).toHaveBeenCalledTimes(2);

    // Now all 2 questions answered -> Evaluation and COMPLETED
    expect(fsm.getState()).toBe(SessionState.COMPLETED);
    expect(mockBackendClient.submitEvaluation).toHaveBeenCalledTimes(1);

    const completedEvent = emittedEvents.find((e) => e.event === 'SESSION_COMPLETED');
    expect(completedEvent).toBeDefined();
  });

  it('should handle disconnect and reconnect gracefully', () => {
    const fsm = new InterviewStateMachine(mockContext, mockSTT, mockTTS, mockLLM, mockBackendClient, emitEvent);
    fsm.handleDisconnect();
    expect(fsm.getState()).toBe(SessionState.DISCONNECTED);

    fsm.handleReconnect(emitEvent);
    expect(fsm.getState()).toBe(SessionState.INITIALIZING);
    const reconnectedEvent = emittedEvents.find((e) => e.event === 'RECONNECTED_SUCCESS');
    expect(reconnectedEvent).toBeDefined();
  });

  it('should allow ending interview early and transition to COMPLETED', async () => {
    const fsm = new InterviewStateMachine(mockContext, mockSTT, mockTTS, mockLLM, mockBackendClient, emitEvent);
    await fsm.start();
    await fsm.endEarly();

    expect(fsm.getState()).toBe(SessionState.COMPLETED);
    expect(mockBackendClient.submitEvaluation).toHaveBeenCalled();
  });
});
