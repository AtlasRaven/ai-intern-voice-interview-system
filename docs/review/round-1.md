# BÁO CÁO CODE REVIEW - VÒNG 1 (ROUND 1)

**Ngày thực hiện:** 05/11/2026  
**Chuyên gia đánh giá:** Senior Code Reviewer / Solution Architect  
**Phạm vi:** Toàn bộ mã nguồn `/backend-spring`, `/voice-gateway-node`, `/frontend`, `/docs`.  
**Bộ quy chuẩn:** OWASP Top 10, Clean Code, Performance, Memory Leak, ACID & Transactional Integrity.

---

## 1. TỔNG QUAN ĐÁNH GIÁ
- **Trạng thái:** ⚠️ Cần sửa đổi trước khi nghiệm thu hoàn tất.
- **Đánh giá chung:** Hệ thống được thiết kế theo đúng kiến trúc phân lớp chuẩn mực, tuân thủ 100% chuẩn cơ sở dữ liệu 3NF, bảo mật JWT stateless, mật khẩu băm BCrypt 12, phân quyền RBAC và Header nội bộ `X-Internal-Service-Key`. Tuy nhiên, phát hiện một số điểm cần tối ưu về N+1 Query trong Spring Data JPA và quản lý bộ nhớ (lifecycle cleanup) trong WebSocket Gateway.

---

## 2. BẢNG TỔNG HỢP PHÁT HIỆN

| ID | Mức độ | Phân loại | Tệp tin & Dòng | Tóm tắt phát hiện |
| :--- | :--- | :--- | :--- | :--- |
| **REV-01** | 🟠 `[MAJOR]` | Hiệu năng CSDL (N+1 Query) | `EvaluationRepository.java:16-21`<br>`EvaluationServiceImpl.java:38-42` | `findWithFilters` không dùng `JOIN FETCH`, dẫn đến N+1 lazy queries khi duyệt danh sách đánh giá ứng viên. |
| **REV-02** | 🟠 `[MAJOR]` | Quản lý bộ nhớ (Memory Leak) | `WebSocketGateway.ts:11-48`<br>`InterviewStateMachine.ts:229-256` | Map `activeSessions` lưu giữ phiên phỏng vấn vĩnh viễn, không xóa sau khi phiên kết thúc (`SESSION_COMPLETED`). |
| **REV-03** | 🟡 `[MINOR]` | Tính ổn định (Robustness) | `InterviewSessionServiceImpl.java:77-94` | Gán câu hỏi vào phiên mới chỉ lọc theo `positionId`; nếu vị trí mới tạo chưa đủ câu hỏi thì phiên có thể bị thiếu câu hỏi. |
| **REV-04** | 🟡 `[MINOR]` | Cấu hình bảo mật & Mạng | `SecurityConfig.java` & `env.ts` | Cần cấu hình CORS linh hoạt hỗ trợ cả môi trường Docker Compose (`frontend:80`, `gateway:3000`). |
| **REV-05** | 🔵 `[NITPICK]` | Quy chuẩn DevOps | `docker-compose.yml` | Cần bổ sung healthcheck condition `service_healthy` cho PostgreSQL trước khi Spring Boot khởi động. |

---

## 3. CHI TIẾT TỪNG PHÁT HIỆN & PHƯƠNG ÁN KHẮC PHỤC

### 🔴 LỖ HỔNG CRITICAL: 0
*(Không có lỗ hổng bảo mật nghiêm trọng hay lỗi crash hệ thống)*

---

### 🟠 PHÁT HIỆN MAJOR

#### [REV-01] 🟠 [MAJOR] N+1 Query trong truy vấn danh sách kết quả đánh giá (HR Dashboard)
- **Vị trí:** `backend-spring/src/main/java/com/intern/interview/repository/EvaluationRepository.java#L16-L21`
- **Nguyên nhân gốc rễ (RCA):**
  Phương thức `findWithFilters` thực hiện câu lệnh JPQL `SELECT e FROM Evaluation e WHERE ...`. Khi `EvaluationServiceImpl.toDto()` duyệt qua từng bản ghi `Evaluation`, việc gọi `e.getSession().getCandidate().getUser().getFullName()` và `e.getSession().getPosition().getTitle()` sẽ kích hoạt hàng loạt câu truy vấn SQL đơn lẻ (N+1 query) để nạp các quan hệ `@ManyToOne(fetch = FetchType.LAZY)`.
- **Phương án khắc phục:**
  Sử dụng `JOIN FETCH` trên toàn bộ đường dẫn thực thể:
  ```java
  @Query("SELECT e FROM Evaluation e " +
         "JOIN FETCH e.session s " +
         "JOIN FETCH s.candidate c " +
         "JOIN FETCH c.user u " +
         "JOIN FETCH s.position p " +
         "WHERE (:positionId IS NULL OR p.id = :positionId) AND " +
         "(:minScore IS NULL OR e.overallScore >= :minScore) " +
         "ORDER BY e.overallScore DESC")
  List<Evaluation> findWithFilters(@Param("positionId") Integer positionId,
                                   @Param("minScore") BigDecimal minScore);
  ```

#### [REV-02] 🟠 [MAJOR] Rò rỉ tài nguyên bộ nhớ trong Node.js WebSocket Gateway
- **Vị trí:** `voice-gateway-node/src/gateway/WebSocketGateway.ts#L11-L48`
- **Nguyên nhân gốc rễ (RCA):**
  Biến `activeSessions = new Map<string, { fsm: InterviewStateMachine; ws: WebSocket }>()` lưu các phiên đang chạy. Khi phiên đạt trạng thái `COMPLETED` hoặc hết hạn grace period reconnect, mục tương ứng không được xóa khỏi Map. Trong môi trường production chạy liên tục nhiều ngày với hàng nghìn ứng viên, điều này sẽ gây rò rỉ bộ nhớ (Memory Leak) do các đối tượng FSM, WebSocket, và Audio Buffer không thể được Garbage Collector giải phóng.
- **Phương án khắc phục:**
  1. Thêm hook hủy dọn dẹp `fsm.destroy()` để hủy bỏ toàn bộ timer (`silenceTimer`, `reconnectTimer`).
  2. Bổ sung listener lắng nghe sự kiện `SESSION_COMPLETED` hoặc socket disconnect vĩnh viễn để gọi `this.activeSessions.delete(sessionKey)`.

---

### 🟡 PHÁT HIỆN MINOR

#### [REV-03] 🟡 [MINOR] Bổ sung cơ chế Fallback câu hỏi khi vị trí tuyển dụng mới chưa có đủ câu hỏi
- **Vị trí:** `backend-spring/src/main/java/com/intern/interview/service/impl/InterviewSessionServiceImpl.java#L77-L94`
- **Khắc phục:** Khi `easyQuestions` hoặc `mediumQuestions` theo `positionId` bị rỗng, tự động lấy các câu hỏi chung đang active theo cấp độ để đảm bảo mỗi phiên luôn có đủ 3 - 4 câu hỏi phỏng vấn chuẩn mực.

---

## 4. KẾ HOẠCH KHẮC PHỤC
1. Tiến hành sửa mã nguồn cho `REV-01`, `REV-02`, `REV-03`.
2. Chạy lại toàn bộ test suite (`mvn clean test` và `npm test`) để xác nhận tính toàn vẹn và không phát sinh hồi quy.
3. Lập báo cáo xác nhận tại `docs/review/round-2.md`.
