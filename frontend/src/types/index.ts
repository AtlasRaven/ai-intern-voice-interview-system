export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: 'ROLE_CANDIDATE' | 'ROLE_INTERVIEWER' | 'ROLE_ADMIN';
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface Position {
  id: number;
  code: string;
  title: string;
  description: string;
  requirements: string;
  open: boolean;
  skills: string[];
}

export interface Question {
  id: number;
  positionId: number;
  positionTitle?: string;
  content: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  sampleAnswer: string;
  evaluationRubric: string;
  skills?: string[];
}

export interface InterviewSession {
  id: number;
  candidateId: number;
  candidateName: string;
  positionId: number;
  positionTitle: string;
  sessionToken: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'TIMEOUT';
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface TranscriptSegment {
  id: number;
  sessionId: number;
  questionId?: number;
  questionText: string;
  answerText: string;
  durationSeconds: number;
  createdAt: string;
}

export interface Evaluation {
  id: number;
  sessionId: number;
  candidateName: string;
  positionTitle: string;
  technicalScore: number;
  problemSolvingScore: number;
  communicationScore: number;
  overallScore: number;
  aiFeedback: string;
  hrScoreOverride?: number;
  hrNotes?: string;
  finalStatus: 'PASSED' | 'FAILED' | 'UNDER_REVIEW';
  evaluatedAt: string;
}

export type SessionState =
  | 'INITIALIZING'
  | 'GREETING'
  | 'ASKING'
  | 'LISTENING'
  | 'THINKING'
  | 'EVALUATING'
  | 'COMPLETED'
  | 'DISCONNECTED';
