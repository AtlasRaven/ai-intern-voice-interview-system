# CHILD PROMPT: PHASE 7 – TRIỂN KHAI FRONTEND REACT
**Mã tài liệu:** `DOCS-PROMPT-07-FRONTEND-REACT`  
**Giai đoạn:** Phase 7  
**Mục tiêu:** Xây dựng ứng dụng web Single Page Application (SPA) bằng React 18+, TypeScript, Vite và Tailwind CSS, hiện thực hóa chính xác các wireframe đã thiết kế ở Phase 4, kết nối trơn tru với Spring Boot REST API và Voice Gateway WebSocket.

---

## 1. ĐẦU VÀO (INPUT)
- `docs/04-ui-ux-wireframes.md`: Bản thiết kế wireframe, tokens, trạng thái AI, text fallback.
- `docs/04-openapi.yaml`: Contract API của Spring Boot.
- WebSocket message format của Node.js Voice Gateway.

## 2. ĐẦU RA MONG ĐỢI (EXPECTED OUTPUT)
Mã nguồn module `/frontend` hoàn chỉnh:
1. **Cấu trúc Thư mục & Công nghệ:**
   - React 18 + TypeScript + Vite + Tailwind CSS.
   - Thư viện routing: `react-router-dom` v6 với các route được bảo vệ theo role (`CandidateRoute`, `HRRoute`).
   - Quản lý trạng thái: React Context / Zustand cho Authentication, Interview Session, và Audio Stream.
   - Thư viện icon tinh gọn (`lucide-react`).
2. **Các Phân hệ Màn hình Hoàn chỉnh:**
   - **Auth:** Trang Đăng nhập và Đăng ký tài khoản (hỗ trợ chọn vai trò Candidate hoặc HR để test nhanh).
   - **Candidate Portal:**
     - Xem danh sách 5 vị trí tuyển dụng với mô tả kỹ năng.
     - Modal đồng thuận ghi âm giọng nói (Audio Consent Modal) trước khi vào phỏng vấn.
     - Lịch sử các phiên phỏng vấn đã tham gia.
   - **Phòng Phỏng vấn Trực tiếp (Voice Interview Room):**
     - Quản lý quyền Microphone (`navigator.mediaDevices.getUserMedia`).
     - Trực quan hóa sóng âm âm thanh (Audio Waveform Canvas/CSS Visualizer) phản hồi theo cường độ mic.
     - Khối trạng thái AI với hiệu ứng tinh tế: 🟢 *Đang nói*, 🟡 *Đang lắng nghe*, 🔵 *Đang suy nghĩ*.
     - Hộp thoại phụ đề trực tiếp (Live Subtitle Transcript) cuộn tự động.
     - Nút Mute/Unmute Mic, nút Kết thúc phỏng vấn.
     - Chế độ Nhập văn bản dự phòng (Text Chat Fallback) chuyển đổi linh hoạt.
   - **Báo cáo Kết quả (Evaluation Result View):**
     - Hiển thị điểm tổng thể và điểm 3 tiêu chí Rubric (Kỹ thuật, Tư duy, Giao tiếp).
     - Danh sách câu hỏi kèm câu trả lời của ứng viên và nhận xét chi tiết của AI/HR.
   - **HR Dashboard:**
     - Bảng ứng viên: phân trang, tìm kiếm theo tên, bộ lọc theo vị trí và trạng thái.
     - Modal xem chi tiết phiên phỏng vấn và form hiệu chỉnh điểm số/nhập nhận xét thủ công của HR.
3. **Xử lý Mạng & Khả năng tiếp cận:**
   - Tự động hiển thị thanh thông báo trạng thái mạng khi WebSocket bị ngắt kết nối và tự động thử kết nối lại (reconnect countdown).
   - Thiết lập chuẩn Accessibility: gắn ARIA labels, hỗ trợ phím tắt (`Space` toggle mic, `Esc` thoát).

## 3. CÔNG CỤ SỬ DỤNG
- Skill: `design-system-expert` (tuân thủ tokens, border-radius 6-10px, giao diện phẳng chuẩn).
- Skill: `a11y-debugging` (kiểm tra khả năng tiếp cận và điều hướng phím).
- Shell CLI: `npm run build` để kiểm tra build production của Vite.

## 4. GIỚI HẠN PHẠM VI (SCOPE BOUNDARIES)
- Tuân thủ nguyên tắc không sử dụng gradient sặc sỡ hoặc blur glassmorphism.
- Không đưa thêm các thư viện UI bên thứ ba cồng kềnh; tập trung vào Tailwind CSS và các component tinh gọn, dễ bảo trì.

## 5. CHECKLIST NGHIỆM THU (ACCEPTANCE CHECKLIST)
- [ ] Ứng dụng build production thành công (`npm run build`) không có cảnh báo nghiêm trọng.
- [ ] Luồng đăng ký, đăng nhập và phân quyền route hoạt động chuẩn xác theo JWT.
- [ ] Phòng phỏng vấn kết nối thành công tới WebSocket Gateway, hiển thị sóng âm và cập nhật phụ đề realtime.
- [ ] Hỗ trợ chế độ Text Chat Fallback mượt mà khi tắt mic.
- [ ] HR Dashboard hiển thị danh sách ứng viên và cho phép cập nhật điểm/nhận xét thành công qua API.
- [ ] Artifact tổng kết Phase 7 được tạo đầy đủ.
