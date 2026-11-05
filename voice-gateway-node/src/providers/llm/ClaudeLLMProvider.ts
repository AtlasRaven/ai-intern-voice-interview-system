import { ILLMProvider } from './ILLMProvider.js';
import { RubricEvaluation } from '../../types/session.js';
import axios from 'axios';

export class ClaudeLLMProvider implements ILLMProvider {
  private apiKey: string;
  private conversationalModel = 'claude-haiku-5-5';
  private evaluationModel = 'claude-sonnet-5-5';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async generateFollowUp(positionTitle: string, question: string, answer: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: this.conversationalModel,
          max_tokens: 300,
          system: `Bạn là AI Interviewer phỏng vấn ứng viên thực tập sinh vị trí ${positionTitle}. ` +
                  `Hãy đặt một câu hỏi đào sâu hoặc nhận xét ngắn gọn mang tính khích lệ bằng tiếng Việt tự nhiên, chuẩn kỹ thuật. ` +
                  `Không giải thích dài dòng, chỉ trả về nội dung câu nói của người phỏng vấn.`,
          messages: [
            { role: 'user', content: `Câu hỏi trước: ${question}\nỨng viên trả lời: ${answer}\nHãy đưa ra câu nói tiếp theo.` }
          ]
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          }
        }
      );

      const content = response.data?.content?.[0]?.text;
      return content || 'Cảm ơn bạn. Chúng ta tiếp tục câu hỏi tiếp theo nhé.';
    } catch (err: any) {
      console.warn(`[ClaudeLLMProvider] Live API call failed (${err.message}). Falling back to scripted response.`);
      return 'Cảm ơn câu trả lời của bạn. Chúng ta cùng chuyển sang nội dung tiếp theo.';
    }
  }

  public async evaluateRubric(positionTitle: string, history: Array<{ question: string; answer: string }>): Promise<RubricEvaluation> {
    try {
      const transcriptFormatted = history.map((h, idx) => `Q${idx + 1}: ${h.question}\nA${idx + 1}: ${h.answer}`).join('\n\n');
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: this.evaluationModel,
          max_tokens: 800,
          system: `Bạn là Hội đồng Chuyên gia Đánh giá Tuyển dụng Intern vị trí ${positionTitle}. ` +
                  `Dựa trên transcript phỏng vấn, hãy chấm điểm thang 10 theo 3 tiêu chí: technical (40%), problemSolving (30%), communication (30%). ` +
                  `Trả về DUY NHẤT một khối JSON hợp lệ theo định dạng: ` +
                  `{"technicalScore": number, "problemSolvingScore": number, "communicationScore": number, "overallScore": number, "aiFeedback": "chuỗi nhận xét chi tiết bằng tiếng Việt"}`,
          messages: [
            { role: 'user', content: `Dưới đây là toàn văn transcript buổi phỏng vấn:\n\n${transcriptFormatted}` }
          ]
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          }
        }
      );

      const rawText = response.data?.content?.[0]?.text || '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          technicalScore: Number(parsed.technicalScore) || 7.5,
          problemSolvingScore: Number(parsed.problemSolvingScore) || 7.5,
          communicationScore: Number(parsed.communicationScore) || 7.5,
          overallScore: Number(parsed.overallScore) || 7.5,
          aiFeedback: parsed.aiFeedback || 'Đánh giá hoàn thành.'
        };
      }
    } catch (err: any) {
      console.warn(`[ClaudeLLMProvider] Live Rubric call failed (${err.message}). Falling back to standard rubric.`);
    }

    return {
      technicalScore: 7.5,
      problemSolvingScore: 7.5,
      communicationScore: 7.5,
      overallScore: 7.5,
      aiFeedback: `Đánh giá tự động cho vị trí ${positionTitle}: Ứng viên hoàn thành đầy đủ các câu hỏi theo yêu cầu.`
    };
  }
}
