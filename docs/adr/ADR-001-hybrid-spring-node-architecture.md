# ADR-001: Kiến trúc Phân tán Lai Spring Boot (Core) và Node.js (Voice Gateway)
**Ngày:** 2026-11-05  
**Trạng thái:** Chấp thuận (Accepted)  
**Tác giả:** Solution Architect  

---

## 1. Ngữ cảnh (Context)
Hệ thống phỏng vấn tuyển dụng sinh viên IT mới ra trường có hai nhóm yêu cầu kỹ thuật với đặc thù tải và mô hình I/O hoàn toàn khác nhau:
1. **Nghiệp vụ Doanh nghiệp & Quản lý Dữ liệu:** Quản lý tài khoản, RBAC, vị trí tuyển dụng, ngân hàng câu hỏi, phiên phỏng vấn, transcript, đánh giá và audit log. Yêu cầu tính toàn vẹn dữ liệu giao dịch ACID cao, chuẩn hóa 3NF chặt chẽ, bảo mật doanh nghiệp và khả năng bảo trì lâu dài.
2. **Xử lý Âm thanh Thời gian thực (Realtime Voice Pipeline):** Duy trì hàng nghìn kết nối WebSocket streaming audio hai chiều (binary chunks), điều phối pipeline STT $\rightarrow$ LLM $\rightarrow$ TTS với độ trễ thấp, phát hiện ngắt lời (Barge-in), và phát hiện im lặng.

Nếu xây dựng toàn bộ trên Java Spring Boot (kể cả WebSocket audio streaming):
- Khối lượng thread và memory footprint cho WebSocket streaming audio nhị phân trên JVM đòi hỏi cấu hình Netty/WebFlux phức tạp, khó tích hợp hệ sinh thái SDK AI thế hệ mới (Deepgram, Anthropic Claude streaming) vốn được tối ưu tốt nhất trên Node.js/TypeScript.

Nếu xây dựng toàn bộ trên Node.js:
- Hệ sinh thái ORM và quản lý giao dịch doanh nghiệp (Flyway, JPA, Spring Security RBAC) trên Node.js kém ổn định và khó chuẩn hóa mô hình 3NF chặt chẽ bằng Java Spring Boot.

## 2. Quyết định (Decision)
Chúng tôi quyết định áp dụng **Mô hình Kiến trúc Phân tán Lai (Hybrid Distributed Architecture)**:
- **Core Business Service:** Xây dựng bằng **Java 21 + Spring Boot 3.x**. Chịu trách nhiệm toàn bộ REST API, Spring Security JWT + RBAC, nghiệp vụ lưu trữ PostgreSQL 3NF, Flyway migration, và kiểm tra phân quyền.
- **Voice/AI Gateway:** Xây dựng bằng **Node.js 20 + TypeScript**. Chịu trách nhiệm toàn bộ các kết nối WebSocket client, streaming audio chunk, điều phối STT/LLM/TTS, máy trạng thái phiên (State Machine), và cơ chế Barge-in.
- **Giao thức liên kết:** Node.js Gateway giao tiếp với Spring Boot Backend qua REST API nội bộ có xác thực bằng `X-Internal-Service-Key`.

## 3. Hệ quả (Consequences)
### Lợi ích (Positive):
- Tận dụng thế mạnh I/O bất đồng bộ Non-blocking Event Loop của Node.js cho streaming WebSocket âm thanh và SDK AI.
- Tận dụng thế mạnh bảo mật, transaction ACID, validation mạnh mẽ và ORM hoàn hảo của Java Spring Boot cho dữ liệu nghiệp vụ.
- Hai dịch vụ mở rộng (scale) độc lập: Voice Gateway scale theo số lượng kết nối audio đồng thời; Spring Boot scale theo số lượng truy vấn dữ liệu.

### Đánh đổi (Trade-offs):
- Phải duy trì hai runtime (Java JVM và Node.js V8) trong hạ tầng triển khai.
- Cần cơ chế bảo mật liên dịch vụ an toàn (`X-Internal-Service-Key`) để chống truy cập trái phép vào các endpoint nội bộ.
