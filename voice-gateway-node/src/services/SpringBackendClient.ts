import axios, { AxiosInstance } from 'axios';
import { config } from '../config/env.js';
import { SessionContext, TranscriptRecord, RubricEvaluation } from '../types/session.js';

export class SpringBackendClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${config.springBackendUrl}/api/v1/internal`,
      headers: {
        'X-Internal-Service-Key': config.internalServiceKey,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  public async fetchSessionContext(sessionId: number): Promise<SessionContext> {
    const response = await this.client.get(`/sessions/${sessionId}/context`);
    const data = response.data?.data;
    return {
      sessionId: data.sessionId,
      candidateId: data.candidateId,
      candidateName: data.candidateName,
      positionTitle: data.positionTitle,
      questions: data.questions || [],
    };
  }

  public async saveTranscriptSegment(sessionId: number, segment: TranscriptRecord): Promise<void> {
    await this.client.post(`/sessions/${sessionId}/transcripts`, {
      questionId: segment.questionId,
      questionText: segment.questionText,
      answerText: segment.answerText,
      durationSeconds: segment.durationSeconds,
    });
  }

  public async submitEvaluation(sessionId: number, evaluation: RubricEvaluation): Promise<void> {
    await this.client.post(`/sessions/${sessionId}/evaluations`, {
      technicalScore: evaluation.technicalScore,
      problemSolvingScore: evaluation.problemSolvingScore,
      communicationScore: evaluation.communicationScore,
      overallScore: evaluation.overallScore,
      aiFeedback: evaluation.aiFeedback,
    });
  }

  public async terminateSession(sessionId: number, reason = 'TIMEOUT'): Promise<void> {
    await this.client.post(`/sessions/${sessionId}/terminate`, null, {
      params: { reason },
    });
  }
}
