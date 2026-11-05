# MA TRẬN ÁNH XẠ CÔNG CỤ VÀ KỸ NĂNG (TOOL & SKILL MAP)
**Dự án:** Hệ thống phỏng vấn intern cho sinh viên IT mới ra trường (Voice AI Interview System)  
**Mã tài liệu:** `DOCS-01-TOOL-MAP`  
**Phiên bản:** 1.0.0  
**Ngày lập:** 2026-11-05  

---

## 1. Bảng kiểm kê tài sản công cụ khả dụng trong Workspace

| Phân loại | Tên công cụ / Kỹ năng / Plugin | Đường dẫn / Nhận diện | Phạm vi năng lực chính |
| :--- | :--- | :--- | :--- |
| **Skill** | `system-architect` | `.agents/skills/system-architect` | Thiết kế kiến trúc phân tán, chuẩn RESTful, chuẩn hóa DB 3NF, lập ADR |
| **Skill** | `api-engineer` | `plugins/postman/skills/api-engineer` | Thiết kế API contract-first, quản trị dependency, Postman collections |
| **Skill** | `api-documentation` | `plugins/postman/skills/api-documentation` | Chuẩn hóa OpenAPI 3.0, tài liệu hóa endpoint, request/response schema |
| **Skill** | `api-testing` | `plugins/postman/skills/api-testing` | Kiểm thử contract, assertion API tự động |
| **Skill** | `code-reviewer` | `.agents/skills/code-reviewer` | Quét OWASP Top 10, phát hiện memory leak, N+1 query, phân loại Critical/Major/Minor |
| **Skill** | `bug-diagnostician` | `.agents/skills/bug-diagnostician` | Chẩn đoán nguyên nhân gốc rễ (RCA) qua stack trace, exception, log |
| **Skill** | `design-system-expert` | `.agents/skills/design-system-expert` | Thiết kế UI/UX theo Ant Design / shadcn/ui, border-radius 6-10px, giao diện phẳng chuẩn |
| **Skill** | `test-generator` | `.agents/skills/test-generator` | Sinh Unit & Integration Test theo mẫu AAA, tiêu chuẩn FIRST, bao phủ 3 nhóm kịch bản |
| **Skill** | `git-commit-helper` | `.agents/skills/git-commit-helper` | Chuẩn hóa thông điệp commit theo Conventional Commits |
| **Skill** | `doc-generator` | `.agents/skills/doc-generator` | Sinh JSDoc, JavaDoc, chú thích mã nguồn kỹ thuật |
| **Skill** | `drawio-skill` | `.agents/skills/drawio-skill` | Thiết kế sơ đồ kiến trúc phức tạp dạng XML / Draw.io |
| **Skill** | `a11y-debugging` | `plugins/chrome-devtools-plugin/...` | Kiểm tra độ tương phản màu, ARIA label, phím tắt và khả năng tiếp cận |
| **Skill** | `memory-leak-debugging`| `plugins/chrome-devtools-plugin/...` | Phân tích heap snapshot, rò rỉ bộ nhớ WebSocket/Stream |
| **Skill** | `nha-phat-trien-than-thien-style` | `.agents/skills/nha-phat-trien-than-thien-style` | Phong cách giao tiếp chuẩn kỹ thuật, thân thiện, rõ ràng |
| **MCP Server** | `postgres` | MCP Tool `postgres.query` | Truy vấn kiểm tra cơ sở dữ liệu PostgreSQL trực tiếp |
| **MCP Server** | `filesystem` | Native & MCP filesystem tools | Đọc, ghi, sửa, duyệt cấu trúc tập tin an toàn |
| **MCP Server** | `github` | MCP Github tools | Quản lý pull request, issue, commit |
| **Subagent** | `self` | Built-in Subagent Invoker | Khởi tạo tiến trình subagent độc lập cho các tác vụ phức tạp |
| **Subagent** | `research` | Built-in Research Subagent | Nghiên cứu tài liệu kỹ thuật và tìm kiếm chuyên sâu trong sandbox |
| **Shell/CLI** | `run_command` (PowerShell) | Native execution | Thực thi Maven, Node, npm, Vite, Vitest, Playwright, Docker |

---

## 2. Bảng ánh xạ từng Phase $\rightarrow$ Công cụ sử dụng $\rightarrow$ Lý do cụ thể

| Phase thực hiện | Công cụ / Kỹ năng sử dụng | Lý do sử dụng & Vai trò đảm nhiệm |
| :--- | :--- | :--- |
| **Phase 0: Kiểm kê công cụ** | `filesystem`, `run_command`, `git-commit-helper` | Kiểm tra môi trường cục bộ (Java, Node, Docker, Postgres), thiết lập tài liệu công cụ và commit chuẩn. |
| **Phase 1: Lập Master Prompt & Prompt con** | `system-architect`, `api-engineer`, `doc-generator` | Xây dựng tài liệu chủ đạo (`00-master.md`), định nghĩa Definition of Done chặt chẽ và bóc tách prompt cho 8 phase kế tiếp. |
| **Phase 2: Phân tích & Thiết kế hệ thống** | `system-architect`, `api-engineer`, `api-documentation`, `drawio-skill` | Lập Use Cases, User Stories kèm AC, vẽ Sequence Diagram luồng Voice WebSocket, ranh giới Spring Boot $\leftrightarrow$ Node.js Gateway qua REST Service Token, xuất OpenAPI 3.0 và viết ADR. |
| **Phase 3: CSDL 3NF & Flyway** | `system-architect`, `postgres` (MCP), `run_command` | Thiết kế ERD chuẩn 3NF, chứng minh không có phụ thuộc bắc cầu/đa trị, viết file migration Flyway SQL (`V1__...`, `V2__...`), nạp seed data mẫu và kiểm tra trực tiếp trên PostgreSQL. |
| **Phase 4: Thiết kế Giao diện (UI/UX)** | `design-system-expert`, `a11y-debugging` | Thiết kế Wireframe, Design Tokens (radius 6-10px, neutral solid, không gradient/glassmorphism), mô phỏng buồng phỏng vấn (sóng âm, trạng thái AI, phụ đề realtime, text fallback). |
| **Phase 5: Triển khai Backend Spring Boot** | `system-architect`, `api-engineer`, `doc-generator`, `run_command` | Tạo module `backend-spring` với Java 21/Spring Boot 3, phân tầng rõ ràng (controller/service/repo/dto), cấu hình JWT + RBAC, Flyway integration, Global Exception Handling RFC 7807, Springdoc OpenAPI. |
| **Phase 6: Triển khai Voice/AI Gateway** | `system-architect`, `api-engineer`, `run_command` | Tạo module `voice-gateway-node` với Node.js 20 + TypeScript, WebSocket server, quản lý State Machine phiên phỏng vấn, Provider Interface & Mock Provider (STT/LLM/TTS), cơ chế barge-in, silence detection, guardrails prompt. |
| **Phase 7: Triển khai Frontend React** | `design-system-expert`, `a11y-debugging`, `run_command` | Xây dựng SPA React + TypeScript + Vite + Tailwind CSS: trang đăng nhập, hồ sơ candidate, phòng phỏng vấn trực quan bằng giọng nói và micro, HR Dashboard quản lý ứng viên và kết quả. |
| **Phase 8: Kiểm thử tự động (QA Lead)** | `test-generator`, `api-testing`, `run_command` | Viết JUnit 5 + Mockito cho Spring Boot, Vitest cho Node.js Gateway State Machine & WebSocket, Playwright cho E2E kiểm thử luồng người dùng hoàn chỉnh. Đo coverage $\ge 80\%$ và lập bảng `docs/test-traceability.md`. |
| **Phase 9: Tự review & Sửa lỗi (3 vòng)** | `code-reviewer`, `bug-diagnostician`, `memory-leak-debugging` | Review toàn bộ codebase theo checklist OWASP Top 10, memory leak (WebSocket listener, stream cleanup), N+1 query, lập `docs/review/round-N.md`, sửa triệt để Critical/Major. |

---

## 3. Các công cụ thiếu và Phương án thay thế kỹ thuật (Không bịa đặt)

1. **Autonomous Browser Subagent độc lập:**
   - *Hiện trạng:* Workspace không có subagent độc lập mang tên `browser-agent` có khả năng tự động click trình duyệt không thông qua tool.
   - *Phương án thay thế:* Sử dụng **Playwright CLI** (`npx playwright test`) kết hợp với headless Chromium cho kiểm thử tự động E2E luồng ứng viên và HR, đồng thời dùng các kỹ năng `chrome-devtools` / `a11y-debugging` cho việc audit DOM và accessibility.
2. **Flyway Standalone CLI Binary:**
   - *Hiện trạng:* Lệnh `flyway` không nằm trong biến môi trường Windows `PATH`.
   - *Phương án thay thế:* Tích hợp dependency `flyway-core` và `flyway-database-postgresql` trực tiếp vào Spring Boot Maven để tự động migrate khi khởi động ứng dụng, kết hợp thực thi script SQL thủ công qua `psql` / node script / `postgres.query` MCP tool khi cần thẩm định schema độc lập.
3. **API Keys Nhà cung cấp AI bên ngoài (Anthropic, Deepgram, Azure Speech):**
   - *Hiện trạng:* Môi trường local có thể chưa được người dùng cấp key thật trong `.env`.
   - *Phương án thay thế:* Toàn bộ dịch vụ được bao bọc bởi kiến trúc `Provider Abstraction` (`ISTTProvider`, `ILLMProvider`, `ITTSProvider`). Gateway tự động kích hoạt `MockSTTProvider`, `MockLLMProvider`, `MockTTSProvider` với dữ liệu kịch bản chuẩn xác, cho phép chạy offline 100% không làm gián đoạn tiến độ.
