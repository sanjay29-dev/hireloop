package com.hireloop.backend.config;

import com.hireloop.backend.entity.Application;
import com.hireloop.backend.entity.CandidateProfile;
import com.hireloop.backend.entity.Company;
import com.hireloop.backend.entity.Job;
import com.hireloop.backend.entity.User;
import com.hireloop.backend.enums.*;
import com.hireloop.backend.repository.ApplicationRepository;
import com.hireloop.backend.repository.CandidateProfileRepository;
import com.hireloop.backend.repository.CompanyRepository;
import com.hireloop.backend.repository.JobRepository;
import com.hireloop.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.default-admin.name:System Administrator}")
    private String adminName;

    @Value("${app.default-admin.email:admin@hireloop.com}")
    private String adminEmail;

    @Value("${app.default-admin.password:Admin@123}")
    private String adminPassword;

    public DataInitializer(UserRepository userRepository,
                           CompanyRepository companyRepository,
                           JobRepository jobRepository,
                           CandidateProfileRepository candidateProfileRepository,
                           ApplicationRepository applicationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.applicationRepository = applicationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("Starting Hireloop Data Initialization...");

        // 1. Seed Default Admin User
        seedAdminUser();

        // 2. Seed Employers & Companies (Approved + Pending)
        seedEmployersAndCompanies();

        // 3. Seed Realistic Indian & Foreign Jobs
        seedJobs();

        // 4. Seed Candidates (1 complete profile + 1 newly registered)
        User candidateJane = seedCandidates();

        // Ensure physical sample resume PDF exists on disk
        ensureSampleResumeFile();

        // 5. Seed Sample Applications across statuses
        seedApplications(candidateJane);

        log.info("Hireloop Data Initialization completed successfully!");
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .name(adminName)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();

            userRepository.save(admin);
            log.info("Admin user created: email={}", adminEmail);
        }
    }

    private void seedEmployersAndCompanies() {
        // Employer 1: Alex Vance (TechCorp India) - Approved
        User alex = getOrCreateEmployerUser("Alex Vance", "alex@techcorp.com");
        getOrCreateCompany(
                alex,
                "TechCorp India",
                "https://techcorp.in",
                "Bangalore, Karnataka, India",
                "Enterprise software solutions and next-generation cloud platforms.",
                ApprovalStatus.APPROVED
        );

        // Employer 2: Harshil Mathur (Razorpay Software) - Approved
        User harshil = getOrCreateEmployerUser("Harshil Mathur", "recruiter@razorpay.com");
        getOrCreateCompany(
                harshil,
                "Razorpay Software",
                "https://razorpay.com",
                "Bangalore, Karnataka, India",
                "Leading financial services and payment gateway provider in India.",
                ApprovalStatus.APPROVED
        );

        // Employer 3: Salil Parekh (Infosys Digital) - Approved
        User salil = getOrCreateEmployerUser("Salil Parekh", "careers@infosys.com");
        getOrCreateCompany(
                salil,
                "Infosys Digital",
                "https://infosys.com",
                "Bangalore, Karnataka, India",
                "Global leader in next-generation digital services and consulting.",
                ApprovalStatus.APPROVED
        );

        // Employer 4: Deepinder Goyal (Zomato Tech) - Approved
        User deepinder = getOrCreateEmployerUser("Deepinder Goyal", "tech-hiring@zomato.com");
        getOrCreateCompany(
                deepinder,
                "Zomato Tech",
                "https://zomato.com",
                "Gurgaon, Haryana, India",
                "Food discovery and quick commerce tech ecosystem.",
                ApprovalStatus.APPROVED
        );

        // Employer 5: Sriharsha Majety (Swiggy Labs) - Approved
        User sriharsha = getOrCreateEmployerUser("Sriharsha Majety", "jobs@swiggy.in");
        getOrCreateCompany(
                sriharsha,
                "Swiggy Labs",
                "https://swiggy.com",
                "Hyderabad, Telangana, India",
                "Empowering on-demand convenience and technology in India.",
                ApprovalStatus.APPROVED
        );

        // Employer 6: Patrick Collison (Stripe Global) - Approved
        User patrick = getOrCreateEmployerUser("Patrick Collison", "jobs@stripe.com");
        getOrCreateCompany(
                patrick,
                "Stripe Global",
                "https://stripe.com",
                "San Francisco, CA, USA",
                "Financial infrastructure platform for the global internet economy.",
                ApprovalStatus.APPROVED
        );

        // Employer 7: Vikram Oberoi (CloudNexus Technologies) - PENDING APPROVAL (0 jobs)
        User vikram = getOrCreateEmployerUser("Vikram Oberoi", "vikram@cloudnexus.in");
        getOrCreateCompany(
                vikram,
                "CloudNexus Technologies",
                "https://cloudnexus.in",
                "Pune, Maharashtra, India",
                "Cloud computing consultancy awaiting administrator verification.",
                ApprovalStatus.PENDING
        );
    }

    private void seedJobs() {
        if (jobRepository.count() > 0) {
            return;
        }

        Company techcorp = companyRepository.findByUserId(
                userRepository.findByEmail("alex@techcorp.com").map(User::getId).orElse(null)
        ).orElse(null);

        Company razorpay = companyRepository.findByUserId(
                userRepository.findByEmail("recruiter@razorpay.com").map(User::getId).orElse(null)
        ).orElse(null);

        Company infosys = companyRepository.findByUserId(
                userRepository.findByEmail("careers@infosys.com").map(User::getId).orElse(null)
        ).orElse(null);

        Company zomato = companyRepository.findByUserId(
                userRepository.findByEmail("tech-hiring@zomato.com").map(User::getId).orElse(null)
        ).orElse(null);

        Company swiggy = companyRepository.findByUserId(
                userRepository.findByEmail("jobs@swiggy.in").map(User::getId).orElse(null)
        ).orElse(null);

        Company stripe = companyRepository.findByUserId(
                userRepository.findByEmail("jobs@stripe.com").map(User::getId).orElse(null)
        ).orElse(null);

        List<Job> jobs = Arrays.asList(
                // TechCorp India Jobs
                Job.builder()
                        .company(techcorp)
                        .title("Full Stack Java Engineer")
                        .description("Looking for a versatile Full Stack Developer to build enterprise web portals with Java 17, Spring Boot, and React.js.")
                        .skills("Java 17, Spring Boot, React, MySQL, Tailwind CSS, REST APIs")
                        .location("Bangalore, Karnataka, India")
                        .jobType(JobType.FULL_TIME)
                        .salaryMin(1400000.0) // 14 LPA
                        .salaryMax(2200000.0) // 22 LPA
                        .currency("INR")
                        .deadline(LocalDate.now().plusMonths(2))
                        .status(JobStatus.ACTIVE)
                        .build(),

                Job.builder()
                        .company(techcorp)
                        .title("DevOps & Cloud Specialist")
                        .description("Manage automated CI/CD pipelines, containerized deployments, and MySQL database performance on AWS/GCP.")
                        .skills("Docker, Kubernetes, AWS, Linux, CI/CD, MySQL")
                        .location("Bangalore, Karnataka, India")
                        .jobType(JobType.FULL_TIME)
                        .salaryMin(1500000.0) // 15 LPA
                        .salaryMax(2400000.0) // 24 LPA
                        .currency("INR")
                        .deadline(LocalDate.now().plusMonths(3))
                        .status(JobStatus.ACTIVE)
                        .build(),

                // Razorpay Jobs
                Job.builder()
                        .company(razorpay)
                        .title("Senior Full Stack Java Engineer")
                        .description("Design and scale mission-critical payment APIs using Java 17, Spring Boot, React, and MySQL. You will lead architectural decisions for payments processing handling millions of daily transactions.")
                        .skills("Java 17, Spring Boot, React, MySQL, Hibernate, REST API, Microservices")
                        .location("Bangalore, Karnataka, India")
                        .jobType(JobType.FULL_TIME)
                        .salaryMin(1800000.0) // 18 LPA
                        .salaryMax(2800000.0) // 28 LPA
                        .currency("INR")
                        .deadline(LocalDate.now().plusMonths(2))
                        .status(JobStatus.ACTIVE)
                        .build(),

                Job.builder()
                        .company(razorpay)
                        .title("Lead Frontend Engineer (Remote - India)")
                        .description("Remote opportunity across India to lead customer onboarding and analytics frontends. Modern tech stack with React 18, Tailwind, and custom UI components.")
                        .skills("React, TypeScript, Tailwind CSS, REST API, State Management")
                        .location("Remote - India")
                        .jobType(JobType.REMOTE)
                        .salaryMin(2200000.0) // 22 LPA
                        .salaryMax(3200000.0) // 32 LPA
                        .currency("INR")
                        .deadline(LocalDate.now().plusMonths(3))
                        .status(JobStatus.ACTIVE)
                        .build(),

                // Infosys Jobs
                Job.builder()
                        .company(infosys)
                        .title("Java Spring Boot Developer")
                        .description("Seeking hands-on Java professionals with strong experience in Spring Boot, JPA/Hibernate, and relational databases. Responsible for enterprise application modernization and cloud migration.")
                        .skills("Java 17, Spring Boot, Spring Data JPA, MySQL, Docker, Maven")
                        .location("Bangalore, Karnataka, India")
                        .jobType(JobType.FULL_TIME)
                        .salaryMin(1200000.0) // 12 LPA
                        .salaryMax(1800000.0) // 18 LPA
                        .currency("INR")
                        .deadline(LocalDate.now().plusMonths(3))
                        .status(JobStatus.ACTIVE)
                        .build(),

                Job.builder()
                        .company(infosys)
                        .title("Software Engineer Intern (Java/Spring)")
                        .description("Exciting 6-month internship for recent graduates and final year students. Work alongside senior engineers building Spring Boot REST services and database schemas.")
                        .skills("Java, OOP, Spring Boot Basics, SQL, Data Structures")
                        .location("Pune, Maharashtra, India")
                        .jobType(JobType.INTERNSHIP)
                        .salaryMin(360000.0) // 3.6 LPA stipend
                        .salaryMax(480000.0) // 4.8 LPA stipend
                        .currency("INR")
                        .deadline(LocalDate.now().plusWeeks(6))
                        .status(JobStatus.ACTIVE)
                        .build(),

                // Zomato Jobs
                Job.builder()
                        .company(zomato)
                        .title("Backend Systems Engineer (Java)")
                        .description("Build low-latency delivery tracking and order management systems. Join a high-velocity team working on real-time systems, caching layers, and high-concurrency MySQL databases.")
                        .skills("Java, Spring Boot, MySQL, REST API, Caching, Git")
                        .location("Gurgaon, Haryana, India")
                        .jobType(JobType.FULL_TIME)
                        .salaryMin(1600000.0) // 16 LPA
                        .salaryMax(2400000.0) // 24 LPA
                        .currency("INR")
                        .deadline(LocalDate.now().plusMonths(1))
                        .status(JobStatus.ACTIVE)
                        .build(),

                // Swiggy Jobs
                Job.builder()
                        .company(swiggy)
                        .title("Frontend React Developer")
                        .description("Craft fluid, animated, high-performance web dashboards and customer portals using React.js, Tailwind CSS, Vite, and Framer Motion. Deep focus on responsive mobile-first design.")
                        .skills("React, Vite, Tailwind CSS, Framer Motion, JavaScript, Axios")
                        .location("Hyderabad, Telangana, India")
                        .jobType(JobType.FULL_TIME)
                        .salaryMin(1000000.0) // 10 LPA
                        .salaryMax(1600000.0) // 16 LPA
                        .currency("INR")
                        .deadline(LocalDate.now().plusMonths(2))
                        .status(JobStatus.ACTIVE)
                        .build(),

                // Foreign Openings (USD)
                Job.builder()
                        .company(stripe)
                        .title("Staff Infrastructure Engineer")
                        .description("Help build and operate the resilient backbone that powers billions in internet commerce. Design scalable distributed services and manage cloud deployments.")
                        .skills("Distributed Systems, Java, Cloud Infrastructure, High Availability")
                        .location("San Francisco, CA, USA")
                        .jobType(JobType.FULL_TIME)
                        .salaryMin(150000.0) // $150k
                        .salaryMax(190000.0) // $190k
                        .currency("USD")
                        .deadline(LocalDate.now().plusMonths(2))
                        .status(JobStatus.ACTIVE)
                        .build(),

                Job.builder()
                        .company(stripe)
                        .title("Full Stack Product Engineer (Remote - US)")
                        .description("Collaborate with product designers and backend engineers to build merchant-facing portals. Rich experience with React, Java, and automated testing.")
                        .skills("React, Java, REST APIs, Micro-frontends, CI/CD")
                        .location("Remote - USA")
                        .jobType(JobType.REMOTE)
                        .salaryMin(130000.0) // $130k
                        .salaryMax(165000.0) // $165k
                        .currency("USD")
                        .deadline(LocalDate.now().plusMonths(3))
                        .status(JobStatus.ACTIVE)
                        .build()
        );

        jobRepository.saveAll(jobs);
        log.info("Seeded {} Indian and International job listings!", jobs.size());
    }

    private User seedCandidates() {
        // Candidate 1: Jane Doe (Full profile, skills, education, experience, default resume)
        User jane = userRepository.findByEmail("jane@example.com").orElseGet(() -> {
            User user = User.builder()
                    .name("Jane Doe")
                    .email("jane@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.CANDIDATE)
                    .status(UserStatus.ACTIVE)
                    .build();
            return userRepository.save(user);
        });

        if (candidateProfileRepository.findByUserId(jane.getId()).isEmpty()) {
            CandidateProfile profile = CandidateProfile.builder()
                    .user(jane)
                    .phone("+91 98765 12340")
                    .location("Bangalore, Karnataka, India")
                    .headline("Senior Full Stack Java & React Engineer")
                    .skills("Java 17, Spring Boot, React, Tailwind CSS, MySQL, REST APIs, Docker, Git")
                    .education("B.Tech in Computer Science & Engineering - NIT Karnataka (2019 - 2023, CGPA: 8.9/10)")
                    .experience("2.5 years of experience at FinTech Labs developing high-throughput REST APIs and responsive React dashboards.")
                    .defaultResumePath("uploads/resumes/sample_resume_jane_doe.pdf")
                    .build();
            candidateProfileRepository.save(profile);
            log.info("Created full candidate profile for Jane Doe");
        }

        // Candidate 2: Rahul Sharma (Newly registered candidate)
        User rahul = userRepository.findByEmail("rahul.sharma@example.com").orElseGet(() -> {
            User user = User.builder()
                    .name("Rahul Sharma")
                    .email("rahul.sharma@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.CANDIDATE)
                    .status(UserStatus.ACTIVE)
                    .build();
            return userRepository.save(user);
        });

        if (candidateProfileRepository.findByUserId(rahul.getId()).isEmpty()) {
            CandidateProfile profile = CandidateProfile.builder()
                    .user(rahul)
                    .phone("+91 98111 22334")
                    .location("Mumbai, Maharashtra, India")
                    .headline("Junior Software Developer | Java & Web Enthusiast")
                    .skills("Java, OOP, Spring Boot Basics, HTML/CSS, SQL")
                    .education("B.Sc in Information Technology - Mumbai University (2021 - 2024)")
                    .experience("Fresher actively looking for entry-level Java development opportunities.")
                    .build();
            candidateProfileRepository.save(profile);
            log.info("Created candidate profile for Rahul Sharma");
        }

        return jane;
    }

    private void seedApplications(User candidate) {
        if (applicationRepository.count() > 0 || candidate == null) {
            return;
        }

        List<Job> allJobs = jobRepository.findAll();
        if (allJobs.isEmpty()) {
            return;
        }

        // 1. Application for first job -> SHORTLISTED
        Job job1 = allJobs.get(0);
        Application app1 = Application.builder()
                .job(job1)
                .candidate(candidate)
                .status(ApplicationStatus.SHORTLISTED)
                .resumePath("uploads/resumes/sample_resume_jane_doe.pdf")
                .appliedAt(LocalDateTime.now().minusDays(5))
                .build();

        // 2. Application for second job if available -> INTERVIEW
        if (allJobs.size() > 1) {
            Job job2 = allJobs.get(1);
            Application app2 = Application.builder()
                    .job(job2)
                    .candidate(candidate)
                    .status(ApplicationStatus.INTERVIEW)
                    .resumePath("uploads/resumes/sample_resume_jane_doe.pdf")
                    .appliedAt(LocalDateTime.now().minusDays(3))
                    .build();
            applicationRepository.save(app2);
        }

        // 3. Application for third job if available -> APPLIED
        if (allJobs.size() > 2) {
            Job job3 = allJobs.get(2);
            Application app3 = Application.builder()
                    .job(job3)
                    .candidate(candidate)
                    .status(ApplicationStatus.APPLIED)
                    .resumePath("uploads/resumes/sample_resume_jane_doe.pdf")
                    .appliedAt(LocalDateTime.now().minusDays(1))
                    .build();
            applicationRepository.save(app3);
        }

        // 4. Application for fourth job if available -> SELECTED
        if (allJobs.size() > 3) {
            Job job4 = allJobs.get(3);
            Application app4 = Application.builder()
                    .job(job4)
                    .candidate(candidate)
                    .status(ApplicationStatus.SELECTED)
                    .resumePath("uploads/resumes/sample_resume_jane_doe.pdf")
                    .appliedAt(LocalDateTime.now().minusDays(7))
                    .build();
            applicationRepository.save(app4);
        }

        applicationRepository.save(app1);
        log.info("Sample applications seeded across statuses (SHORTLISTED, INTERVIEW, APPLIED, SELECTED)!");
    }

    private void ensureSampleResumeFile() {
        try {
            java.nio.file.Path resumeDir = java.nio.file.Paths.get("uploads", "resumes");
            java.nio.file.Files.createDirectories(resumeDir);
            java.nio.file.Path samplePdf = resumeDir.resolve("sample_resume_jane_doe.pdf");
            if (!java.nio.file.Files.exists(samplePdf)) {
                String minimalPdf = "%PDF-1.4\n" +
                        "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n" +
                        "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n" +
                        "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n" +
                        "4 0 obj << /Length 55 >> stream\n" +
                        "BT /F1 24 Tf 100 700 Td (Jane Doe - Sample Resume) Tj ET\n" +
                        "endstream\n" +
                        "endobj\n" +
                        "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n" +
                        "xref\n" +
                        "0 6\n" +
                        "0000000000 65535 f \n" +
                        "0000000009 00000 n \n" +
                        "0000000058 00000 n \n" +
                        "0000000115 00000 n \n" +
                        "0000000234 00000 n \n" +
                        "0000000340 00000 n \n" +
                        "trailer << /Size 6 /Root 1 0 R >>\n" +
                        "startxref\n" +
                        "421\n" +
                        "%%EOF";
                java.nio.file.Files.write(samplePdf, minimalPdf.getBytes(java.nio.charset.StandardCharsets.UTF_8));
                log.info("Created physical sample resume PDF at {}", samplePdf.toAbsolutePath());
            }
        } catch (Exception e) {
            log.warn("Could not create sample resume PDF: {}", e.getMessage());
        }
    }

    private User getOrCreateEmployerUser(String name, String email) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = User.builder()
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.EMPLOYER)
                    .status(UserStatus.ACTIVE)
                    .build();
            return userRepository.save(user);
        });
    }

    private Company getOrCreateCompany(User user, String name, String website, String location, String description, ApprovalStatus approvalStatus) {
        return companyRepository.findByUserId(user.getId()).orElseGet(() -> {
            Company company = Company.builder()
                    .user(user)
                    .name(name)
                    .website(website)
                    .location(location)
                    .description(description)
                    .approvalStatus(approvalStatus)
                    .status(CompanyStatus.ACTIVE)
                    .build();
            return companyRepository.save(company);
        });
    }
}
