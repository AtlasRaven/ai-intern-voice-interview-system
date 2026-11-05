# CHILD PROMPT: PHASE 8 – KIỂM THỬ TỰ ĐỘNG TOÀN DIỆN (AUTOMATED TESTING)
**Mã tài liệu:** `DOCS-PROMPT-08-AUTOMATED-TESTING`  
**Giai đoạn:** Phase 8  
**Mục tiêu:** Xây dựng và thực thi bộ kiểm thử tự động toàn diện bao gồm Unit Test, Integration Test, Contract Test và E2E Test. Đo lường độ bao phủ (line coverage $\ge 80\%$ trên tầng service/domain), thiết lập ma trận truy vết (Test Traceability Matrix) và đính kèm nhật ký chạy test thực tế.

---

## 1. ĐẦU VÀO (INPUT)
- Mã nguồn đã hoàn thiện của 3 module: `/backend-spring`, `/voice-gateway-node`, `/frontend`.
- `docs/02-system-architecture.md`: Danh sách User Stories và Acceptance Criteria cần kiểm chứng.
- `docs/04-openapi.yaml`: Contract API để đối chiếu kiểm thử.

## 2. ĐẦU RA MONG ĐỢI (EXPECTED OUTPUT)
1. **Kiểm thử Backend Spring Boot (JUnit 5 + Mockito + MockMvc):**
   - Unit tests cho các Service: `AuthService`, `PositionService`, `QuestionService`, `InterviewSessionService`, `EvaluationService`.
   - Controller MockMvc tests: Kiểm tra xác thực JWT, phân quyền RBAC (Role Candidate vs HR vs Admin), xác thực `X-Internal-Service-Key`, và kiểm tra validation DTO (trường rỗng, email sai, điểm vượt giới hạn).
   - Đảm bảo độ bao phủ dòng code (Line Coverage) $\ge 80\%$ trên các package `service` và `controller`.
2. **Kiểm thử Voice/AI Gateway (Vitest / Jest):**
   - Unit tests kiểm thử State Machine: Chuyển đổi trạng thái `INITIALIZING` $\rightarrow$ `ASKING` $\rightarrow$ `LISTENING` $\rightarrow$ `THINKING` $\rightarrow$ `EVALUATING` $\rightarrow$ `COMPLETED`.
   - Tests cho Provider Abstraction: Xác nhận fallback tự động sang Mock Provider khi thiếu biến môi trường API Key.
   - Tests mô phỏng WebSocket: Kết nối client, gửi audio chunk giả lập, kích hoạt sự kiện ngắt lời (Barge-in), và phát hiện im lặng (Silence timeout).
3. **Kiểm thử Đầu - Cuối (End-to-End E2E Testing bằng Playwright):**
   - Kịch bản 1 (Candidate Flow): Đăng nhập $\rightarrow$ Xem vị trí $\rightarrow$ Ký Audio Consent $\rightarrow$ Vào phòng phỏng vấn $\rightarrow$ Hoàn thành lượt hỏi đáp thoại (với mock voice audio) $\rightarrow$ Xem báo cáo đánh giá & transcript.
   - Kịch bản 2 (HR Flow): Đăng nhập quyền HR $\rightarrow$ Truy cập HR Dashboard $\rightarrow$ Lọc danh sách ứng viên $\rightarrow$ Xem chi tiết phiên phỏng vấn $\rightarrow$ Hiệu chỉnh điểm số và lưu nhận xét thành công.
4. **Tài liệu Ma trận Truy vết Kiểm thử (`docs/test-traceability.md`):**
   - Bảng ánh xạ 1-1 giữa từng User Story / Acceptance Criteria với tên file test và tên test case cụ thể.
   - Bằng chứng thực tế: Đính kèm toàn bộ log đầu ra của lệnh chạy test (`mvn test`, `npm test`, `npx playwright test`), chứng minh 100% test case PASS.

## 3. CÔNG CỤ SỬ DỤNG
- Skill: `test-generator` (áp dụng cấu trúc AAA: Arrange - Act - Assert, tiêu chuẩn FIRST, bao phủ 3 nhóm: Happy path, Edge cases, Failure scenarios).
- Skill: `api-testing` (kiểm tra contract và assertions).
- Shell CLI: `mvn test`, `npm run test`, `npx playwright test`.

## 4. GIỚI HẠN PHẠM VI (SCOPE BOUNDARIES)
- Tuyệt đối không giả mạo kết quả test ("fake pass"); bắt buộc phải thực thi lệnh test thật và trích xuất output từ terminal.
- Các bài test không được phụ thuộc vào cloud credit hoặc API key thực tế; sử dụng triệt để Mock Providers và in-memory/isolated fixtures.

## 5. CHECKLIST NGHIỆM THU (ACCEPTANCE CHECKLIST)
- [ ] Backend Spring Boot test chạy pass 100%, line coverage $\ge 80\%$ cho các lớp service.
- [ ] Node.js Gateway test chạy pass 100%, bao phủ State Machine, Mock Providers, và WebSocket events.
- [ ] Playwright E2E test chạy thành công cả 2 luồng Candidate và HR.
- [ ] File `docs/test-traceability.md` được lập đầy đủ, không bỏ sót bất kỳ User Story nào.
- [ ] Trích xuất log thực thi thật làm bằng chứng nghiệm thu trong Artifact.
