# CHILD PROMPT: PHASE 4 – THIẾT KẾ GIAO DIỆN VÀ TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX)
**Mã tài liệu:** `DOCS-PROMPT-04-UI-UX-DESIGN`  
**Giai đoạn:** Phase 4  
**Mục tiêu:** Thiết kế toàn diện kiến trúc thông tin, luồng màn hình (Wireframes), hệ thống Design Tokens và thông số kỹ thuật giao diện theo chuẩn `design-system-expert` và khả năng tiếp cận (Accessibility - a11y).

---

## 1. ĐẦU VÀO (INPUT)
- `docs/00-assumptions.md`: 3 nhóm vai trò (Candidate, Interviewer, Admin), quy ước thiết kế phòng phỏng vấn giọng nói.
- `docs/02-system-architecture.md`: Danh sách User Stories và kịch bản tương tác người dùng.
- Nguyên tắc kỹ năng `design-system-expert`: Border-radius 6-10px, cấm gradient lòe loẹt, cấm glassmorphism, nền phẳng trung tính tinh tế.

## 2. ĐẦU RA MONG ĐỢI (EXPECTED OUTPUT)
- `docs/05-ui-ux-wireframes.md`:
  - Bản mô tả Wireframe chi tiết (dạng ASCII layout hoặc cấu trúc Markdown phân vùng rõ ràng) cho các màn hình:
    1. **Màn hình Đăng nhập & Đăng ký (Auth):** Form xác thực, chọn vai trò, validation lỗi trực quan.
    2. **Hồ sơ Ứng viên (Candidate Profile & Position Selection):** Danh sách 5 vị trí intern, yêu cầu kỹ năng, nút "Đăng ký phỏng vấn", modal xác nhận Audio Consent.
    3. **Phòng Phỏng vấn Giọng nói AI (AI Voice Interview Room - Trung tâm):**
       - Khối trạng thái AI tương tác trực quan: 🟢 *AI đang nói (Speaking)*, 🟡 *AI đang lắng nghe (Listening)*, 🔵 *AI đang suy nghĩ (Thinking)*.
       - Chỉ báo sóng âm (Voice Waveform Visualizer) cho cả AI và microphone ứng viên.
       - Hộp thoại phụ đề thời gian thực (Live Transcript Subtitles) hiển thị từng từ/câu được nhận dạng.
       - Nút điều khiển: Mute Mic, Kết thúc phiên sớm, Chuyển sang chế độ Nhập văn bản (Text Fallback).
    4. **Bảng Kết quả & Đánh giá (Interview Evaluation Report):** Điểm số tổng quan và radar chart theo 3 tiêu chí rubric (Kỹ thuật, Tư duy, Giao tiếp), transcript kèm mốc thời gian, nhận xét chi tiết của AI và HR.
    5. **Dashboard Nhà Tuyển Dụng (HR Dashboard):** Bảng danh sách ứng viên có tìm kiếm, bộ lọc theo vị trí và khoảng điểm, nút xem chi tiết phiên và modal hiệu chỉnh điểm/nhận xét thủ công của HR.
    6. **Quản lý Ngân hàng Câu hỏi (Admin Question Bank):** Danh mục câu hỏi, gắn thẻ kỹ năng, lọc theo độ khó.
  - Bộ Design Tokens chuẩn Tailwind CSS: Bảng màu trung tính (`slate-50` đến `slate-900`), màu thương hiệu (`blue-600`), quy chuẩn bo góc (`rounded-md` 6px, `rounded-lg` 8px, `rounded-xl` 10px).
  - Ma trận Khả năng tiếp cận (Accessibility - a11y): Phím tắt (Space để bật/tắt mic, Esc để tạm dừng), chuẩn độ tương phản màu WCAG AA ($\ge 4.5:1$), thuộc tính ARIA cho screen readers.
  - Đặc tả chế độ Text Chat Fallback: Luồng chuyển tiếp mượt mà khi trình duyệt không cấp quyền microphone hoặc kết nối âm thanh bị nghẽn.

## 3. CÔNG CỤ SỬ DỤNG
- Skill: `design-system-expert` (chuẩn tokens, không gradient/glassmorphism, layout trực quan).
- Skill: `a11y-debugging` (chuẩn WCAG AA, focus states, keyboard shortcuts).

## 4. GIỚI HẠN PHẠM VI (SCOPE BOUNDARIES)
- Giai đoạn này chỉ sinh tài liệu thiết kế giao diện, layout cấu trúc và tokens; chưa sinh mã nguồn React (mã nguồn sẽ được viết ở Phase 7).
- Không sử dụng các hiệu ứng chuyển động nặng nề gây phân tâm trong phòng phỏng vấn.

## 5. CHECKLIST NGHIỆM THU (ACCEPTANCE CHECKLIST)
- [ ] Đủ 6 màn hình cốt lõi có wireframe layout chi tiết từng thành phần.
- [ ] Tuân thủ tuyệt đối quy tắc `design-system-expert`: Border-radius từ 6px đến 10px; không sử dụng gradient sặc sỡ hoặc blur glassmorphism.
- [ ] Mô tả đầy đủ 4 trạng thái phòng phỏng vấn AI (Idle, Speaking, Listening, Processing).
- [ ] Thiết kế cơ chế Text Chat Fallback chi tiết khi không có mic.
- [ ] Bảng Design Tokens Tailwind và hướng dẫn phím tắt a11y hoàn thiện.
- [ ] Artifact tổng kết Phase 4 được tạo đầy đủ.
