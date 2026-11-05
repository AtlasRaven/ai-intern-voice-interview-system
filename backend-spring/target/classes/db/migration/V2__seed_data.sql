-- =============================================================================
-- V2__seed_data.sql
-- Voice AI Intern Interview System - Initial Seed Data
-- =============================================================================

-- 1. Insert Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'Quản trị viên toàn quyền hệ thống'),
(2, 'ROLE_INTERVIEWER', 'Nhà tuyển dụng / Chuyên gia phỏng vấn đánh giá'),
(3, 'ROLE_CANDIDATE', 'Ứng viên sinh viên IT tham gia phỏng vấn')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Default Users (password hash for 'password': $2a$10$7EqJtq98hPqEX7fNZaFWoOhi5F758e5vF8iC9UepT9kR3.YvPz0ea)
INSERT INTO users (id, role_id, email, password_hash, full_name, phone, is_active) VALUES
(1, 1, 'admin@intern.vn', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5F758e5vF8iC9UepT9kR3.YvPz0ea', 'Quản Trị Hệ Thống', '0901234567', true),
(2, 2, 'hr@intern.vn', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5F758e5vF8iC9UepT9kR3.YvPz0ea', 'Nguyễn Thị Tuyển Dụng', '0912345678', true),
(3, 3, 'candidate@intern.vn', '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi5F758e5vF8iC9UepT9kR3.YvPz0ea', 'Trần Văn Sinh Viên', '0987654321', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Candidate Profile
INSERT INTO candidates (id, user_id, university, major, graduation_year, gpa, cv_url) VALUES
(1, 3, 'Đại học Bách Khoa Hà Nội', 'Công nghệ Thông tin', 2026, 3.45, 'https://storage.intern.vn/cv/tran-van-sinh-vien.pdf')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Skills
INSERT INTO skills (id, name, category) VALUES
(1, 'Java Core', 'PROGRAMMING_LANGUAGE'),
(2, 'Spring Boot', 'FRAMEWORK'),
(3, 'SQL & RDBMS', 'DATABASE'),
(4, 'JPA / Hibernate', 'ORM'),
(5, 'JavaScript / TypeScript', 'PROGRAMMING_LANGUAGE'),
(6, 'Node.js', 'RUNTIME'),
(7, 'Express.js', 'FRAMEWORK'),
(8, 'RESTful API Design', 'ARCHITECTURE'),
(9, 'React.js', 'FRAMEWORK'),
(10, 'HTML5 / CSS3', 'FRONTEND'),
(11, 'Tailwind CSS', 'FRONTEND'),
(12, 'Manual Testing Fundamentals', 'TESTING'),
(13, 'API Testing (Postman)', 'TESTING'),
(14, 'Automation Testing (Playwright / Selenium)', 'TESTING'),
(15, 'Python Programming', 'PROGRAMMING_LANGUAGE'),
(16, 'Machine Learning Basics', 'AI_DATA'),
(17, 'LLM & Prompt Engineering', 'AI_DATA'),
(18, 'Git & Version Control', 'TOOLS')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Positions
INSERT INTO positions (id, code, title, description, requirements, is_open) VALUES
(1, 'JAVA_BE', 'Java Backend Intern', 
 'Thực tập sinh phát triển hệ thống backend sử dụng Java 21, Spring Boot 3 và cơ sở dữ liệu quan hệ PostgreSQL.', 
 'Nắm vững kiến thức Lập trình hướng đối tượng (OOP), Java Core (Collections, Exception), kiến thức cơ bản về Spring Framework và câu lệnh SQL.', true),

(2, 'NODE_BE', 'Node.js Backend Intern', 
 'Thực tập sinh xây dựng microservices và API thời gian thực với Node.js, Express/NestJS và WebSocket.', 
 'Hiểu sâu về cơ chế bất đồng bộ (Asynchronous), Event Loop, Promise/Async-Await, lập trình REST API và tương tác cơ sở dữ liệu.', true),

(3, 'FE_REACT', 'Frontend React Intern', 
 'Thực tập sinh xây dựng giao diện người dùng hiện đại, tối ưu hiệu năng với React, TypeScript và Tailwind CSS.', 
 'Thành thạo HTML5/CSS3/JavaScript ES6+, nắm vững React Hooks (useState, useEffect, useContext), component lifecycle và responsive design.', true),

(4, 'QA_QC', 'QA/QC Software Testing Intern', 
 'Thực tập sinh kiểm thử chất lượng phần mềm, thiết kế test cases, kiểm thử API và tự động hóa kiểm thử.', 
 'Nắm vững quy trình kiểm thử phần mềm (STLC), phân biệt functional vs non-functional testing, kỹ thuật biên và tương đương, sử dụng thành thạo Postman.', true),

(5, 'DATA_AI', 'Data & AI Intern', 
 'Thực tập sinh phân tích dữ liệu, ứng dụng các mô hình học máy và tích hợp giải pháp AI/LLM vào sản phẩm.', 
 'Thành thạo lập trình Python, xử lý dữ liệu với Pandas/NumPy, hiểu các thuật toán Supervised/Unsupervised cơ bản và khái niệm về Prompt Engineering/RAG.', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Link Positions with Skills
INSERT INTO position_skills (position_id, skill_id, is_required) VALUES
-- Java Backend
(1, 1, true),  -- Java Core
(1, 2, true),  -- Spring Boot
(1, 3, true),  -- SQL
(1, 4, false), -- JPA
(1, 18, true), -- Git
-- Node.js Backend
(2, 5, true),  -- JS/TS
(2, 6, true),  -- Node.js
(2, 7, true),  -- Express
(2, 8, true),  -- RESTful
(2, 18, true), -- Git
-- Frontend React
(3, 5, true),  -- JS/TS
(3, 9, true),  -- React
(3, 10, true), -- HTML/CSS
(3, 11, false),-- Tailwind
(3, 18, true), -- Git
-- QA/QC
(4, 12, true), -- Manual Testing
(4, 13, true), -- API Testing
(4, 14, false),-- Automation
(4, 18, true), -- Git
-- Data / AI
(5, 15, true), -- Python
(5, 16, true), -- ML Basics
(5, 17, true), -- LLM
(5, 3, false)  -- SQL
ON CONFLICT (position_id, skill_id) DO NOTHING;

-- 7. Insert Questions Bank (7 questions per position = 35 questions total)
-- -----------------------------------------------------------------------------
-- Position 1: Java Backend Intern
-- -----------------------------------------------------------------------------
INSERT INTO questions (id, position_id, content, difficulty, sample_answer, evaluation_rubric) VALUES
(1, 1, 'Bạn hãy trình bày 4 đặc tính cơ bản của Lập trình Hướng đối tượng (OOP) và cho một ví dụ thực tế?', 'EASY',
 '4 đặc tính gồm: Đóng gói (Encapsulation), Kế thừa (Inheritance), Đa hình (Polymorphism) và Trừu tượng (Abstraction). Ví dụ: Lớp Animal có phương thức makeSound, Dog kế thừa Animal và override lại makeSound là sủa.',
 'Nêu đủ 4 đặc tính (4đ). Giải thích đúng bản chất từng đặc tính (4đ). Cho ví dụ thực tế minh họa chính xác (2đ).'),

(2, 1, 'Trong Java, sự khác biệt giữa ArrayList và LinkedList là gì? Khi nào nên sử dụng loại nào?', 'EASY',
 'ArrayList dựa trên mảng động, truy xuất phần tử theo index cực nhanh O(1), chèn/xóa ở giữa chậm O(N). LinkedList dựa trên danh sách liên kết đôi, truy xuất theo index chậm O(N), nhưng chèn/xóa tại vị trí biết trước rất nhanh O(1). Nên dùng ArrayList khi đọc nhiều, LinkedList khi thêm xóa đầu/cuối nhiều.',
 'Nêu đúng cấu trúc dữ liệu nền tảng (3đ). Phân tích độ phức tạp thời gian get vs add/remove (4đ). Đưa ra lời khuyên sử dụng phù hợp (3đ).'),

(3, 1, 'Spring Bean là gì? Bạn hãy nêu vòng đời cơ bản của một Bean trong Spring Boot container?', 'MEDIUM',
 'Spring Bean là đối tượng được khởi tạo, cấu hình và quản lý bởi Spring IoC Container. Vòng đời cơ bản: Tải Bean Definition -> Khởi tạo đối tượng (Instantiation) -> Tiêm phụ thuộc (Dependency Injection) -> Gọi PostConstruct / InitializingBean -> Bean sẵn sàng sử dụng -> Gọi PreDestroy khi container tắt.',
 'Định nghĩa đúng Spring Bean và IoC Container (3đ). Trình bày đúng thứ tự vòng đời (5đ). Nhắc đến @PostConstruct hoặc @PreDestroy (2đ).'),

(4, 1, 'Cơ chế Lazy Loading và Eager Loading trong JPA/Hibernate khác nhau thế nào? Hiện tượng N+1 query xảy ra khi nào và cách khắc phục?', 'MEDIUM',
 'Eager loading tải dữ liệu liên kết ngay lập tức khi query entity cha. Lazy loading chỉ tải dữ liệu liên kết khi được truy cập thực tế. Hiện tượng N+1 xảy ra khi lấy N bản ghi cha và với mỗi bản ghi lại thực hiện thêm 1 query phụ lấy bản ghi con. Khắc phục bằng JOIN FETCH trong JPQL hoặc EntityGraph.',
 'Phân biệt chính xác Eager vs Lazy (3đ). Giải thích rõ nguyên nhân N+1 query (4đ). Nêu ít nhất 1 giải pháp khắc phục triệt để như JOIN FETCH (3đ).'),

(5, 1, 'Bạn hiểu thế nào về Concurrency trong Java? Sự khác nhau giữa synchronized block và ReentrantLock là gì?', 'HARD',
 'Concurrency là khả năng thực thi nhiều tác vụ đồng thời. synchronized là cơ chế khóa mức ngôn ngữ ngầm định, tự động giải phóng lock nhưng không hỗ trợ timeout hay tryLock. ReentrantLock là class cung cấp khả năng kiểm soát lock linh hoạt hơn với tryLock(), lockInterruptibly() và hỗ trợ công bằng (fairness policy).',
 'Hiểu bản chất đồng thời và luồng (2đ). So sánh chi tiết synchronized vs ReentrantLock (5đ). Nhắc đến khả năng timeout hoặc deadlock avoidance (3đ).'),

(6, 1, 'Giải thích 4 mức cô lập giao dịch (Transaction Isolation Levels) trong cơ sở dữ liệu quan hệ và các hiện tượng tương ứng (Dirty Read, Non-repeatable Read, Phantom Read)?', 'HARD',
 '4 mức: Read Uncommitted (bị Dirty Read), Read Committed (ngăn Dirty Read, bị Non-repeatable Read), Repeatable Read (ngăn Non-repeatable, có thể bị Phantom Read), Serializable (ngăn toàn bộ, tuần tự hóa giao dịch).',
 'Kể tên đúng 4 mức cô lập (3đ). Giải thích chính xác 3 hiện tượng dị thường dữ liệu (4đ). Nêu được sự đánh đổi giữa tính toàn vẹn và hiệu năng (3đ).'),

(7, 1, 'Trong Spring Boot, annotation @Transactional hoạt động dựa trên cơ chế nào bên dưới?', 'MEDIUM',
 'Hoạt động dựa trên Spring AOP (Dynamic Proxy hoặc CGLIB). Proxy chặn cuộc gọi method, mở Transaction trước khi method chạy, commit nếu thành công và rollback nếu có RuntimeException.',
 'Nhắc đến Spring AOP và Proxy Pattern (5đ). Giải thích luồng bắt đầu, commit và rollback khi gặp exception (5đ).'),

-- -----------------------------------------------------------------------------
-- Position 2: Node.js Backend Intern
-- -----------------------------------------------------------------------------
(8, 2, 'Bạn hãy giải thích cơ chế Event Loop trong Node.js và tại sao Node.js xử lý I/O tốt dù là đơn luồng?', 'EASY',
 'Node.js có luồng chính (Main Thread) đơn luồng xử lý JavaScript theo mô hình non-blocking. Các tác vụ I/O nặng (file, network) được ủy thác cho thư viện libuv với Thread Pool chạy ngầm. Khi I/O hoàn tất, callback được đẩy vào Event Queue và Event Loop lấy ra thực thi trên luồng chính.',
 'Giải thích được đơn luồng nhưng non-blocking (3đ). Nhắc đến libuv và thread pool ngầm (4đ). Mô tả đúng luồng hoạt động của Event Loop (3đ).'),

(9, 2, 'Sự khác biệt giữa Synchronous và Asynchronous trong JavaScript là gì? Cho ví dụ về Callback, Promise và Async/Await?', 'EASY',
 'Sync thực thi tuần tự chặn dòng code kế tiếp. Async cho phép tác vụ chạy nền không chặn. Callback là hàm truyền vào hàm khác; Promise là đối tượng đại diện cho giá trị tương lai (pending, fulfilled, rejected); Async/Await là cú pháp giúp viết Promise như code đồng bộ.',
 'Phân biệt đúng Sync vs Async (3đ). Nêu đúng bản chất Callback, Promise, Async/Await (4đ). Cho ví dụ cú pháp chính xác (3đ).'),

(10, 2, 'Middleware trong Express.js là gì? Bạn hãy viết luồng xử lý của một Auth Middleware kiểm tra JWT token?', 'MEDIUM',
 'Middleware là hàm có quyền truy cập vào request, response và hàm next(). Middleware nhận req, đọc Authorization header lấy Bearer token, verify qua jwt.verify(). Nếu hợp lệ thì gắn user vào req.user và gọi next(); nếu không hợp lệ thì trả về 401 Unauthorized.',
 'Định nghĩa đúng Middleware và tham số next (3đ). Trình bày logic kiểm tra token rõ ràng (5đ). Xử lý đúng case lỗi 401 khi token sai (2đ).'),

(11, 2, 'Stream và Buffer trong Node.js khác nhau thế nào? Khi nào cần dùng Stream để xử lý dữ liệu lớn?', 'MEDIUM',
 'Buffer lưu trữ dữ liệu nhị phân cố định trong bộ nhớ RAM. Stream xử lý dữ liệu theo từng khối nhỏ (chunks) theo thời gian mà không cần tải toàn bộ vào RAM. Dùng Stream khi đọc ghi file video lớn, file log hàng gigabytes hoặc truyền tải audio realtime để tránh tràn bộ nhớ (Out of Memory).',
 'Phân biệt đúng Buffer (in-memory) vs Stream (chunk-by-chunk) (4đ). Giải thích được nguy cơ OOM nếu không dùng Stream (3đ). Đưa ra ví dụ thực tế thuyết phục (3đ).'),

(12, 2, 'Làm thế nào để phát hiện và phòng chống Memory Leak trong ứng dụng Node.js?', 'HARD',
 'Nguyên nhân thường do: biến toàn cục không giải phóng, Event Listener đăng ký liên tục không remove, closure giữ tham chiếu cũ, cache không giới hạn TTL. Phòng chống bằng cách hủy listener trong cleanup, dùng WeakMap, profiling bộ nhớ bằng Chrome DevTools hoặc heapdump.',
 'Nêu được ít nhất 2 nguyên nhân rò rỉ bộ nhớ thực tế (4đ). Trình bày cách khắc phục (hủy event listener, clear timer) (4đ). Nhắc đến công cụ profiling/heapdump (2đ).'),

(13, 2, 'Khi ứng dụng Node.js chịu tải cao, bạn sẽ làm gì để tận dụng tối đa CPU đa nhân của máy chủ?', 'HARD',
 'Sử dụng module Cluster của Node.js hoặc công cụ quản lý process như PM2 ở chế độ cluster mode để fork nhiều worker process tương ứng với số core CPU. Các process chia sẻ chung cổng mạng và phân phối request theo thuật toán Round Robin.',
 'Nhắc đến giới hạn đơn luồng của Node.js (2đ). Đề xuất module Cluster hoặc PM2 cluster mode (5đ). Giải thích cách chia sẻ port và cân bằng tải (3đ).'),

(14, 2, 'Sự khác biệt giữa process.nextTick() và setImmediate() trong Node.js là gì?', 'MEDIUM',
 'process.nextTick() kích hoạt callback ngay lập tức sau khi tác vụ hiện tại kết thúc, trước khi Event Loop bước sang giai đoạn tiếp theo (Microtask queue ưu tiên cao nhất). setImmediate() chạy trong giai đoạn Check phase của Event Loop (Macrotask queue).',
 'Chỉ ra sự khác biệt về độ ưu tiên thực thi (5đ). Giải thích đúng giai đoạn trong chu kỳ Event Loop (5đ).'),

-- -----------------------------------------------------------------------------
-- Position 3: Frontend React Intern
-- -----------------------------------------------------------------------------
(15, 3, 'Virtual DOM trong React hoạt động như thế nào và tại sao nó giúp cải thiện hiệu năng?', 'EASY',
 'Virtual DOM là một bản sao dạng cây JavaScript object của DOM thật trong bộ nhớ. Khi state thay đổi, React tạo Virtual DOM mới, so sánh với Virtual DOM cũ bằng thuật toán Diffing (Reconciliation), tính toán sự thay đổi tối thiểu và chỉ cập nhật đúng phần thay đổi lên Real DOM thật.',
 'Định nghĩa đúng Virtual DOM (3đ). Giải thích thuật toán Diffing / Reconciliation (4đ). Nêu lý do Real DOM chậm và Virtual DOM giúp tối ưu (3đ).'),

(16, 3, 'Phân biệt Props và State trong React? Khi nào nên sử dụng Props, khi nào dùng State?', 'EASY',
 'Props là dữ liệu truyền từ component cha xuống con, mang tính bất biến (read-only) đối với component con. State là trạng thái dữ liệu nội bộ được quản lý bên trong chính component đó và có thể thay đổi bằng setState. Dùng props để cấu hình và tái sử dụng, dùng state khi dữ liệu thay đổi theo tương tác người dùng.',
 'Phân biệt rõ tính bất biến của Props vs khả năng thay đổi của State (4đ). Trình bày luồng truyền dữ liệu 1 chiều (3đ). Nêu ví dụ khi nào dùng loại nào (3đ).'),

(17, 3, 'Quy tắc sử dụng useEffect Hook trong React là gì? Dependency array hoạt động thế nào và hàm cleanup được gọi khi nào?', 'MEDIUM',
 'Dependency array: [] chỉ chạy 1 lần sau mount; [a, b] chạy lại khi a hoặc b thay đổi; không truyền thì chạy sau mọi render. Hàm cleanup (return trong useEffect) chạy trước khi component unmount hoặc trước khi effect kế tiếp được thực thi để hủy subscription, event listener hoặc timer.',
 'Giải thích đúng 3 trường hợp của dependency array (4đ). Trình bày chính xác thời điểm gọi cleanup function (4đ). Nêu ví dụ thực tế cần cleanup (2đ).'),

(18, 3, 'Tại sao không nên cập nhật State trực tiếp (như state.count = 1) mà phải dùng hàm setState hoặc cập nhật bất biến (Immutable)?', 'MEDIUM',
 'Vì React sử dụng so sánh nông (Shallow Comparison) để phát hiện thay đổi state và kích hoạt re-render. Nếu mutate trực tiếp, tham chiếu đối tượng không đổi nên React không biết dữ liệu đã thay đổi để cập nhật giao diện, gây bug không đồng bộ UI.',
 'Giải thích cơ chế so sánh nông và re-render (5đ). Trình bày nguyên lý Immutability trong React (5đ).'),

(19, 3, 'Bạn sử dụng useMemo và useCallback khi nào? Sử dụng lạm dụng hai hook này có gây hại gì không?', 'HARD',
 'useMemo ghi nhớ (cache) kết quả tính toán tốn kém. useCallback ghi nhớ định nghĩa hàm để tránh tạo hàm mới khi re-render truyền xuống component con bọc React.memo. Lạm dụng gây tốn bộ nhớ lưu trữ closure/deps và chi phí so sánh mảng dependencies đôi khi còn đắt hơn re-create hàm đơn giản.',
 'Phân biệt đúng useMemo (cache giá trị) vs useCallback (cache hàm) (4đ). Nêu trường hợp nên dùng với React.memo (3đ). Phân tích được nhược điểm khi lạm dụng (3đ).'),

(20, 3, 'Hãy trình bày cách bạn cấu trúc và quản lý State trong một ứng dụng React quy mô vừa (Context API vs Zustand/Redux)?', 'HARD',
 'Phân loại: Server State (dùng TanStack Query), Local State (useState/useReducer), Global App State (Context API cho theme/auth ít đổi; Zustand/Redux Toolkit cho state phức tạp thay đổi thường xuyên tránh re-render thừa toàn bộ cây component).',
 'Phân biệt được Local State, Server State và Global State (4đ). So sánh Context API vs Zustand/Redux về hiệu năng re-render (4đ). Kiến trúc phân tầng hợp lý (2đ).'),

(21, 3, 'Custom Hook trong React là gì? Bạn đã từng tự viết Custom Hook nào chưa, hãy mô tả mục đích của nó?', 'MEDIUM',
 'Custom Hook là một hàm JavaScript có tên bắt đầu bằng "use" và có thể gọi các Hook khác của React. Mục đích là tái sử dụng logic có chứa state giữa các component khác nhau mà không lặp lại code. Ví dụ: useDebounce, useWindowSize, useAudioRecorder.',
 'Định nghĩa đúng quy ước đặt tên và bản chất Custom Hook (4đ). Giải thích mục đích tách biệt và tái sử dụng logic (3đ). Đưa ra ví dụ thực tế khả thi (3đ).'),

-- -----------------------------------------------------------------------------
-- Position 4: QA/QC Intern
-- -----------------------------------------------------------------------------
(22, 4, 'Bạn hãy phân biệt sự khác nhau giữa Functional Testing (Kiểm thử chức năng) và Non-functional Testing (Kiểm thử phi chức năng)?', 'EASY',
 'Functional testing kiểm tra hệ thống làm ĐÚNG NHỮNG GÌ theo yêu cầu nghiệp vụ (đăng nhập, thanh toán, CRUD). Non-functional testing kiểm tra hệ thống hoạt động TỐT ĐẾN MỨC NÀO (hiệu năng, độ tải, bảo mật, khả năng phục hồi, tính dễ sử dụng).',
 'Phân biệt rõ trọng tâm kiểm thử của 2 loại (4đ). Đưa ra ví dụ cụ thể cho Functional (3đ). Đưa ra ví dụ cụ thể cho Non-functional (Performance, Security) (3đ).'),

(23, 4, 'Vòng đời của một con Bug (Bug Life Cycle) diễn ra như thế nào từ lúc phát hiện đến khi đóng?', 'EASY',
 'New (phát hiện và tạo) -> Assigned (giao cho Dev) -> Open/In Progress (Dev sửa) -> Fixed (Dev sửa xong) -> Retest (QA test lại) -> Verified/Closed (nếu pass) hoặc Reopened (nếu bug vẫn còn).',
 'Liệt kê đúng các trạng thái cơ bản của Bug (5đ). Giải thích điều kiện chuyển đổi trạng thái (Closed vs Reopened) (5đ).'),

(24, 4, 'Trình bày hai kỹ thuật thiết kế test case hộp đen: Phân vùng tương đương (Equivalence Partitioning) và Phân tích giá trị biên (Boundary Value Analysis)?', 'MEDIUM',
 'Phân vùng tương đương chia miền đầu vào thành các nhóm hợp lệ và không hợp lệ, chỉ cần chọn 1 đại diện mỗi nhóm. Phân tích giá trị biên tập trung kiểm thử các giá trị ngay tại ranh giới (min, min+1, max, max-1, ngoài biên) vì lỗi thường xuất hiện nhiều nhất ở ranh giới.',
 'Định nghĩa đúng Phân vùng tương đương (3đ). Định nghĩa đúng Phân tích giá trị biên (3đ). Cho ví dụ áp dụng cụ thể (ví dụ trường tuổi 18-60) (4đ).'),

(25, 4, 'Khi kiểm thử API với Postman, các mã HTTP Status Code nào là quan trọng nhất bạn cần kiểm tra?', 'MEDIUM',
 '200 OK, 201 Created (thành công); 400 Bad Request (lỗi dữ liệu gửi lên); 401 Unauthorized (chưa xác thực); 403 Forbidden (không có quyền); 404 Not Found (không tìm thấy); 409 Conflict (trùng lặp); 500 Internal Server Error (lỗi server).',
 'Nêu được các nhóm 2xx, 4xx, 5xx (3đ). Phân biệt chính xác 401 (ai là bạn) vs 403 (bạn có quyền làm việc này không) (4đ). Nêu được cách viết test script assertion trong Postman (3đ).'),

(26, 4, 'Regression Testing (Kiểm thử hồi quy) là gì? Khi nào cần thực hiện và làm thế nào để tối ưu thời gian kiểm thử hồi quy?', 'HARD',
 'Kiểm thử hồi quy là việc chạy lại các test case hiện có sau khi mã nguồn có thay đổi (sửa bug hoặc thêm tính năng mới) nhằm đảm bảo thay đổi không làm hỏng các chức năng đang hoạt động tốt. Tối ưu bằng cách tự động hóa bộ test (Automation) và chọn lọc test case trọng yếu (Risk-based testing).',
 'Định nghĩa đúng mục đích của Regression Testing (4đ). Chỉ ra thời điểm cần chạy (sau commit/release) (3đ). Đề xuất giải pháp tự động hóa và chọn lọc test (3đ).'),

(27, 4, 'Bạn hãy thiết kế các test case cho chức năng Đăng nhập (Login form) bao gồm cả Happy path, Edge case và Security test?', 'HARD',
 'Happy path: đúng user/pass -> 200 vào home. Edge case: email chữ hoa chữ thường, space đầu cuối, pass đúng độ dài min/max, ký tự đặc biệt. Security: SQL injection, brute force (khóa sau 5 lần sai), ẩn mật khẩu, không trả về chi tiết sai do user hay do pass.',
 'Bao phủ đầy đủ Happy Path (2đ). Nêu được các ca kiểm thử biên và trường hợp lỗi (4đ). Đưa ra các ca kiểm thử bảo mật (SQL Injection, Rate limit) (4đ).'),

(28, 4, 'Severity (Mức độ nghiêm trọng) và Priority (Mức độ ưu tiên) của một bug khác nhau như thế nào? Cho ví dụ High Severity nhưng Low Priority?', 'MEDIUM',
 'Severity đo lường mức độ tác động kỹ thuật của bug lên hệ thống (Crash, mất dữ liệu). Priority xác định thứ tự cần ưu tiên sửa đổi từ góc độ kinh doanh. Ví dụ: Logo công ty sai chính tả trên trang chủ (High Priority nhưng Low Severity); Trang tài liệu hướng dẫn ít người đọc bị crash khi click vào link hỏng (High Severity nhưng Low Priority).',
 'Phân biệt rõ Severity (kỹ thuật) vs Priority (kinh doanh) (4đ). Đưa ra ví dụ minh họa đúng và thuyết phục (6đ).'),

-- -----------------------------------------------------------------------------
-- Position 5: Data & AI Intern
-- -----------------------------------------------------------------------------
(29, 5, 'Phân biệt sự khác nhau giữa Học có giám sát (Supervised Learning) và Học không giám sát (Unsupervised Learning)?', 'EASY',
 'Supervised Learning huấn luyện mô hình trên dữ liệu đã có nhãn (Labeled data) để dự đoán nhãn cho dữ liệu mới (Bài toán: Phân loại Classification, Hồi quy Regression). Unsupervised Learning tìm kiếm cấu trúc, quy luật ẩn trên dữ liệu chưa có nhãn (Bài toán: Phân cụm Clustering, Giảm chiều dữ liệu).',
 'Phân biệt chính xác dựa trên tiêu chí dữ liệu có nhãn hay không (4đ). Nêu đúng bài toán tiêu biểu của Supervised (3đ). Nêu đúng bài toán tiêu biểu của Unsupervised (3đ).'),

(30, 5, 'Khi làm sạch dữ liệu trong Pandas, bạn xử lý các giá trị bị khuyết (Missing values) bằng những cách nào?', 'EASY',
 'Cách 1: Xóa bản ghi hoặc cột bị thiếu (dropna) nếu tỷ lệ thiếu ít. Cách 2: Điền giá trị thay thế (fillna) bằng giá trị trung bình (mean), trung vị (median) cho biến số hoặc mode cho biến phân loại. Cách 3: Dự đoán giá trị điền bằng thuật toán như KNN Imputer hoặc Forward/Backward fill cho chuỗi thời gian.',
 'Nêu được cách loại bỏ (dropna) và điều kiện áp dụng (3đ). Nêu được các phương pháp điền khuyết (mean/median/mode) (4đ). Nhắc đến rủi ro sai lệch phân phối dữ liệu (3đ).'),

(31, 5, 'Hiện tượng Overfitting trong Machine Learning là gì? Bạn làm thế nào để phát hiện và ngăn chặn hiện tượng này?', 'MEDIUM',
 'Overfitting xảy ra khi mô hình học quá kỹ dữ liệu huấn luyện (kể cả nhiễu), đạt độ chính xác cao trên tập Train nhưng kém trên tập Test/Validation. Phát hiện qua khoảng cách lớn giữa Train loss và Validation loss. Ngăn chặn bằng: thu thập thêm dữ liệu, K-fold Cross Validation, Regularization (L1/L2), Early Stopping, Dropout (với Deep Learning).',
 'Định nghĩa đúng bản chất của Overfitting (3đ). Trình bày cách phát hiện qua train/val curve (3đ). Nêu ít nhất 3 kỹ thuật phòng chống hiệu quả (4đ).'),

(32, 5, 'Vector Embedding là gì và tại sao nó lại đóng vai trò nền tảng trong các ứng dụng AI và tìm kiếm ngữ nghĩa?', 'MEDIUM',
 'Vector Embedding là biểu diễn toán học của văn bản, hình ảnh hoặc âm thanh dưới dạng một vector số thực trong không gian đa chiều, sao cho các đối tượng có ngữ nghĩa tương đồng sẽ nằm gần nhau (đo bằng Cosine Similarity). Nó cho phép máy tính hiểu được ngữ nghĩa thay vì chỉ so khớp từ khóa chính xác.',
 'Định nghĩa đúng Vector Embedding trong không gian số thực (4đ). Giải thích phép đo độ tương đồng (Cosine distance) (3đ). Nêu ứng dụng trong tìm kiếm ngữ nghĩa (Semantic Search) (3đ).'),

(33, 5, 'Hãy giải thích kiến trúc RAG (Retrieval-Augmented Generation) và cách nó giúp hạn chế hiện tượng ảo giác (Hallucination) của LLM?', 'HARD',
 'RAG kết hợp giữa Truy xuất thông tin (Retrieval) và Sinh văn bản (Generation). Khi người dùng hỏi, hệ thống tìm kiếm tài liệu liên quan từ Vector Database, đưa các đoạn trích đó vào ngữ cảnh (Context) của prompt cùng với câu hỏi, yêu cầu LLM trả lời dựa trên tài liệu cung cấp. Nhờ có dữ kiện thực tế làm căn cứ, LLM giảm thiểu ảo giác và cập nhật được dữ liệu mới.',
 'Mô tả đúng luồng hoạt động của RAG: Retrieval -> Augment Prompt -> LLM Generation (4đ). Giải thích được cơ chế giảm ảo giác (Hallucination reduction) (3đ). Nêu được lợi ích về chi phí so với Fine-tuning (3đ).'),

(34, 5, 'Sự khác nhau giữa Prompt Engineering, RAG và Fine-tuning mô hình ngôn ngữ lớn (LLM)? Khi nào nên chọn giải pháp nào?', 'HARD',
 'Prompt Engineering: Tối ưu câu lệnh và kỹ thuật hướng dẫn (nhanh, rẻ, không đổi weights). RAG: Cung cấp tri thức động bên ngoài qua vector search (phù hợp tra cứu tài liệu doanh nghiệp luôn cập nhật). Fine-tuning: Huấn luyện cập nhật lại trọng số mô hình trên tập dữ liệu đặc thù (phù hợp học phong cách, ngữ pháp chuyên ngành sâu, chi phí cao).',
 'So sánh chính xác 3 phương pháp về chi phí, dữ liệu và thời gian (4đ). Đưa ra tiêu chí lựa chọn cho bài toán thực tế (4đ). Phân tích được ưu nhược điểm từng cách (2đ).'),

(35, 5, 'Tại sao việc đánh giá mô hình LLM (LLM Evaluation) lại khó hơn mô hình ML truyền thống? Bạn biết những phương pháp đánh giá nào?', 'HARD',
 'Vì đầu ra của LLM là ngôn ngữ tự nhiên mở (open-ended), không có ground truth đơn nhất như Accuracy/F1. Các phương pháp đánh giá: Human Evaluation (con người chấm theo rubric), LLM-as-a-Judge (dùng model mạnh như GPT-4/Claude Sonnet chấm theo tiêu chí cụ thể), Benchmark chuẩn (MMLU, GSM8K), và các độ đo tự động như BLEU/ROUGE.',
 'Chỉ ra tính chất open-ended của output LLM (3đ). Trình bày phương pháp LLM-as-a-Judge với rubric rõ ràng (4đ). Nêu các tiêu chí đánh giá (Faithfulness, Relevance, Safety) (3đ).')
ON CONFLICT (id) DO NOTHING;

-- 8. Link Questions with Skills
INSERT INTO question_skills (question_id, skill_id) VALUES
-- Java Backend Questions
(1, 1), (2, 1), (3, 2), (4, 4), (4, 3), (5, 1), (6, 3), (7, 2),
-- Node.js Backend Questions
(8, 6), (9, 5), (10, 7), (10, 8), (11, 6), (12, 6), (13, 6), (14, 6),
-- Frontend React Questions
(15, 9), (16, 9), (17, 9), (18, 9), (19, 9), (20, 9), (21, 9),
-- QA/QC Questions
(22, 12), (23, 12), (24, 12), (25, 13), (26, 12), (26, 14), (27, 12), (28, 12),
-- Data & AI Questions
(29, 16), (30, 15), (31, 16), (32, 17), (33, 17), (34, 17), (35, 17)
ON CONFLICT (question_id, skill_id) DO NOTHING;
