# ADR-002: Lựa chọn Giao thức WebSocket cho Luồng Âm thanh Thời gian thực
**Ngày:** 2026-11-05  
**Trạng thái:** Chấp thuận (Accepted)  
**Tác giả:** Solution Architect  

---

## 1. Ngữ cảnh (Context)
Hệ thống phỏng vấn bằng giọng nói đòi hỏi truyền tải luồng âm thanh hai chiều giữa trình duyệt người dùng (Client) và máy chủ (Voice Gateway):
- Client liên tục gửi các đoạn âm thanh thu từ microphone (audio chunks 16kHz PCM/WebM/Opus) lên Gateway để nhận dạng giọng nói (STT).
- Gateway liên tục stream các gói âm thanh câu hỏi của AI (TTS audio chunks) về Client để phát qua loa/tai nghe mà không phải đợi tải hết toàn bộ file âm thanh.
- Cần cơ chế truyền nhận sự kiện điều khiển tức thời (Barge-in, Subtitle tokens, State change events).

Các giải pháp giao thức được cân nhắc:
1. **HTTP/1.1 Polling / Server-Sent Events (SSE):** SSE chỉ hỗ trợ 1 chiều (Server $\rightarrow$ Client), còn Client gửi audio lên server qua HTTP POST sẽ tạo overhead cực lớn do thiết lập kết nối liên tục (TCP handshake + HTTP headers).
2. **WebRTC:** Độ trễ cực thấp (P2P hoặc SFU/MCU). Tuy nhiên, WebRTC đòi hỏi hạ tầng Signaling Server, STUN/TURN server, Media Server (như mediasoup/Kurento), làm tăng đột biến độ phức tạp của dự án và khó triển khai cục bộ (local Docker Compose).
3. **WebSocket:** Giao thức kết nối song công toàn phần (Full-duplex TCP socket) chuẩn trên mọi trình duyệt web hiện đại, hỗ trợ cả khung nhị phân (Binary Frames cho audio) và khung văn bản (Text JSON Frames cho control events).

## 2. Quyết định (Decision)
Chúng tôi quyết định sử dụng **WebSocket (RFC 6455)** làm giao thức truyền thông âm thanh thời gian thực giữa Web Client và Node.js Voice Gateway:
- **Audio Uplink:** Client ghi âm qua Web Audio API / AudioWorklet hoặc MediaRecorder và stream binary chunk trực tiếp qua WebSocket tới Gateway.
- **Audio Downlink:** Gateway stream các chunk âm thanh nhị phân của TTS qua WebSocket để Web Audio API giải mã và phát trực tiếp.
- **Control Channel:** Sử dụng tin nhắn JSON trên cùng kênh WebSocket để đồng bộ trạng thái phiên (`STATE_CHANGE`), phụ đề thời gian thực (`SUBTITLE`), và lệnh ngắt lời (`USER_BARGE_IN`).

## 3. Hệ quả (Consequences)
### Lợi ích (Positive):
- Độ trễ thấp (thường $< 100$ms trên mạng local/LAN), đáp ứng hoàn hảo yêu cầu hội thoại tự nhiên.
- Dễ dàng đóng gói và chạy trơn tru trên môi trường Docker Compose mà không cần cấu hình STUN/TURN hay mở dải cổng UDP phức tạp như WebRTC.
- Hỗ trợ multiplexing cả âm thanh và sự kiện JSON trên cùng một kết nối socket duy nhất.

### Đánh đổi (Trade-offs):
- WebSocket chạy trên giao thức TCP, do đó trong điều kiện mạng gói tin bị mất nghiêm trọng (packet loss), hiện tượng TCP Head-of-Line Blocking có thể làm gián đoạn nhẹ âm thanh. Điều này được khắc phục bằng cơ chế Reconnect 60 giây và audio buffer linh hoạt ở phía frontend.
