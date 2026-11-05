export enum SessionState {
  INITIALIZING = 'INITIALIZING',
  GREETING = 'GREETING',
  ASKING = 'ASKING',
  LISTENING = 'LISTENING',
  THINKING = 'THINKING',
  EVALUATING = 'EVALUATING',
  COMPLETED = 'COMPLETED',
  DISCONNECTED = 'DISCONNECTED',
}

export interface QuestionContext {
  id: number;
  content: string;
  difficulty: string;
  sampleAnswer: string;
  evaluationRubric: string;
}

export interface SessionContext {
  sessionId: number;
  candidateId: number;
  candidateName: string;
  positionTitle: string;
  questions: QuestionContext[];
}

export interface TranscriptRecord {
  questionId?: number;
  questionText: string;
  answerText: string;
  durationSeconds: number;
}

export interface RubricEvaluation {
  technicalScore: number;
  problemSolvingScore: number;
  communicationScore: number;
  overallScore: number;
  aiFeedback: string;
}
