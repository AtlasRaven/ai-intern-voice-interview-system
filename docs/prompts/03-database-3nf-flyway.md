# CHILD PROMPT: PHASE 3 – CƠ SỞ DỮ LIỆU 3NF VÀ FLYWAY MIGRATION
**Mã tài liệu:** `DOCS-PROMPT-03-DATABASE-3NF`  
**Giai đoạn:** Phase 3  
**Mục tiêu:** Thiết kế mô hình dữ liệu quan hệ đạt chuẩn 3NF (Third Normal Form), lập tài liệu chứng minh toán học/logic chuẩn hóa, viết các tệp di chuyển dữ liệu Flyway và nạp dữ liệu mẫu ban đầu.

---

## 1. ĐẦU VÀO (INPUT)
- `docs/00-assumptions.md`: Danh sách thực thể gợi ý (users, roles, candidates, positions, skills, questions, interview_sessions, transcripts_segments, evaluations, consents, audit_logs...).
- `docs/02-system-architecture.md`: Nghiệp vụ và các luồng tương tác dữ liệu đã chốt ở Phase 2.
- PostgreSQL 16+ cục bộ (hoặc Docker container) để chạy kiểm thử migration.

## 2. ĐẦU RA MONG ĐỢI (EXPECTED OUTPUT)
- `docs/03-erd-3nf.md`:
  - Sơ đồ quan hệ thực thể (ERD) hoàn chỉnh vẽ bằng cú pháp `erDiagram` của Mermaid.
  - Phân tích và chứng minh chuẩn hóa từng bảng từ 1NF $\rightarrow$ 2NF $\rightarrow$ 3NF:
    - Chứng minh không có thuộc tính đa trị hay mảng lặp (1NF).
    - Chứng minh mọi thuộc tính phi khóa đều phụ thuộc hàm toàn phần vào khóa chính (2NF).
    - Chứng minh không có phụ thuộc bắc cầu giữa các thuộc tính phi khóa (3NF).
  - Bảng chỉ mục (Indexing Strategy): Giải thích rõ các Composite Index, B-Tree Index cho tra cứu tìm kiếm, phân trang và khóa ngoại.
- File di chuyển Flyway trong thư mục mã nguồn Backend (`backend-spring/src/main/resources/db/migration/`):
  - `V1__init_schema.sql`: Toàn bộ DDL tạo bảng, khóa chính, khóa ngoại, ràng buộc `CHECK`, `NOT NULL`, `UNIQUE` và chỉ mục `INDEX`.
  - `V2__seed_data.sql`: Dữ liệu khởi tạo mẫu gồm:
    - Tài khoản mặc định: Admin, HR/Interviewer, Candidate.
    - 5 vị trí intern (Java BE, Node BE, Frontend React, QA, Data/AI).
    - Bộ kỹ năng (Skills) và ma trận kỹ năng tương ứng từng vị trí.
    - Ngân hàng tối thiểu 30 câu hỏi mẫu phân theo độ khó (Easy, Medium, Hard) và tiêu chí chấm điểm (Rubrics).
- Biên bản thực thi xác thực SQL trên PostgreSQL thật (log thực thi không có lỗi cú pháp).

## 3. CÔNG CỤ SỬ DỤNG
- Skill: `system-architect` (chuẩn hóa 3NF, phân tích phụ thuộc hàm, chiến lược indexing).
- MCP Tool: `postgres` hoặc công cụ dòng lệnh `psql` / node script để kiểm tra cú pháp SQL.
- Mermaid `erDiagram`.

## 4. GIỚI HẠN PHẠM VI (SCOPE BOUNDARIES)
- Không phi chuẩn hóa (denormalization) trong giai đoạn này, đảm bảo tính toàn vẹn dữ liệu giao dịch 3NF tuyệt đối.
- Giữ dữ liệu binary của audio ngoài cơ sở dữ liệu (chỉ lưu đường dẫn/URL hoặc metadata trong bảng; audio binary lưu local filesystem/object store).

## 5. CHECKLIST NGHIỆM THU (ACCEPTANCE CHECKLIST)
- [ ] ERD Mermaid hiển thị rõ ràng khóa chính (PK), khóa ngoại (FK) và mối quan hệ 1-N, N-N.
- [ ] Văn bản chứng minh 3NF rõ ràng cho từng bảng, không có phụ thuộc bắc cầu hoặc thuộc tính lặp.
- [ ] File `V1__init_schema.sql` có đầy đủ ràng buộc toàn vẹn tham chiếu `ON DELETE RESTRICT/CASCADE` phù hợp.
- [ ] File `V2__seed_data.sql` có đủ 5 vị trí tuyển dụng và ngân hàng câu hỏi phân cấp.
- [ ] Script migration được thực thi thử nghiệm thành công trên PostgreSQL và ghi log xác thực.
- [ ] Artifact tổng kết Phase 3 được lập.
