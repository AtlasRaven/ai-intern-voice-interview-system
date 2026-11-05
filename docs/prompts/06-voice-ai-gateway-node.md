# CHILD PROMPT: PHASE 6 – TRIỂN KHAI VOICE/AI GATEWAY NODE.JS
**Mã tài liệu:** `DOCS-PROMPT-06-VOICE-GATEWAY`  
**Giai đoạn:** Phase 6  
**Mục tiêu:** Xây dựng Voice/AI Gateway thời gian thực bằng Node.js 20 và TypeScript, quản lý kết nối WebSocket, điều phối pipeline âm thanh (STT $\rightarrow$ LLM $\rightarrow$ TTS), hiện thực State Machine của phiên phỏng vấn, cơ chế ngắt lời (Barge-in), và hệ thống Provider trừu tượng (Real & Mock).

---

## 1. ĐẦU VÀO (INPUT)
- `docs/00-assumptions.md`: Biến môi trường (`ANTHROPIC_API_KEY`, `DEEPGRAM_API_KEY`, `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`), cơ chế tự động fallback sang Mock.
- `docs/02-system-architecture.md`: Sequence diagram luồng audio, state machine (IDLE, ASKING, LISTENING, EVALUATING, COMPLETED).
- Spring Boot Internal REST API specs cho việc lưu transcript và kết quả chấm điểm.

## 2. ĐẦU RA MONG ĐỢI (EXPECTED OUTPUT)
Mã nguồn module `/voice-gateway-node` hoàn chỉnh bằng TypeScript:
1. **Kiến trúc Provider Trừu tượng (Provider Abstraction Layer):**
   - `src/providers/stt/`: Interface `ISTTProvider` + `DeepgramSTTProvider` (real) + `MockSTTProvider` (offline scenario).
   - `src/providers/tts/`: Interface `ITTSProvider` + `AzureTTSProvider` (real) + `MockTTSProvider` (offline audio chunk generator).
   - `src/providers/llm/`: Interface `ILLMProvider` + `ClaudeLLMProvider` (real: Haiku cho hội thoại, Sonnet cho rubric) + `MockLLMProvider` (offline logic).
   - Cơ chế `ProviderFactory`: Khởi tạo Provider dựa trên biến môi trường `STT_PROVIDER`, `TTS_PROVIDER`, `LLM_PROVIDER`. Nếu cấu hình `real` nhưng thiếu API Key, tự động fallback sang `mock` và ghi log cảnh báo `WARN: [PROVIDER_FALLBACK] Missing API key for ... Fallback to Mock.`.
2. **Quản lý Phiên & Máy trạng thái (Session State Machine):**
   - Định nghĩa các trạng thái: `INITIALIZING` $\rightarrow$ `GREETING` $\rightarrow$ `ASKING` $\rightarrow$ `LISTENING` $\rightarrow$ `THINKING` $\rightarrow$ `EVALUATING` $\rightarrow$ `COMPLETED` / `DISCONNECTED`.
   - Lưu trữ state theo `sessionId`, có timeout xử lý khi mất kết nối (giữ state trong 60 giây chờ reconnect).
3. **Điều phối Âm thanh & Xử lý Thời gian thực:**
   - Tiếp nhận audio chunks (PCM / WebM / Opus) từ client qua WebSocket.
   - Cơ chế Barge-in (Candidate ngắt lời): Khi client bắt đầu nói trong lúc AI đang phát audio (TTS), Gateway lập tức gửi lệnh dừng phát (cắt luồng audio TTS) và chuyển state sang `LISTENING`.
   - Silence Detection: Khi ứng viên im lặng quá 10 giây trong trạng thái `LISTENING`, AI chủ động đưa ra gợi ý nhẹ nhàng hoặc chuyển câu hỏi.
   - Guardrails Prompt cho AI Interviewer: Bám sát câu hỏi và rubric, không trả lời hộ đáp án cho ứng viên, giữ thái độ chuyên nghiệp, không hỏi thông tin cá nhân nhạy cảm, sử dụng tiếng Việt tự nhiên chuẩn văn phong kỹ thuật.
4. **Đồng bộ Dữ liệu với Spring Boot:**
   - Gửi phân đoạn transcript sau mỗi lượt đối thoại về endpoint nội bộ của Spring Boot bằng HTTP Client kèm header `X-Internal-Service-Key`.
   - Khi phiên kết thúc, kích hoạt LLM chấm điểm theo khung rubric và gửi kết quả về Spring Boot để lưu trữ.

## 3. CÔNG CỤ SỬ DỤNG
- Skill: `system-architect` (kiến trúc microservice, pipeline bất đồng bộ, state machine).
- Skill: `api-engineer` (tích hợp internal service client).
- Shell CLI: `npm run build` để kiểm tra biên dịch TypeScript.

## 4. GIỚI HẠN PHẠM VI (SCOPE BOUNDARIES)
- Voice Gateway tập trung thuần túy vào xử lý WebSocket, điều phối streaming audio và giao tiếp AI. Dữ liệu ứng viên, lịch sử tài khoản, bảo mật danh tính người dùng lưu tại Spring Boot.
- Không hardcode bất kỳ secret key nào trong code; tất cả đọc qua `process.env`.

## 5. CHECKLIST NGHIỆM THU (ACCEPTANCE CHECKLIST)
- [ ] TypeScript biên dịch thành công không lỗi cú pháp (`npm run build`).
- [ ] Toàn bộ 3 cặp Provider (STT, TTS, LLM) có đủ interface và hiện thực cho cả Real lẫn Mock.
- [ ] Chạy offline hoàn toàn với mock providers mà không cần API key ngoài.
- [ ] Logic State Machine chuyển trạng thái chính xác theo đúng kịch bản phỏng vấn.
- [ ] Cơ chế Barge-in được xử lý: ngắt audio ngay khi phát hiện ứng viên nói.
- [ ] Giao tiếp REST nội bộ với Spring Boot sử dụng đúng `X-Internal-Service-Key`.
- [ ] Artifact tổng kết Phase 6 được tạo đầy đủ.
