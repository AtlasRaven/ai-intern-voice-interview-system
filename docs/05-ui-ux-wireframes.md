# ĐẶC TẢ THIẾT KẾ GIAO DIỆN VÀ TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX SPECIFICATION)
**Dự án:** Hệ thống phỏng vấn intern cho sinh viên IT mới ra trường (Voice AI Interview System)  
**Mã tài liệu:** `DOCS-05-UI-UX-WIREFRAMES`  
**Phiên bản:** 1.0.0  
**Tác giả:** UI/UX Lead & Design System Specialist  
**Tiêu chuẩn tuân thủ:** Kỹ năng `design-system-expert` (Ant Design v5 / shadcn/ui) & `a11y-debugging` (WCAG 2.1 AA)  

---

## 1. NGUYÊN TẮC THIẾT KẾ CỐT LÕI (DESIGN PRINCIPLES)

Tuân thủ nghiêm ngặt các quy định bắt buộc của `design-system-expert`:
1. **Quy chuẩn Bo góc (Border Radius):**
   - Chỉ sử dụng trong dải **6px - 10px**.
   - `rounded-md` (6px): Cho badges, micro inputs, tags, secondary buttons.
   - `rounded-lg` (8px): Cho primary buttons, form fields, audio visualizer containers, chat bubbles.
   - `rounded-xl` (10px): Cho cards, modals, dialogs, main panels.
   - *Tuyệt đối không dùng bo góc tròn viên thuốc (capsule) hoặc góc nhọn 0px.*
2. **Quy chuẩn Màu sắc & Nền (Color & Surfaces):**
   - **CẤM HOÀN TOÀN:** Background gradient sặc sỡ, lòe loẹt; hiệu ứng glassmorphism (frosted glass blur, backdrop-blur với opacity trong suốt).
   - **BẮT BUỘC:** Sử dụng nền phẳng đặc (Solid Neutral Surfaces), phân tách khu vực bằng đường viền đơn sắc mảnh và tinh tế (`border border-slate-200` ở light mode hoặc `border-slate-800` ở dark mode).
3. **Typography & Layout:**
   - Font chữ hệ thống không chân hiện đại: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
   - Lưới bố cục 8pt chuẩn (padding/margin bội số của 4px và 8px).

---

## 2. BỘ DESIGN TOKENS (TAILWIND CSS CONFIGURATION)

```typescript
// tailwind.config.js - Design Tokens Specification
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        surface: '#f8fafc',         // slate-50 (nền phụ phẳng)
        surfaceSubtle: '#f1f5f9',   // slate-100 (khối hover/active)
        border: '#e2e8f0',          // slate-200 (viền chuẩn tinh tế)
        borderStrong: '#cbd5e1',    // slate-300
        
        textPrimary: '#0f172a',     // slate-900 (độ tương phản > 12:1)
        textSecondary: '#475569',   // slate-600 (độ tương phản > 5.5:1)
        textMuted: '#64748b',       // slate-500
        
        // Brand & Functional Colors
        brand: {
          DEFAULT: '#2563eb',       // blue-600
          hover: '#1d4ed8',         // blue-700
          light: '#eff6ff',         // blue-50 (solid background)
          border: '#bfdbfe',        // blue-200
        },
        // Trạng thái AI Interviewer
        aiSpeaking: {
          bg: '#ecfdf5',            // emerald-50
          border: '#a7f3d0',        // emerald-200
          indicator: '#10b981',     // emerald-500
          text: '#065f46',          // emerald-800
        },
        aiListening: {
          bg: '#fffbeb',            // amber-50
          border: '#fde68a',        // amber-200
          indicator: '#f59e0b',     // amber-500
          text: '#92400e',          // amber-800
        },
        aiThinking: {
          bg: '#eff6ff',            // blue-50
          border: '#bfdbfe',        // blue-200
          indicator: '#3b82f6',     // blue-500
          text: '#1e40af',          // blue-800
        },
        danger: {
          DEFAULT: '#dc2626',       // red-600
          hover: '#b91c1c',         // red-700
          light: '#fef2f2',         // red-50
          border: '#fecaca',        // red-200
        }
      },
      borderRadius: {
        'md': '6px',
        'lg': '8px',
        'xl': '10px',
      }
    }
  }
}
```

---

## 3. BẢN VẼ WIREFRAME CHI TIẾT 6 MÀN HÌNH

### 3.1. Màn hình 1: Đăng nhập & Đăng ký (Authentication)

```
+--------------------------------------------------------------------------+
|  LOGO: AI Intern Voice Interview                             [English]   |
+--------------------------------------------------------------------------+
|                                                                          |
|                 +--------------------------------------+                 |
|                 | ĐĂNG NHẬP HỆ THỐNG                   |                 |
|                 | Hệ thống phỏng vấn thực tập sinh AI  |                 |
|                 +--------------------------------------+                 |
|                 | Email:                               |                 |
|                 | [ candidate@intern.vn              ] |                 |
|                 |                                      |                 |
|                 | Mật khẩu:                            |                 |
|                 | [ ******************             👁 ] |                 |
|                 |                                      |                 |
|                 | Đăng nhập nhanh để thử nghiệm:       |                 |
|                 | [ Candidate Demo ]  [ HR Demo ]      |                 |
|                 |                                      |                 |
|                 | [      ĐĂNG NHẬP VÀO HỆ THỐNG      ] | (rounded-lg)    |
|                 |                                      |                 |
|                 | Chưa có tài khoản? [Đăng ký ứng viên]|                 |
|                 +--------------------------------------+                 |
|                                                                          |
+--------------------------------------------------------------------------+
```

---

### 3.2. Màn hình 2: Hồ sơ Ứng viên & Chọn Vị trí (Candidate Portal)

```
+--------------------------------------------------------------------------+
| LOGO: Intern AI   [Các vị trí mở] [Lịch sử phỏng vấn]   [Trần Sinh Viên] |
+--------------------------------------------------------------------------+
|                                                                          |
| CHÀO MỪNG BẠN ĐẾN VỚI CỔNG PHỎNG VẤN INTERN KỸ THUẬT                      |
| Vui lòng chọn vị trí thực tập muốn ứng tuyển và bắt đầu thử sức:        |
|                                                                          |
| +-------------------------+ +-------------------------+ +-------------+ |
| | JAVA BACKEND INTERN     | | NODE.JS BACKEND INTERN  | | FRONTEND... | |
| | Mã: JAVA_BE  [Đang mở]  | | Mã: NODE_BE  [Đang mở]  | | [Đang mở]   | |
| |-------------------------| |-------------------------| |-------------| |
| | Mô tả: Xây dựng hệ thống| | Mô tả: Xây dựng REST API| | Mô tả: ...  | |
| | Spring Boot 3 & Postgres| | realtime với Node & WS  | |             | |
| |                         | |                         | |             | |
| | Yêu cầu kỹ năng:        | | Yêu cầu kỹ năng:        | |             | |
| | [Java Core] [Spring]    | | [Node.js] [Express]     | |             | |
| | [SQL] [OOP]             | | [Async] [TypeScript]    | |             | |
| |                         | |                         | |             | |
| | [ BẮT ĐẦU PHỎNG VẤN ]   | | [ BẮT ĐẦU PHỎNG VẤN ]   | | [ BẮT ĐẦU ] | |
| +-------------------------+ +-------------------------+ +-------------+ |
|                                                                          |
+--------------------------------------------------------------------------+

=== MODAL XÁC NHẬN ĐỒNG THUẬN GHI ÂM (AUDIO CONSENT MODAL) ===
+--------------------------------------------------------------------------+
| XÁC NHẬN THAM GIA PHỎNG VẤN GIỌNG NÓI AI                                  |
|--------------------------------------------------------------------------|
| Bạn đang ứng tuyển vị trí: Java Backend Intern                           |
| Để AI Interviewer có thể nghe và đánh giá, hệ thống sẽ sử dụng micro    |
| của bạn để phân tích giọng nói theo thời gian thực.                      |
|                                                                          |
| [X] Tôi đồng ý cho phép ghi âm và phân tích giọng nói cho buổi này.     |
| [ ] Tôi không có micro, muốn sử dụng chế độ gõ văn bản dự phòng.        |
|                                                                          |
|                                 [ Hủy bỏ ]   [ VÀO PHÒNG PHỎNG VẤN ]     |
+--------------------------------------------------------------------------+
```

---

### 3.3. Màn hình 3: Phòng Phỏng vấn Giọng nói AI (Realtime Voice Interview Room - Trung tâm)

```
+--------------------------------------------------------------------------+
| PHIÊN PHỎNG VẤN: Java Backend Intern | Thời gian: 08:45 | [KẾT THÚC SỚM] |
+--------------------------------------------------------------------------+
|                                                                          |
| +----------------------------------------------------------------------+ |
| | KHU VỰC TƯƠNG TÁC THOẠI AI                                           | |
| |                                                                      | |
| |                   +----------------------------+                     | |
| |                   | 🟢 AI ĐANG ĐỌC CÂU HỎI...  |  (Trạng thái AI)    | |
| |                   +----------------------------+                     | |
| |                                                                      | |
| |               ||||||||||||||||||||||||||||||||||||||                 | |
| |                   (Voice Waveform Visualizer Sóng âm)                | |
| |                                                                      | |
| | Câu hỏi 2 / 5 (Độ khó: Trung bình):                                  | |
| | "Bạn hãy giải thích cơ chế Lazy Loading trong JPA và hiện tượng       | |
| |  N+1 query xảy ra như thế nào?"                                      | |
| +----------------------------------------------------------------------+ |
|                                                                          |
| +----------------------------------------------------------------------+ |
| | PHỤ ĐỀ TRỰC TIẾP (LIVE TRANSCRIPT STREAM)                            | |
| |----------------------------------------------------------------------| |
| | AI: Chào bạn, chúng ta tiếp tục với câu hỏi thứ hai về database nhé.  | |
| | Ứng viên (Micro): "Dạ thưa anh, Lazy Loading là cơ chế tải dữ liệu...| |
| | khi nào cần truy cập thuộc tính thì mới query SQL..."                | |
| +----------------------------------------------------------------------+ |
|                                                                          |
| +----------------------------------------------------------------------+ |
| | THANH ĐIỀU KHIỂN:                                                    | |
| | [ 🎙️ Tắt/Bật Micro (Space) ]   [ ⌨️ Chuyển Gõ Chữ ]   [ 🔊 Âm lượng ] | |
| +----------------------------------------------------------------------+ |
+--------------------------------------------------------------------------+

=== KHI BẬT CHẾ ĐỘ NHẬP VĂN BẢN (TEXT FALLBACK) ===
| [ Nhập câu trả lời của bạn tại đây...                      ] [ GỬI ]    |
```

---

### 3.4. Màn hình 4: Báo cáo Kết quả & Đánh giá (Interview Evaluation Report)

```
+--------------------------------------------------------------------------+
| KẾT QUẢ ĐÁNH GIÁ PHỎNG VẤN: TRẦN VĂN SINH VIÊN                           |
| Vị trí: Java Backend Intern | Ngày: 2026-11-05 | Kết quả: [ ĐẠT / PASS ] |
+--------------------------------------------------------------------------+
|                                                                          |
| +----------------------------------+ +---------------------------------+ |
| | ĐIỂM SỐ RUBRIC TỔNG QUAN         | | BIỂU ĐỒ NĂNG LỰC 3 TRỤ CỘT      | |
| | Điểm Trung Bình:  8.2 / 10       | |                                 | |
| |----------------------------------| |       Kiến thức Kỹ thuật        | |
| | • Kỹ thuật (40%):     8.5 / 10   | |              (8.5)              | |
| | • Tư duy logic (30%): 8.0 / 10   | |             /     \             | |
| | • Giao tiếp (30%):    8.0 / 10   | |            /       \            | |
| |                                  | |       (8.0)--------(8.0)        | |
| | Xếp loại: Rất phù hợp (Strong)   | |  Giao tiếp           Tư duy     | |
| +----------------------------------+ +---------------------------------+ |
|                                                                          |
| +----------------------------------------------------------------------+ |
| | NHẬN XÉT CHI TIẾT CỦA AI INTERVIEWER:                                | |
| | • Điểm mạnh: Nắm chắc bản chất OOP, hiểu rõ cơ chế JOIN FETCH trong  | |
| |   JPA để giải quyết N+1 query. Trình bày rành mạch, tốc độ nói vừa.  | |
| | • Cần cải thiện: Cần cọ xát thêm kiến thức về Concurrency và Lock.   | |
| | • Gợi ý ôn tập: Đọc thêm cuốn Java Concurrency in Practice chương 3. | |
| +----------------------------------------------------------------------+ |
|                                                                          |
| +----------------------------------------------------------------------+ |
| | LỊCH SỬ TOÀN VĂN TRANSCRIPT (CÂU HỎI & CÂU TRẢ LỜI CỦA ỨNG VIÊN)    | |
| | [Câu 1 - 01:20]: Trình bày 4 tính chất OOP?                          | |
| |  -> Đáp: Đóng gói, Kế thừa, Đa hình, Trừu tượng (Khớp rubric: 9/10)   | |
| | [Câu 2 - 02:45]: Lazy loading & N+1 query?                           | |
| |  -> Đáp: Nêu đúng JOIN FETCH và EntityGraph (Khớp rubric: 8.5/10)    | |
| +----------------------------------------------------------------------+ |
+--------------------------------------------------------------------------+
```

---

### 3.5. Màn hình 5: HR Dashboard & Quản lý Đánh giá

```
+--------------------------------------------------------------------------+
| HR DASHBOARD - QUẢN LÝ ỨNG VIÊN INTERN               [Xuất Báo Cáo CSV]  |
+--------------------------------------------------------------------------+
| Bộ lọc: [Tất cả vị trí v] [Trạng thái: Đạt v] [Điểm >=: 7.0] [Tìm tên..] |
+--------------------------------------------------------------------------+
| Họ tên Ứng viên  | Vị trí        | Điểm AI | Điểm HR | Trạng thái | Thao tác |
|------------------|---------------|---------|---------|------------|----------|
| Trần Văn Sinh Viên| Java Backend |   8.2   |   8.5   | [ĐẠT]      | [Chi tiết]|
| Lê Thị Thu Hà    | Frontend React|   7.8   |   --    | [Xem xét]  | [Chi tiết]|
| Hoàng Minh Đức   | Node.js BE    |   5.5   |   5.5   | [Chưa đạt] | [Chi tiết]|
+--------------------------------------------------------------------------+

=== MODAL HIỆU CHỈNH ĐIỂM SỐ DÀNH CHO HR ===
+--------------------------------------------------------------------------+
| ĐÁNH GIÁ CỦA HR CHO: Trần Văn Sinh Viên (Java Backend Intern)            |
|--------------------------------------------------------------------------|
| Điểm AI gợi ý: 8.2 / 10                                                  |
| Điểm HR chấm lại: [ 8.5  ] / 10                                          |
| Quyết định cuối: (o) ĐẠT (Pass)    ( ) CHƯA ĐẠT (Fail)    ( ) XEM XÉT    |
| Ghi chú của HR:                                                          |
| [ Ứng viên thể hiện thái độ cầu tiến tốt, tư duy logic chặt chẽ.       ] |
|                                                                          |
|                                   [ Hủy ]   [ LƯU ĐÁNH GIÁ CHÍNH THỨC ]  |
+--------------------------------------------------------------------------+
```

---

### 3.6. Màn hình 6: Quản trị Ngân hàng Câu hỏi (Admin Question Bank)

```
+--------------------------------------------------------------------------+
| QUẢN TRỊ NGÂN HÀNG CÂU HỎI PHỎNG VẤN                    [+ THÊM CÂU HỎI] |
+--------------------------------------------------------------------------+
| Lọc theo Vị trí: [Java Backend Intern v]  Độ khó: [Tất cả độ khó v]      |
+--------------------------------------------------------------------------+
| ID | Nội dung câu hỏi                      | Độ khó  | Kỹ năng    | Thao tác |
|----|---------------------------------------|---------|------------|----------|
| 1  | 4 tính chất cơ bản của OOP là gì?     | [DỄ]    | Java, OOP  | [Sửa][Xóa]|
| 2  | Sự khác nhau giữa ArrayList & Linked..| [DỄ]    | Java, DS   | [Sửa][Xóa]|
| 4  | Lazy loading và N+1 query trong JPA?  | [VỪA]   | JPA, SQL   | [Sửa][Xóa]|
| 5  | Concurrency & ReentrantLock trong Java| [KHÓ]   | Concurrency| [Sửa][Xóa]|
+--------------------------------------------------------------------------+
```

---

## 4. MA TRẬN KHẢ NĂNG TIẾP CẬN (ACCESSIBILITY - A11Y MATRIX)

Tuân thủ chuẩn **WCAG 2.1 Level AA**:
1. **Tỷ lệ Tương phản Màu sắc (Color Contrast Ratio):**
   - Văn bản chính (`#0f172a` trên `#ffffff`): Đạt tỷ lệ **15.4:1** (vượt xa ngưỡng yêu cầu 4.5:1).
   - Văn bản phụ (`#475569` trên `#ffffff`): Đạt tỷ lệ **6.8:1**.
   - Trạng thái chỉ báo màu: Đều đi kèm icon và nhãn chữ (ví dụ: Icon 🎙️ + chữ "AI đang nói" thay vì chỉ dùng chấm màu xanh).
2. **Điều hướng Phím tắt (Keyboard Shortcuts):**
   - `Space`: Bật / Tắt Microphone (Toggle Mute).
   - `Esc`: Mở modal xác nhận kết thúc sớm phiên phỏng vấn.
   - `Tab` / `Shift+Tab`: Di chuyển tuần tự qua các nút điều khiển, visual focus ring hiển thị viền xanh `ring-2 ring-blue-500` nổi bật rõ nét.
3. **Screen Reader (ARIA Attributes):**
   - `aria-live="polite"` trên khung Live Transcript để trình đọc màn hình tự động phát âm khi có câu trả lời mới mà không làm ngắt tiếng nói hiện tại.
   - `role="status"` cho trạng thái AI Interviewer (Speaking, Listening, Thinking).
