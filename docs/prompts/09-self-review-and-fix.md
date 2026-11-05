# CHILD PROMPT: PHASE 9 – TỰ REVIEW VÀ SỬA LỖI (VÒNG LẶP QUALITY GATE)
**Mã tài liệu:** `DOCS-PROMPT-09-SELF-REVIEW`  
**Giai đoạn:** Phase 9  
**Mục tiêu:** Rà soát toàn diện mã nguồn toàn bộ hệ thống (Spring Boot, Node.js Gateway, React Frontend, CSDL Flyway), đối chiếu với Master Prompt, User Stories và OWASP Top 10. Phân loại phát hiện theo các mức độ nghiêm trọng, sửa triệt để các lỗi Critical và Major qua tối đa 3 vòng lặp, chạy lại toàn bộ test suite để đảm bảo không có lỗi hồi quy (regression).

---

## 1. ĐẦU VÀO (INPUT)
- Toàn bộ codebase tại `/backend-spring`, `/voice-gateway-node`, `/frontend`, `/docs`.
- Bộ tiêu chuẩn đánh giá của `code-reviewer`:
  - OWASP Top 10 (Injection, Broken Auth, Sensitive Data Exposure, Broken Access Control, Security Misconfiguration, v.v.).
  - Rò rỉ tài nguyên & bộ nhớ (Memory Leaks, unclosed Streams, WebSocket event listeners không cleanup).
  - Hiệu năng cơ sở dữ liệu (N+1 Query Problem, missing indexes, transaction management).
  - Nguyên tắc Clean Code, SOLID, DRY, naming conventions.
- Kết quả kiểm thử tự động từ Phase 8.

## 2. ĐẦU RA MONG ĐỢI (EXPECTED OUTPUT)
- Thư mục `docs/review/`:
  - `docs/review/round-1.md`: Báo cáo rà soát vòng 1 với danh sách phát hiện được gắn nhãn rõ ràng:
    - 🔴 `[CRITICAL]`: Lỗ hổng bảo mật nghiêm trọng, nguy cơ crash, rò rỉ dữ liệu hoặc sai lệch nghiệp vụ.
    - 🟠 `[MAJOR]`: Lỗi hiệu năng (N+1 query), thiếu xử lý ngoại lệ biên, rò rỉ kết nối, vi phạm kiến trúc.
    - 🟡 `[MINOR]`: Cải thiện chất lượng mã nguồn, tối ưu type safety, bổ sung comment/JavaDoc.
    - 🔵 `[NITPICK]`: Định dạng, khoảng trắng, quy ước đặt tên nhỏ.
    - Kèm chính xác `file:dòng`, phân tích nguyên nhân và phương án sửa chữa.
  - Các commit sửa lỗi tương ứng với từng phát hiện Critical và Major.
  - `docs/review/round-2.md` (nếu cần sau khi sửa để xác nhận kiểm tra lại).
  - `docs/review/final-summary.md`: Báo cáo tổng kết xác nhận 0 lỗi Critical và 0 lỗi Major còn tồn đọng.
- Báo cáo đối chiếu nghiệm thu Definition of Done (DoD) toàn diện trong Artifact cuối cùng.
- File `docker-compose.yml` và `README.md` hướng dẫn chạy trơn tru 1 lệnh `docker compose up`.

## 3. CÔNG CỤ SỬ DỤNG
- Skill: `code-reviewer` (phân tích mã nguồn chuyên sâu, gắn nhãn mức độ, mẫu báo cáo).
- Skill: `bug-diagnostician` (hỗ trợ phân tích nguyên nhân gốc rễ RCA khi phát hiện lỗi).
- Skill: `memory-leak-debugging` (rà soát WebSocket connection & stream lifecycle).
- Shell CLI: Chạy lại toàn bộ test suite (`mvn test`, `npm test`) sau mỗi lần sửa đổi mã nguồn.

## 4. GIỚI HẠN PHẠM VI (SCOPE BOUNDARIES)
- Tối đa 3 vòng lặp review. Sau 3 vòng lặp nếu vẫn còn vấn đề tồn đọng chưa giải quyết được, phải lập danh sách chi tiết và báo cáo Product Owner / Người dùng để xin ý kiến chỉ đạo.
- Không tự ý thêm tính năng mới trong Phase 9; các ý tưởng cải tiến ghi nhận vào `docs/backlog.md`.

## 5. CHECKLIST NGHIỆM THU (ACCEPTANCE CHECKLIST)
- [ ] Báo cáo rà soát `docs/review/round-1.md` được lập đầy đủ theo đúng cấu trúc của `code-reviewer`.
- [ ] 100% phát hiện thuộc mức 🔴 `CRITICAL` và 🟠 `MAJOR` đã được sửa đổi và kiểm chứng.
- [ ] Toàn bộ Unit, Integration và E2E Test chạy lại thành công (0 regression failures).
- [ ] File `docker-compose.yml` khởi động đầy đủ 4 service (Postgres, Spring Boot, Node Gateway, React Frontend).
- [ ] File `README.md` cung cấp hướng dẫn khởi chạy nhanh chi tiết, rõ ràng, chính xác.
- [ ] Artifact tổng kết Phase 9 và báo cáo đối chiếu Definition of Done được tạo đầy đủ.
