import { SessionState, RubricEvaluation } from './session.js';

export type GatewayEvent =
  | { event: 'STATE_CHANGE'; payload: { state: SessionState; currentQuestionIndex?: number; totalQuestions?: number } }
  | { event: 'AI_SPEAKING_START'; payload: { questionText: string } }
  | { event: 'AI_SPEAKING_CHUNK'; payload: { audioBase64: string } }
  | { event: 'AI_SPEAKING_END' }
  | { event: 'SUBTITLE_LIVE'; payload: { speaker: 'AI' | 'CANDIDATE'; text: string; isFinal: boolean } }
  | { event: 'STOP_AUDIO_PLAYBACK' }
  | { event: 'SESSION_COMPLETED'; payload: { evaluation: RubricEvaluation } }
  | { event: 'SESSION_ERROR'; payload: { message: string } }
  | { event: 'RECONNECTED_SUCCESS'; payload: { state: SessionState; currentQuestionIndex: number; totalQuestions: number } };

export type ClientMessage =
  | { event: 'USER_BARGE_IN' }
  | { event: 'TEXT_ANSWER'; payload: { text: string } }
  | { event: 'REQUEST_NEXT_QUESTION' }
  | { event: 'END_SESSION_EARLY' };
