# ADR-003: Kiến trúc Trừu tượng hóa Nhà cung cấp AI (Provider Abstraction) và Cơ chế Offline Fallback
**Ngày:** 2026-11-05  
**Trạng thái:** Chấp thuận (Accepted)  
**Tác giả:** Solution Architect  

---

## 1. Ngữ cảnh (Context)
Hệ thống phỏng vấn thoại phụ thuộc vào 3 loại dịch vụ AI bên ngoài:
1. **Speech-to-Text (STT):** Nhận dạng tiếng Việt trực tuyến (Deepgram, Google Speech).
2. **Large Language Model (LLM):** Đặt câu hỏi tiếp theo và chấm điểm Rubric (Anthropic Claude Haiku & Sonnet).
3. **Text-to-Speech (TTS):** Tổng hợp giọng đọc tiếng Việt truyền cảm (Azure Speech Service, MMS-TTS).

Các thách thức lớn trong môi trường phát triển, CI/CD và kiểm thử cục bộ:
- Không phải lúc nào nhà phát triển hoặc máy chấm bài tự động cũng có sẵn API Key hợp lệ hoặc số dư tài khoản cloud (credit limits).
- Mạng internet có thể chập chờn hoặc offline trong các buổi demo nội bộ hoặc môi trường kiểm thử cô lập (sandbox).
- Việc gọi API thương mại trực tiếp trong các vòng kiểm thử tự động (Unit Test, Integration Test) sẽ gây tốn kém chi phí lớn, làm chậm tốc độ chạy test và vi phạm nguyên tắc FIRST trong kiểm thử.

## 2. Quyết định (Decision)
Chúng tôi quyết định thiết kế toàn bộ tầng dịch vụ AI theo mô hình **Trừu tượng hóa Nhà cung cấp (Provider Abstraction Pattern)** thông qua Interface TypeScript:
- **Interfaces trừu tượng:**
  - `ISTTProvider`: Phương thức stream audio nhị phân và nhận về transcript phân đoạn/hoàn chỉnh.
  - `ILLMProvider`: Phương thức sinh câu hỏi kế tiếp theo ngữ cảnh và sinh bảng điểm Rubric JSON.
  - `ITTSProvider`: Phương thức chuyển văn bản thành luồng chunk âm thanh nhị phân.
- **Hiện thực kép (Dual Implementations):**
  - **Real Providers:** `DeepgramSTTProvider`, `ClaudeLLMProvider`, `AzureTTSProvider`.
  - **Mock Providers:** `MockSTTProvider`, `MockLLMProvider`, `MockTTSProvider` (hoạt động offline, sinh dữ liệu giả lập chuẩn xác theo kịch bản tuyển dụng intern).
- **Cơ chế Factory & Tự động Fallback:**
  - Lựa chọn provider qua biến môi trường: `STT_PROVIDER=real|mock`, `LLM_PROVIDER=real|mock`, `TTS_PROVIDER=real|mock`.
  - **Quy tắc an toàn (Safe Fallback):** Khi cấu hình là `real` nhưng phát hiện API Key tương ứng bị thiếu, rỗng hoặc chứa placeholder, hệ thống **không dừng tiến trình** mà tự động chuyển sang sử dụng `MockProvider` tương ứng, đồng thời ghi một log cảnh báo rõ ràng cấp `WARN`:
    `"[PROVIDER_FALLBACK] Missing API key for {Provider}. Automatically falling back to MockProvider."`

## 3. Hệ quả (Consequences)
### Lợi ích (Positive):
- Hệ thống hoàn toàn độc lập với các dịch vụ đám mây bên ngoài khi chạy thử nghiệm hoặc chạy CI test; bất kỳ ai clone repo đều có thể chạy `docker compose up` và trải nghiệm đầy đủ luồng phỏng vấn mà không cần thẻ tín dụng hay đăng ký cloud.
- Dễ dàng thay thế nhà cung cấp AI trong tương lai (ví dụ chuyển từ Deepgram sang OpenAI Whisper hoặc từ Azure sang ElevenLabs) mà không phải sửa đổi State Machine hay WebSocket Controller.
- Cho phép kiểm thử tự động (Unit/Integration Test) chạy với tốc độ cao, độ ổn định 100% và không phát sinh chi phí.

### Đánh đổi (Trade-offs):
- Cần viết và duy trì mã nguồn của cả hai lớp Provider (Real và Mock), yêu cầu dữ liệu giả lập trong Mock phải phản ánh đúng cấu trúc và hành vi của Real Provider.
