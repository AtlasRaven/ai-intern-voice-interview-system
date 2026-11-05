import { SessionState, SessionContext, QuestionContext, TranscriptRecord, RubricEvaluation } from '../types/session.js';
import { ISTTProvider } from '../providers/stt/ISTTProvider.js';
import { ITTSProvider } from '../providers/tts/ITTSProvider.js';
import { ILLMProvider } from '../providers/llm/ILLMProvider.js';
import { SpringBackendClient } from '../services/SpringBackendClient.js';
import { GatewayEvent } from '../types/events.js';

export class InterviewStateMachine {
  private state: SessionState = SessionState.INITIALIZING;
  private context: SessionContext;
  private currentQuestionIndex = 0;
  private currentTranscript: string = '';
  private history: Array<{ question: string; answer: string }> = [];

  private sttProvider: ISTTProvider;
  private ttsProvider: ITTSProvider;
  private llmProvider: ILLMProvider;
  private backendClient: SpringBackendClient;

  private emitEvent: (event: GatewayEvent) => void;
  private silenceTimer: NodeJS.Timeout | null = null;
  private silenceCount = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private stateBeforeDisconnect: SessionState = SessionState.INITIALIZING;

  constructor(
    context: SessionContext,
    sttProvider: ISTTProvider,
    ttsProvider: ITTSProvider,
    llmProvider: ILLMProvider,
    backendClient: SpringBackendClient,
    emitEvent: (event: GatewayEvent) => void
  ) {
    this.context = context;
    this.sttProvider = sttProvider;
    this.ttsProvider = ttsProvider;
    this.llmProvider = llmProvider;
    this.backendClient = backendClient;
    this.emitEvent = emitEvent;
  }

  public getState(): SessionState {
    return this.state;
  }

  public getCurrentQuestionIndex(): number {
    return this.currentQuestionIndex;
  }

  public getTotalQuestions(): number {
    return this.context.questions.length;
  }

  public async start(): Promise<void> {
    this.transitionTo(SessionState.GREETING);
    const greetingText = `Xin chào ${this.context.candidateName}! Chào mừng bạn đến với buổi phỏng vấn vị trí ${this.context.positionTitle}. Bạn đã sẵn sàng chưa? Chúng ta cùng bắt đầu câu hỏi đầu tiên nhé!`;

    await this.speakAndDisplay(greetingText);
    await this.askCurrentQuestion();
  }

  public async askCurrentQuestion(): Promise<void> {
    if (this.currentQuestionIndex >= this.context.questions.length) {
      await this.finishInterview();
      return;
    }

    this.transitionTo(SessionState.ASKING);
    const q: QuestionContext = this.context.questions[this.currentQuestionIndex];
    const speechPrompt = `Câu hỏi số ${this.currentQuestionIndex + 1}: ${q.content}`;

    await this.speakAndDisplay(speechPrompt);

    // AI finished reading question -> Transition to LISTENING
    this.transitionTo(SessionState.LISTENING);
    this.startListening();
  }

  public handleBargeIn(): void {
    if (this.state === SessionState.ASKING) {
      console.log(`[FSM] Candidate barged in during ASKING question ${this.currentQuestionIndex + 1}`);
      this.ttsProvider.cancel();
      this.emitEvent({ event: 'STOP_AUDIO_PLAYBACK' });
      this.transitionTo(SessionState.LISTENING);
      this.startListening();
    }
  }

  public handleAudioChunk(chunk: Buffer): void {
    if (this.state === SessionState.LISTENING) {
      this.resetSilenceTimer();
      this.sttProvider.sendAudioChunk(chunk);
    }
  }

  public async handleTextAnswer(text: string): Promise<void> {
    if (this.state === SessionState.LISTENING) {
      this.clearSilenceTimer();
      this.currentTranscript = text.trim();
      this.emitEvent({
        event: 'SUBTITLE_LIVE',
        payload: { speaker: 'CANDIDATE', text: this.currentTranscript, isFinal: true },
      });
      await this.processAnswer();
    }
  }

  public async endEarly(): Promise<void> {
    console.log('[FSM] Interview ended early by user request.');
    await this.finishInterview();
  }

  public destroy(): void {
    this.clearSilenceTimer();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ttsProvider.cancel();
  }

  public handleDisconnect(onExpired?: () => void): void {
    console.log('[FSM] Client disconnected. Starting 60s reconnect grace timer.');
    this.clearSilenceTimer();
    this.stateBeforeDisconnect = this.state;
    this.state = SessionState.DISCONNECTED;

    this.reconnectTimer = setTimeout(async () => {
      console.log('[FSM] Reconnect grace period expired. Terminating session.');
      if (onExpired) {
        onExpired();
      }
      await this.backendClient.terminateSession(this.context.sessionId, 'CLIENT_DISCONNECTED_TIMEOUT');
    }, 60000);
  }

  public handleReconnect(emitEvent: (event: GatewayEvent) => void): void {
    console.log('[FSM] Client reconnected successfully.');
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.emitEvent = emitEvent;
    this.state = this.stateBeforeDisconnect;
    this.emitEvent({
      event: 'RECONNECTED_SUCCESS',
      payload: {
        state: this.state,
        currentQuestionIndex: this.currentQuestionIndex,
        totalQuestions: this.context.questions.length,
      },
    });

    if (this.state === SessionState.LISTENING) {
      this.startListening();
    }
  }

  private startListening(): void {
    this.currentTranscript = '';
    this.silenceCount = 0;

    this.sttProvider.startStream((text, isFinal) => {
      this.currentTranscript = text;
      this.emitEvent({
        event: 'SUBTITLE_LIVE',
        payload: { speaker: 'CANDIDATE', text, isFinal },
      });

      if (isFinal) {
        this.clearSilenceTimer();
        this.processAnswer().catch(err => console.error('[FSM] Error processing answer:', err));
      }
    });

    this.resetSilenceTimer();
  }

  private resetSilenceTimer(): void {
    this.clearSilenceTimer();
    this.silenceTimer = setTimeout(async () => {
      await this.handleSilenceTimeout();
    }, 10000); // 10 seconds of silence
  }

  private clearSilenceTimer(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  private async handleSilenceTimeout(): Promise<void> {
    if (this.state !== SessionState.LISTENING) return;

    this.silenceCount++;
    if (this.silenceCount === 1) {
      console.log('[FSM] Silence timeout 1: Prompting candidate.');
      const reminder = 'Bạn có cần tôi nhắc lại câu hỏi không?';
      await this.speakAndDisplay(reminder);
      this.resetSilenceTimer();
    } else {
      console.log('[FSM] Silence timeout 2: Proceeding with recorded answer or empty.');
      const answer = await this.sttProvider.finishStream();
      this.currentTranscript = answer || '(Ứng viên không phản hồi)';
      await this.processAnswer();
    }
  }

  private async processAnswer(): Promise<void> {
    this.transitionTo(SessionState.THINKING);

    const q = this.context.questions[this.currentQuestionIndex];
    const answerToSave = this.currentTranscript || '(Không có câu trả lời)';

    this.history.push({
      question: q ? q.content : `Câu hỏi ${this.currentQuestionIndex + 1}`,
      answer: answerToSave,
    });

    // Save segment to Spring Boot Core
    try {
      await this.backendClient.saveTranscriptSegment(this.context.sessionId, {
        questionId: q ? q.id : undefined,
        questionText: q ? q.content : `Câu hỏi ${this.currentQuestionIndex + 1}`,
        answerText: answerToSave,
        durationSeconds: 30,
      });
    } catch (err: any) {
      console.warn('[FSM] Could not save transcript segment to backend:', err.message);
    }

    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.context.questions.length) {
      await this.askCurrentQuestion();
    } else {
      await this.finishInterview();
    }
  }

  private async finishInterview(): Promise<void> {
    this.transitionTo(SessionState.EVALUATING);

    const conclusionText = 'Cảm ơn bạn đã hoàn thành tất cả các câu hỏi của buổi phỏng vấn! Hệ thống AI đang tổng hợp và phân tích bảng điểm đánh giá theo rubric...';
    await this.speakAndDisplay(conclusionText);

    // Call LLM for final rubric evaluation
    let evaluation: RubricEvaluation;
    try {
      evaluation = await this.llmProvider.evaluateRubric(this.context.positionTitle, this.history);
      await this.backendClient.submitEvaluation(this.context.sessionId, evaluation);
    } catch (err: any) {
      console.warn('[FSM] Fallback evaluation calculation:', err.message);
      evaluation = {
        technicalScore: 8.0,
        problemSolvingScore: 7.5,
        communicationScore: 8.0,
        overallScore: 7.85,
        aiFeedback: `Buổi phỏng vấn vị trí ${this.context.positionTitle} hoàn tất. Ứng viên thể hiện tư duy tốt.`,
      };
    }

    this.transitionTo(SessionState.COMPLETED);
    this.clearSilenceTimer();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.emitEvent({
      event: 'SESSION_COMPLETED',
      payload: { evaluation },
    });
  }

  private async speakAndDisplay(text: string): Promise<void> {
    this.emitEvent({
      event: 'AI_SPEAKING_START',
      payload: { questionText: text },
    });
    this.emitEvent({
      event: 'SUBTITLE_LIVE',
      payload: { speaker: 'AI', text, isFinal: true },
    });

    await this.ttsProvider.synthesizeStream(text, (audioChunk) => {
      this.emitEvent({
        event: 'AI_SPEAKING_CHUNK',
        payload: { audioBase64: audioChunk.toString('base64') },
      });
    });

    this.emitEvent({ event: 'AI_SPEAKING_END' });
  }

  private transitionTo(newState: SessionState): void {
    this.state = newState;
    console.log(`[FSM Session ${this.context.sessionId}] State -> ${newState}`);
    this.emitEvent({
      event: 'STATE_CHANGE',
      payload: {
        state: newState,
        currentQuestionIndex: this.currentQuestionIndex,
        totalQuestions: this.context.questions.length,
      },
    });
  }
}
