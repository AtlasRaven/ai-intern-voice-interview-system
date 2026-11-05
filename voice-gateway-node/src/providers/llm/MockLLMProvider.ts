import { ILLMProvider } from './ILLMProvider.js';
import { RubricEvaluation } from '../../types/session.js';

export class MockLLMProvider implements ILLMProvider {
  public async generateFollowUp(positionTitle: string, question: string, answer: string): Promise<string> {
    const followUps = [
      `Cảm ơn câu trả lời của bạn về ${positionTitle}. Bạn có thể phân tích thêm ưu điểm và nhược điểm khi áp dụng giải pháp này trong thực tế không?`,
      `Rất tốt. Vậy trong trường hợp hệ thống có lưu lượng truy cập cao đột biến, bạn sẽ tối ưu hóa vấn đề này như thế nào?`,
      `Bạn đã nêu đúng các ý chính. Nếu gặp lỗi ngoại lệ trong quá trình thực thi, bạn sẽ xử lý thế nào để không ảnh hưởng đến toàn bộ ứng dụng?`,
    ];
    const randomIndex = Math.floor(Math.random() * followUps.length);
    return followUps[randomIndex];
  }

  public async evaluateRubric(positionTitle: string, history: Array<{ question: string; answer: string }>): Promise<RubricEvaluation> {
    const totalWords = history.reduce((acc, curr) => acc + curr.answer.split(' ').length, 0);

    let technical = 8.0;
    let problemSolving = 7.5;
    let communication = 8.0;

    if (totalWords > 150) {
      technical = 8.5;
      problemSolving = 8.0;
      communication = 8.5;
    } else if (totalWords < 40) {
      technical = 6.0;
      problemSolving = 5.5;
      communication = 6.0;
    }

    const overall = parseFloat(((technical * 0.4) + (problemSolving * 0.3) + (communication * 0.3)).toFixed(2));

    const feedback = `[ĐÁNH GIÁ TỔNG QUAN VỊ TRÍ ${positionTitle.toUpperCase()}]\n` +
      `• Điểm mạnh: Ứng viên nắm được các khái niệm nền tảng, phản xạ tương đối nhanh với các câu hỏi lý thuyết cốt lõi.\n` +
      `• Điểm cần cải thiện: Cần đưa thêm các ví dụ thực tiễn từ dự án học tập hoặc kinh nghiệm debug thực tế để câu trả lời có tính thuyết phục cao hơn.\n` +
      `• Khuyến nghị: Phù hợp tiếp nhận vào chương trình Thực tập sinh kỹ thuật có Mentor hướng dẫn.`;

    return {
      technicalScore: technical,
      problemSolvingScore: problemSolving,
      communicationScore: communication,
      overallScore: overall,
      aiFeedback: feedback,
    };
  }
}
