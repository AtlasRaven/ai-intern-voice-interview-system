# CHILD PROMPT: PHASE 2 – PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
**Mã tài liệu:** `DOCS-PROMPT-02-ARCHITECTURE`  
**Giai đoạn:** Phase 2  
**Mục tiêu:** Hoàn thiện toàn bộ tài liệu phân tích nghiệp vụ, mô hình kiến trúc phân tán, đặc tả luồng âm thanh WebSocket thời gian thực, giao thức bảo mật liên dịch vụ và hợp đồng API (OpenAPI 3.0).

---

## 1. ĐẦU VÀO (INPUT)
- `docs/00-assumptions.md`: Các giả định mặc định về vai trò, stack công nghệ, provider, biến môi trường.
- `docs/01-tool-map.md`: Ma trận công cụ hỗ trợ cho Phase 2 (`system-architect`, `api-engineer`, `api-documentation`).
- `docs/prompts/00-master.md`: Mục tiêu, phạm vi chức năng/phi chức năng, và Definition of Done.

## 2. ĐẦU RA MONG ĐỢI (EXPECTED OUTPUT)
- `docs/02-system-architecture.md`:
  - Danh sách Use Cases và User Stories chi tiết (kèm Acceptance Criteria rõ ràng theo chuẩn Gherkin: Given-When-Then).
  - Sơ đồ Component Diagram mô tả ranh giới giữa Spring Boot Backend và Node.js Voice/AI Gateway.
  - Sơ đồ tuần tự (Sequence Diagram bằng Mermaid) thể hiện luồng âm thanh WebSocket realtime:
    `Mic Audio -> STT -> LLM reasoning -> TTS streaming -> Speaker`, cơ chế ngắt lời (Barge-in), và phát hiện im lặng (Silence timeout).
  - Cơ chế giao tiếp nội bộ giữa hai service (REST API + Internal Service Token bí mật qua header `X-Internal-Service-Key`).
  - Chiến lược xử lý sự cố mạng: cơ chế reconnect WebSocket trong 60 giây, lưu tạm transcript định kỳ để chống mất dữ liệu khi rớt mạng.
- `docs/04-openapi.yaml`: Đặc tả OpenAPI 3.0 chuẩn hóa cho toàn bộ REST API của Spring Boot và các endpoint webhook/internal của Node.js Gateway.
- Thư mục `docs/adr/`: Tối thiểu 3 tài liệu Quyết định Kiến trúc (Architectural Decision Records) theo mẫu ADR chuẩn:
  - `ADR-001-hybrid-spring-node-architecture.md`: Lý do tách riêng Core Business (Spring Boot) và Voice/AI Gateway (Node.js).
  - `ADR-002-realtime-voice-protocol-websocket.md`: Lý do chọn WebSocket thay vì gRPC hay WebRTC cho luồng âm thanh hai chiều.
  - `ADR-003-provider-abstraction-and-offline-fallback.md`: Kiến trúc đa nhà cung cấp AI và chiến lược fallback sang Mock khi thiếu API Key.

## 3. CÔNG CỤ SỬ DỤNG
- Skill: `system-architect` (tư vấn kiến trúc phân tán, RESTful standards RFC 7807, cấu trúc ADR).
- Skill: `api-engineer` & `api-documentation` (chuẩn hóa OpenAPI 3.0, thiết kế resource danh từ số nhiều, envelope pattern).
- Mermaid diagram rendering trong Markdown.

## 4. GIỚI HẠN PHẠM VI (SCOPE BOUNDARIES)
- Không viết code backend hoặc frontend trong phase này; chỉ tập trung vào tài liệu thiết kế và đặc tả kỹ thuật.
- Không mở rộng phạm vi ra ngoài 3 vai trò và 5 vị trí intern đã thỏa thuận.

## 5. CHECKLIST NGHIỆM THU (ACCEPTANCE CHECKLIST)
- [ ] 100% User Stories có Acceptance Criteria cụ thể, kiểm chứng được.
- [ ] Sơ đồ tuần tự Mermaid mô tả trọn vẹn 3 tình huống: Hội thoại bình thường, Ứng viên ngắt lời (Barge-in), và Mất kết nối/Reconnect.
- [ ] Đặc tả OpenAPI 3.0 bao phủ đầy đủ các nhóm endpoint: Auth, Positions, Questions, Interview Sessions, Transcripts, Evaluations, Consents.
- [ ] Các tài liệu ADR-001, ADR-002, ADR-003 được lập đầy đủ 4 phần (Title, Context, Decision, Consequences).
- [ ] Artifact tổng kết Phase 2 được tạo đầy đủ.
