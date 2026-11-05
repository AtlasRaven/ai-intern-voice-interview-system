import { RubricEvaluation } from '../../types/session.js';

export interface ILLMProvider {
  generateFollowUp(positionTitle: string, question: string, answer: string): Promise<string>;
  evaluateRubric(positionTitle: string, history: Array<{ question: string; answer: string }>): Promise<RubricEvaluation>;
}
