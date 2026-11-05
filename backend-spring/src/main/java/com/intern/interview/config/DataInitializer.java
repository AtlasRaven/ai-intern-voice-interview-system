package com.intern.interview.config;

import com.intern.interview.entity.*;
import com.intern.interview.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final PositionRepository positionRepository;
    private final SkillRepository skillRepository;
    private final QuestionRepository questionRepository;
    private final ConsentRepository consentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           CandidateRepository candidateRepository,
                           PositionRepository positionRepository,
                           SkillRepository skillRepository,
                           QuestionRepository questionRepository,
                           ConsentRepository consentRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.candidateRepository = candidateRepository;
        this.positionRepository = positionRepository;
        this.skillRepository = skillRepository;
        this.questionRepository = questionRepository;
        this.consentRepository = consentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() > 0) {
            return;
        }

        System.out.println("[DataInitializer] Seeding initial database records...");

        // 1. Roles
        Role adminRole = roleRepository.save(new Role(1, "ROLE_ADMIN", "Quản trị viên toàn quyền hệ thống"));
        Role hrRole = roleRepository.save(new Role(2, "ROLE_INTERVIEWER", "Nhà tuyển dụng / Chuyên gia phỏng vấn đánh giá"));
        Role candidateRole = roleRepository.save(new Role(3, "ROLE_CANDIDATE", "Ứng viên sinh viên IT tham gia phỏng vấn"));

        // 2. Users (Passwords: Admin@123, Hr@123, Candidate@123)
        User adminUser = new User();
        adminUser.setEmail("admin@intern.vn");
        adminUser.setPasswordHash(passwordEncoder.encode("Admin@123"));
        adminUser.setFullName("Quản Trị Hệ Thống");
        adminUser.setPhone("0901234567");
        adminUser.setRole(adminRole);
        adminUser.setActive(true);
        userRepository.save(adminUser);

        User hrUser = new User();
        hrUser.setEmail("hr@intern.vn");
        hrUser.setPasswordHash(passwordEncoder.encode("Hr@123"));
        hrUser.setFullName("Nguyễn Thị Tuyển Dụng");
        hrUser.setPhone("0912345678");
        hrUser.setRole(hrRole);
        hrUser.setActive(true);
        userRepository.save(hrUser);

        User candUser = new User();
        candUser.setEmail("candidate@intern.vn");
        candUser.setPasswordHash(passwordEncoder.encode("Candidate@123"));
        candUser.setFullName("Trần Văn Sinh Viên");
        candUser.setPhone("0987654321");
        candUser.setRole(candidateRole);
        candUser.setActive(true);
        User savedCandUser = userRepository.save(candUser);

        // 3. Candidate profile
        Candidate cand = new Candidate();
        cand.setUser(savedCandUser);
        cand.setUniversity("Đại học Bách Khoa Hà Nội");
        cand.setMajor("Công nghệ Thông tin");
        cand.setGraduationYear(2026);
        cand.setGpa(new BigDecimal("3.45"));
        cand.setCvUrl("https://storage.intern.vn/cv/tran-van-sinh-vien.pdf");
        Candidate savedCandidate = candidateRepository.save(cand);

        // Pre-consent for demo candidate
        Consent consent = new Consent();
        consent.setUser(savedCandUser);
        consent.setConsentType("AUDIO_RECORDING");
        consent.setAgreed(true);
        consent.setAgreedAt(OffsetDateTime.now());
        consent.setPolicyVersion("v1.0");
        consentRepository.save(consent);

        // 4. Positions
        Position p1 = positionRepository.save(createPos("JAVA_BE", "Java Backend Intern",
                "Thực tập sinh phát triển hệ thống backend sử dụng Java 21, Spring Boot 3 và cơ sở dữ liệu quan hệ PostgreSQL.",
                "Nắm vững kiến thức Lập trình hướng đối tượng (OOP), Java Core, Spring Framework và SQL."));

        Position p2 = positionRepository.save(createPos("NODE_BE", "Node.js Backend Intern",
                "Thực tập sinh xây dựng microservices và API thời gian thực với Node.js, Express/NestJS và WebSocket.",
                "Hiểu sâu về cơ chế bất đồng bộ, Event Loop, Promise/Async-Await và REST API."));

        Position p3 = positionRepository.save(createPos("FE_REACT", "Frontend React Intern",
                "Thực tập sinh xây dựng giao diện người dùng hiện đại với React, TypeScript và Tailwind CSS.",
                "Thành thạo JavaScript ES6+, React Hooks, component lifecycle và responsive design."));

        Position p4 = positionRepository.save(createPos("QA_QC", "QA/QC Manual & Automation Intern",
                "Thực tập sinh kiểm thử phần mềm, thiết kế test cases và kiểm thử tự động API/E2E.",
                "Nắm vững quy trình kiểm thử, SQL cơ bản, viết kịch bản test và Postman."));

        Position p5 = positionRepository.save(createPos("DATA_AI", "Data Engineering & AI Intern",
                "Thực tập sinh kỹ thuật dữ liệu và ứng dụng mô hình ngôn ngữ lớn (LLM).",
                "Nắm vững Python, SQL, xử lý dữ liệu và tích hợp API mô hình AI."));

        // 5. Questions for Java Backend
        saveQuestion(p1, "Bạn hãy trình bày 4 đặc tính cơ bản của Lập trình Hướng đối tượng (OOP) và cho ví dụ cụ thể cho từng đặc tính?", "EASY",
                "4 đặc tính: Đóng gói (Encapsulation), Kế thừa (Inheritance), Đa hình (Polymorphism), Trừu tượng (Abstraction).",
                "Nêu đủ 4 tính chất (4đ), giải thích bản chất (3đ), ví dụ minh họa đúng (3đ).");

        saveQuestion(p1, "Hãy phân biệt sự khác nhau giữa Interface và Abstract Class trong Java? Khi nào nên sử dụng cái nào?", "MEDIUM",
                "Interface hỗ trợ đa kế thừa hành vi, Abstract Class thể hiện mối quan hệ 'is-a' chặt chẽ.",
                "Phân biệt cú pháp & bản chất (5đ), nêu trường hợp áp dụng thực tế (5đ).");

        saveQuestion(p1, "Cơ chế Lazy Loading trong Spring Data JPA là gì? Hiện tượng N+1 Query xảy ra như thế nào và cách giải quyết?", "MEDIUM",
                "Lazy Loading chỉ tải thực thể liên kết khi được gọi; N+1 xảy ra khi duyệt danh sách kích hoạt thêm N câu query. Giải quyết bằng JOIN FETCH hoặc EntityGraph.",
                "Giải thích cơ chế Lazy (3đ), mô tả lỗi N+1 (3đ), giải pháp tối ưu JOIN FETCH (4đ).");

        saveQuestion(p1, "Vòng đời của một Spring Bean diễn ra như thế nào? Phân biệt các Bean Scope phổ biến (Singleton, Prototype)?", "HARD",
                "Vòng đời: Khởi tạo, Inject dependencies, Post-construct callback, Sẵn sàng dùng, Pre-destroy. Mặc định là Singleton.",
                "Trình bày vòng đời Bean (5đ), phân biệt Singleton và Prototype (5đ).");

        // Questions for Node.js Backend
        saveQuestion(p2, "Hãy giải thích cơ chế Event Loop trong Node.js? Tại sao Node.js đơn luồng nhưng vẫn xử lý đồng thời hàng nghìn request I/O?", "EASY",
                "Node.js dùng Event Loop với thư viện libuv để offload các tác vụ non-blocking I/O xuống tầng hệ điều hành.",
                "Nêu bản chất đơn luồng (3đ), giải thích Call Stack & Event Loop (4đ), vai trò của libuv (3đ).");

        saveQuestion(p2, "Phân biệt Promise, async/await và callback trong JavaScript? Lỗi Callback Hell được giải quyết như thế nào?", "MEDIUM",
                "Callback là hàm truyền như đối số. Promise cung cấp cấu trúc then/catch. async/await giúp viết code bất đồng bộ dạng đồng bộ.",
                "Phân biệt rõ 3 cơ chế (5đ), giải thích cách async/await triệt tiêu Callback Hell (5đ).");

        // Questions for Frontend React
        saveQuestion(p3, "Trình bày sự khác nhau giữa useState và useEffect trong React? Khi nào hàm cleanup của useEffect được kích hoạt?", "EASY",
                "useState quản lý trạng thái nội tại của component. useEffect xử lý side-effects. Cleanup chạy khi component unmount hoặc dependencies thay đổi.",
                "Mục đích useState (3đ), vai trò useEffect (4đ), cơ chế cleanup tránh memory leak (3đ).");

        saveQuestion(p3, "Virtual DOM trong React hoạt động như thế nào? Thuật toán Diffing và vai trò của thuộc tính 'key' trong danh sách?", "MEDIUM",
                "Virtual DOM là bản sao JS của DOM thật. Diffing so sánh để chỉ cập nhật phần tử thay đổi. Key giúp nhận diện phần tử không bị render lại vô ích.",
                "Giải thích Virtual DOM (4đ), thuật toán Diffing (3đ), lý do cần unique key (3đ).");

        System.out.println("[DataInitializer] Database successfully seeded with 3 roles, 3 users, 5 positions, and questions!");
    }

    private Position createPos(String code, String title, String desc, String req) {
        Position pos = new Position();
        pos.setCode(code);
        pos.setTitle(title);
        pos.setDescription(desc);
        pos.setRequirements(req);
        pos.setOpen(true);
        return pos;
    }

    private void saveQuestion(Position p, String content, String difficulty, String sampleAnswer, String rubric) {
        Question q = new Question();
        q.setPosition(p);
        q.setContent(content);
        q.setDifficulty(difficulty);
        q.setSampleAnswer(sampleAnswer);
        q.setEvaluationRubric(rubric);
        q.setActive(true);
        questionRepository.save(q);
    }
}
