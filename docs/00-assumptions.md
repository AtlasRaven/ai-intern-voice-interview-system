# TÀI LIỆU CÁC GIẢ ĐỊNH MẶC ĐỊNH HỆ THỐNG (DEFAULT ASSUMPTIONS)
**Dự án:** Hệ thống phỏng vấn intern cho sinh viên IT mới ra trường (Voice AI Interview System)  
**Mã tài liệu:** `DOCS-00-ASSUMPTIONS`  
**Phiên bản:** 1.0.0  
**Ngày lập:** 2026-11-05  
**Trạng thái:** Bản cơ sở (Baseline) – Người dùng / Product Owner có thể ghi đè khi cần.

---

## 1. Vai trò người dùng (User Roles & RBAC)
Hệ thống hỗ trợ 3 nhóm vai trò người dùng chính:
1. **Candidate (Ứng viên):**
   - Đăng ký tài khoản, quản lý thông tin cá nhân và tải lên CV/hồ sơ kỹ năng.
   - Xem danh sách các vị trí thực tập đang mở tuyển (Java BE, Node.js BE, Frontend React, QA/QC, Data/AI...).
   - Đặt lịch phỏng vấn hoặc bắt đầu phiên phỏng vấn thử nghiệm / chính thức.
   - Thực hiện phiên phỏng vấn thoại tương tác trực tiếp với AI Interviewer (cần chấp thuận ghi âm và thu thập dữ liệu giọng nói).
   - Xem kết quả đánh giá, điểm số rubric, transcript và phản hồi chi tiết cải thiện kỹ năng.
2. **Interviewer / HR (Nhà tuyển dụng & Chuyên gia phỏng vấn):**
   - Quản lý các vị trí thực tập, yêu cầu kỹ năng, và ngân hàng câu hỏi.
   - Theo dõi dashboard ứng viên: danh sách, bộ lọc theo điểm, kỹ năng, trạng thái.
   - Xem chi tiết từng phiên phỏng vấn: nghe lại audio (nếu có lưu), xem toàn văn transcript phân đoạn (timestamps), xem AI rubric scoring.
   - Hiệu chỉnh điểm số, bổ sung nhận xét thủ công của HR trước khi ra quyết định (Pass/Fail/Hold).
   - Xuất báo cáo tổng hợp danh sách ứng viên (CSV / JSON / PDF summary).
3. **Admin (Quản trị hệ thống):**
   - Quản lý tài khoản người dùng, phân quyền vai trò.
   - Cấu hình tiêu chí đánh giá (Evaluation Criteria / Rubric templates).
   - Giám sát nhật ký hoạt động hệ thống (Audit Logs), cấu hình rate limit, quản trị hệ thống.

---

## 2. Kiến trúc & Công nghệ lõi
- **Backend Nghiệp vụ cốt lõi:**
  - **Ngôn ngữ & Runtime:** Java 21 LTS.
  - **Framework:** Spring Boot 3.x (Spring Web, Spring Security, Spring Data JPA, Spring Validation).
  - **Database Migration:** Flyway.
  - **Tài liệu API:** Springdoc OpenAPI 3 (Swagger UI).
  - **Cổng dịch vụ mặc định:** `8080`.
- **Voice/AI Gateway (Realtime Processing):**
  - **Runtime & Ngôn ngữ:** Node.js 20 LTS + TypeScript.
  - **Giao thức:** WebSocket (ws / Socket.io) cho luồng streaming audio hai chiều và event control.
  - **Nhiệm vụ:** Điều phối toàn bộ pipeline `Candidate Mic Audio Stream -> STT -> Streaming Buffer -> LLM Context Engine -> TTS Audio Stream -> Client Speaker`.
  - **Giao tiếp với Spring Boot Core:** REST API nội bộ có xác thực bằng `Service Token` (Internal Shared Secret / Bearer Token).
  - **Cổng dịch vụ mặc định:** `3000`.
- **Cơ sở dữ liệu (Database):**
  - **Hệ quản trị CSDL:** PostgreSQL 16+.
  - **Chuẩn thiết kế:** Chuẩn hóa 3NF (Third Normal Form) chặt chẽ, không phụ thuộc bắc cầu, không cột lặp/đa trị.
  - **Cổng mặc định:** `5432`.
- **Frontend SPA:**
  - **Framework:** React 18+ với TypeScript, Vite, Tailwind CSS.
  - **Thư viện UI chuẩn:** Theo hướng dẫn `design-system-expert` (border radius 6-10px, giao diện phẳng phẳng, không gradient sặc sỡ, không glassmorphism).
  - **Cổng dịch vụ mặc định:** `5173`.
- **Đóng gói & Triển khai cục bộ:**
  - Docker Compose (`docker-compose.yml`) điều phối 4 containers: `postgres`, `backend-spring`, `voice-gateway-node`, `frontend`.

---

## 3. Kiến trúc Nhà cung cấp AI (Provider Abstraction) & Biến Môi Trường (.env)
Toàn bộ dịch vụ nhận dạng giọng nói (STT), tổng hợp giọng nói (TTS) và trí tuệ nhân tạo (LLM) bắt buộc phải nằm sau **Interface Provider trừu tượng**. Việc chuyển đổi giữa Provider thực và Mock Provider được điều khiển qua biến môi trường.

### 3.1. STT (Speech-to-Text)
- **Interface:** `ISTTProvider` (stream audio chunk $\rightarrow$ stream text/final transcript).
- **Nhà cung cấp chính:** Deepgram WebSocket Streaming (`language=vi`, model `nova-2` hoặc tương đương). Biến môi trường: `DEEPGRAM_API_KEY`.
- **Nhà cung cấp dự phòng:** Google Cloud Speech-to-Text (Streaming v2/v1).
- **Mock Provider:** `MockSTTProvider` (nhận diện audio chunk giả lập hoặc text injection offline, trả về transcript theo kịch bản chuẩn).
- **Cấu hình lựa chọn:** `STT_PROVIDER=real` hoặc `STT_PROVIDER=mock`.

### 3.2. LLM (Large Language Model)
- **Interface:** `ILLMProvider` (generateResponseStream, generateRubricEvaluation).
- **Nhà cung cấp chính:** Anthropic Claude:
  - Hội thoại realtime (độ trễ thấp): `claude-haiku-5-5`.
  - Đánh giá & Chấm điểm chuyên sâu theo Rubric: `claude-sonnet-5-5`.
  - Biến môi trường: `ANTHROPIC_API_KEY`.
- **Mock Provider:** `MockLLMProvider` (trả về câu hỏi tiếp theo từ ngân hàng câu hỏi định sẵn và chấm điểm mẫu hợp lệ theo format JSON Rubric).
- **Cấu hình lựa chọn:** `LLM_PROVIDER=real` hoặc `LLM_PROVIDER=mock`.

### 3.3. TTS (Text-to-Speech)
- **Interface:** `ITTSProvider` (text stream $\rightarrow$ audio chunk stream WAV/MP3).
- **Nhà cung cấp chính:** Azure Cognitive Services Speech (`voice: vi-VN-HoaiMyNeural` hoặc `vi-VN-NamMinhNeural`).
  - Biến môi trường: `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`.
- **Nhà cung cấp dự phòng:** MMS-TTS Vietnamese cục bộ (Meta Multilingual Speech).
- **Mock Provider:** `MockTTSProvider` (trả về audio chunk giả lập / silent PCM / sine wave audio header hợp lệ để frontend render sóng âm).
- **Cấu hình lựa chọn:** `TTS_PROVIDER=real` hoặc `TTS_PROVIDER=mock`.

### 3.4. Nguyên tắc An toàn & Fallback
- **Tuyệt đối KHÔNG hardcode bất kỳ khóa API nào** trong source code hoặc commit vào Git.
- Cung cấp file `.env.example` đầy đủ mẫu biến cho từng service.
- **Tự động Fallback an toàn:** Nếu `STT_PROVIDER=real`, `TTS_PROVIDER=real`, hoặc `LLM_PROVIDER=real` nhưng trong môi trường bị thiếu Key (rỗng hoặc không hợp lệ), Gateway tự động chuyển sang chế độ `mock` tương ứng và ghi cảnh báo rõ ràng cấp `WARN` vào log hệ thống: `"[PROVIDER_FALLBACK] Missing API key for {Provider}. Automatically falling back to MockProvider."`

---

## 4. Ngôn ngữ & Kịch bản phỏng vấn
- **Ngôn ngữ phỏng vấn mặc định:** Tiếng Việt (chuyên ngành Công nghệ thông tin, chấp nhận thuật ngữ kỹ thuật tiếng Anh như *API, database, garbage collection, indexing, polymorphism...*).
- **Khả năng mở rộng:** Kiến trúc thiết kế hỗ trợ đa ngôn ngữ (chuyển đổi cờ `interview_language: 'vi' | 'en'`).

---

## 5. Danh mục vị trí Intern ban đầu
Hệ thống cung cấp sẵn dữ liệu mẫu cho các vị trí:
1. **Java Backend Intern:** OOP, Java Core, Spring Boot basics, REST API, SQL queries.
2. **Node.js Backend Intern:** JavaScript/TypeScript, Event Loop, Express/Nest, Asynchronous programming, NoSQL/SQL.
3. **Frontend React Intern:** HTML/CSS/JavaScript ES6+, React Hooks, State Management, Component Lifecycle, Web Performance.
4. **QA/QC Intern:** Testing fundamentals (Manual vs Automation), Test Case Design, Bug Lifecycle, API Testing (Postman).
5. **Data/AI Intern:** Python basics, SQL, Data processing (Pandas), Machine Learning workflow, LLM fundamentals.

---

## 6. Yêu cầu Phi chức năng & Bảo mật
- **Bảo mật danh tính & Xác thực:** JWT (JSON Web Token) có thời hạn ngắn + Refresh Token, mã hóa mật khẩu bằng BCrypt (`strength = 12`).
- **Phân quyền truy cập (RBAC):** Kiểm soát quyền ở mức URL và Service Method (`@PreAuthorize("hasRole('...')")`).
- **Quyền riêng tư & Xin phép (Consent):** Bắt buộc ứng viên chấp thuận điều khoản ghi âm giọng nói trước khi khởi tạo WebSocket session; lưu bản ghi chấp thuận vào bảng `consents`.
- **Mã hóa / Ẩn PII (Personally Identifiable Information):** Ẩn số điện thoại, email trong các log và báo cáo public; không gửi PII của ứng viên vào prompt cho bên thứ ba ngoại trừ ngữ cảnh kỹ năng cần thiết.
- **Bảo vệ hệ thống:** Rate limiting (chống spam request vào auth & websocket), audit logging cho mọi thao tác của HR/Admin.
- **Khả năng phục hồi phiên:** Xử lý mất kết nối tạm thời giữa phiên (reconnect trong vòng 60 giây giữ nguyên state machine và transcript). Cung cấp phương án nhập văn bản dự phòng (Text Chat Fallback) khi ứng viên gặp sự cố thiết bị micro.
