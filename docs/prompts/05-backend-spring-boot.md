# CHILD PROMPT: PHASE 5 – TRIỂN KHAI BACKEND SPRING BOOT CỐT LÕI
**Mã tài liệu:** `DOCS-PROMPT-05-BACKEND-SPRING`  
**Giai đoạn:** Phase 5  
**Mục tiêu:** Xây dựng toàn bộ dịch vụ backend cốt lõi bằng Java 21 và Spring Boot 3.x, cung cấp REST API nghiệp vụ, xác thực JWT + RBAC, tích hợp Flyway, và giao tiếp an toàn với Voice/AI Gateway.

---

## 1. ĐẦU VÀO (INPUT)
- `docs/00-assumptions.md`: Ràng buộc Java 21, Spring Boot 3, cổng 8080, JWT, Flyway.
- `docs/02-system-architecture.md`: Đặc tả nghiệp vụ và giao thức Internal Service Key.
- `docs/04-openapi.yaml`: Hợp đồng API chuẩn.
- Migration scripts từ Phase 3 (`V1__init_schema.sql`, `V2__seed_data.sql`).

## 2. ĐẦU RA MONG ĐỢI (EXPECTED OUTPUT)
Mã nguồn module `/backend-spring` hoàn chỉnh, có thể biên dịch và khởi chạy độc lập:
1. **Kiến trúc Phân tầng (Layered Architecture):**
   - `controller`: Các REST Controllers chuẩn RESTful, sử dụng OpenAPI annotations (`@Operation`, `@ApiResponse`).
   - `service` & `service.impl`: Logic nghiệp vụ, giao dịch (`@Transactional`), không chứa code thừa thãi.
   - `repository`: Spring Data JPA Interfaces với truy vấn JPQL/Derived Queries được tối ưu hóa.
   - `dto` (Request/Response): Data Transfer Objects rõ ràng, có đầy đủ Bean Validation (`@NotBlank`, `@Size`, `@Min`, `@Max`).
   - `entity`: JPA Entities ánh xạ 1-1 chính xác với schema 3NF ở Phase 3.
   - `mapper`: Chuyển đổi Entity $\leftrightarrow$ DTO.
2. **Bảo mật & Phân quyền (Spring Security 6):**
   - Cấu hình Stateless Session (`SessionCreationPolicy.STATELESS`).
   - `JwtTokenProvider` & `JwtAuthenticationFilter`: Xác thực JWT Bearer Token cho Candidate, Interviewer, Admin.
   - Phân quyền theo vai trò (`hasRole('CANDIDATE')`, `hasRole('INTERVIEWER')`, `hasRole('ADMIN')`).
   - `InternalServiceAuthFilter`: Xác thực cuộc gọi nội bộ từ Node.js Gateway qua header `X-Internal-Service-Key` (dùng cho việc lưu transcript và kết quả chấm điểm).
3. **Xử lý Ngoại lệ Toàn cục (Global Exception Handling):**
   - `@RestControllerAdvice` định dạng phản hồi lỗi chuẩn RFC 7807 (Problem Details: `type`, `title`, `status`, `detail`, `timestamp`).
4. **Cấu hình & Tích hợp:**
   - `application.yml` liên kết database PostgreSQL, tự động kích hoạt Flyway migration khi khởi động.
   - Hỗ trợ biến môi trường: `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `JWT_SECRET`, `INTERNAL_SERVICE_KEY`.
   - Cung cấp file `.env.example`.

## 3. CÔNG CỤ SỬ DỤNG
- Skill: `system-architect` (chuẩn kiến trúc phân tầng, phân tách domain).
- Skill: `api-engineer` (kiểm tra đối chiếu với OpenAPI contract).
- Skill: `doc-generator` (tài liệu hóa mã nguồn JavaDoc cho các public API methods).
- Shell CLI: `mvn clean compile` để kiểm tra biên dịch mã nguồn Java.

## 4. GIỚI HẠN PHẠM VI (SCOPE BOUNDARIES)
- Backend Spring Boot chỉ đảm nhiệm REST API nghiệp vụ, xác thực, quản lý thực thể, lưu trữ transcript và đánh giá; **KHÔNG** xử lý streaming WebSocket âm thanh (việc này do Node.js Gateway phụ trách).
- Không thêm các thư viện boilerplate dư thừa ngoài danh mục cần thiết.

## 5. CHECKLIST NGHIỆM THU (ACCEPTANCE CHECKLIST)
- [ ] Dự án Maven biên dịch thành công không có lỗi (`mvn clean compile` thành công).
- [ ] Flyway tự động thực thi các file di chuyển schema và dữ liệu seed khi ứng dụng khởi động.
- [ ] Endpoint `/api/v1/auth/register` và `/api/v1/auth/login` cấp phát JWT hợp lệ.
- [ ] Toàn bộ CRUD cho Positions, Questions, Interview Sessions và Evaluations hoạt động đúng phân quyền RBAC.
- [ ] Endpoint nội bộ lưu trữ phân đoạn transcript (`POST /api/v1/internal/sessions/{id}/transcripts`) và lưu kết quả chấm điểm (`POST /api/v1/internal/sessions/{id}/evaluations`) yêu cầu và kiểm tra đúng `X-Internal-Service-Key`.
- [ ] Định dạng lỗi tuân thủ đúng chuẩn RFC 7807.
- [ ] Artifact tổng kết Phase 5 được tạo đầy đủ.
