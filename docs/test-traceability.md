# MA TRẬN TRUY VẾT KIỂM THỬ (TEST TRACEABILITY MATRIX)

## 1. TỔNG QUAN KẾT QUẢ KIỂM THỬ TỰ ĐỘNG

| Hạng mục kiểm thử | Công nghệ / Framework | Số test cases | Passed | Failed | Skipped | Tỷ lệ thành công | Thời gian chạy |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Backend Core** | JUnit 5 + Mockito + MockMvc (Spring Boot 3.3.4, Java 17) | 23 | 23 | 0 | 0 | **100%** | 9.42s |
| **Voice Gateway** | Vitest 2.1 (Node.js 20 + TypeScript) | 12 | 12 | 0 | 0 | **100%** | 0.77s |
| **Frontend UI/UX**| Vitest + @testing-library/react + jsdom | 13 | 13 | 0 | 0 | **100%** | 1.72s |
| **TỔNG CỘNG** | **Toàn bộ hệ thống (End-to-End Test Suite)** | **48** | **48** | **0** | **0** | **100%** | **11.91s** |

---

## 2. MA TRẬN TRUY VẾT YÊU CẦU NGHIỆP VỤ (REQUIREMENTS → TESTS)

| Mã User Story | Tiêu đề nghiệp vụ & Hành vi hệ thống | Tệp kiểm thử cụ thể | Phương thức / Test Case | Kết quả |
| :--- | :--- | :--- | :--- | :---: |
| **US-01** | Quản lý tài khoản, Đăng ký ứng viên & Đăng nhập JWT | `AuthServiceTest.java`<br>`AuthControllerTest.java` | `testRegisterCandidate_Success`<br>`testRegisterCandidate_DuplicateEmailThrowsBadRequest`<br>`testLogin_Success`<br>`testLogin_BadCredentialsThrowsUnauthorized`<br>`testRegisterEndpoint_Success`<br>`testRegisterEndpoint_InvalidEmail_BadRequest`<br>`testLoginEndpoint_Success` | **PASS** |
| **US-02** | Quản lý danh mục vị trí thực tập & Kỹ năng yêu cầu | `PositionServiceTest.java` | `testGetAllActivePositions`<br>`testCreatePosition_Success`<br>`testCreatePosition_DuplicateCodeThrowsBadRequest`<br>`testFindById_NotFoundThrowsException` | **PASS** |
| **US-03** | Quản lý ngân hàng câu hỏi phân cấp độ khó & Rubric | `QuestionServiceTest.java` | `testGetQuestionsByDifficulty`<br>`testCreateQuestion_Success`<br>`testDeleteQuestion_SoftDelete` | **PASS** |
| **US-04** | Ký thỏa thuận ghi âm giọng nói (Audio Consent) & Khởi tạo phiên | `InterviewSessionServiceTest.java`<br>`ConsentModal.test.tsx` | `testCreateSession_WithConsent_Success`<br>`testCreateSession_WithoutConsent_ThrowsBadRequest`<br>`renders modal content when isOpen is true`<br>`shows error message if submitting without checking consent`<br>`calls onConfirm when consent checkbox is checked and submitted` | **PASS** |
| **US-05** | Phòng phỏng vấn thoại AI thời gian thực & Điều phối STT/TTS | `InterviewStateMachine.test.ts`<br>`ProviderFactory.test.ts`<br>`MockProviders.test.ts`<br>`AIStateIndicator.test.tsx`<br>`LiveTranscriptBox.test.tsx` | `should transition through GREETING, ASKING to LISTENING on start()`<br>`should default to MockSTTProvider when key is empty`<br>`should default to MockTTSProvider when key is empty`<br>`MockSTTProvider should handle stream callbacks and finish`<br>`MockTTSProvider should synthesize audio stream and support cancellation`<br>`renders ASKING, LISTENING, THINKING, EVALUATING, COMPLETED`<br>`renders messages correctly with speaker names`<br>`renders in-progress streaming live text indicator` | **PASS** |
| **US-06** | Ngắt lời AI (Barge-in), Im lặng (Silence timeout) & Gõ chữ dự phòng (Text Chat Fallback) | `InterviewStateMachine.test.ts` | `should handle Barge-in during ASKING and switch immediately to LISTENING`<br>`should handle text answer and progress through all questions to COMPLETED`<br>`should allow ending interview early and transition to COMPLETED` | **PASS** |
| **US-07** | Phục hồi kết nối mạng (Reconnect Grace Period 60s) | `InterviewStateMachine.test.ts` | `should handle disconnect and reconnect gracefully` | **PASS** |
| **US-08** | Chấm điểm tự động theo Rubric, HR duyệt/sửa điểm & Audit Log | `EvaluationServiceTest.java`<br>`InternalGatewayServiceTest.java`<br>`InternalGatewayControllerTest.java`<br>`MockProviders.test.ts` | `testOverrideScoreByHR_Success`<br>`testOverrideScore_NotFoundThrowsException`<br>`testGetSessionContext_Success`<br>`testSaveTranscriptSegment_Success`<br>`testSubmitEvaluation_Success`<br>`testGetContext_WithServiceKey_200`<br>`testSaveTranscript_WithServiceKey_201`<br>`MockLLMProvider should generate follow-up and evaluate rubric` | **PASS** |

---

## 3. BẰNG CHỨNG THỰC THI (TEST EXECUTION LOGS)

### 3.1. Spring Boot Backend Test Suite (23/23 tests)
```text
[INFO] Running com.intern.interview.controller.AuthControllerTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 3.329 s -- in com.intern.interview.controller.AuthControllerTest
[INFO] Running com.intern.interview.controller.InternalGatewayControllerTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.401 s -- in com.intern.interview.controller.InternalGatewayControllerTest
[INFO] Running com.intern.interview.service.AuthServiceTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.261 s -- in com.intern.interview.service.AuthServiceTest
[INFO] Running com.intern.interview.service.EvaluationServiceTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.086 s -- in com.intern.interview.service.EvaluationServiceTest
[INFO] Running com.intern.interview.service.InternalGatewayServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.104 s -- in com.intern.interview.service.InternalGatewayServiceTest
[INFO] Running com.intern.interview.service.InterviewSessionServiceTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.107 s -- in com.intern.interview.service.InterviewSessionServiceTest
[INFO] Running com.intern.interview.service.PositionServiceTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.043 s -- in com.intern.interview.service.PositionServiceTest
[INFO] Running com.intern.interview.service.QuestionServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.010 s -- in com.intern.interview.service.QuestionServiceTest
[INFO] 
[INFO] Results:
[INFO] Tests run: 23, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

### 3.2. Voice Gateway Node.js Test Suite (12/12 tests)
```text
 RUN  v2.1.9 C:/Users/ASUS/voice-gateway-node

 ✓ src/tests/ProviderFactory.test.ts (3 tests) 3ms
 ✓ src/tests/InterviewStateMachine.test.ts (6 tests) 319ms
   ✓ InterviewStateMachine Test Suite > should handle Barge-in during ASKING and switch immediately to LISTENING 306ms
 ✓ src/tests/MockProviders.test.ts (3 tests) 344ms

 Test Files  3 passed (3)
      Tests  12 passed (12)
   Start at  17:42:05
   Duration  772ms
```

### 3.3. React Frontend Component Test Suite (13/13 tests)
```text
 RUN  v4.1.12 C:/Users/ASUS/frontend

 ✓ src/tests/LiveTranscriptBox.test.tsx (3 tests) 48ms
 ✓ src/tests/AIStateIndicator.test.tsx (6 tests) 55ms
 ✓ src/tests/ConsentModal.test.tsx (4 tests) 164ms

 Test Files  3 passed (3)
      Tests  13 passed (13)
   Start at  17:44:13
   Duration  1.72s
```
