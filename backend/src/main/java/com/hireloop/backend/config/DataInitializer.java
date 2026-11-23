package com.hireloop.backend.config;

import com.hireloop.backend.entity.Company;
import com.hireloop.backend.entity.Job;
import com.hireloop.backend.entity.User;
import com.hireloop.backend.enums.*;
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
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
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
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Default Admin User
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .name(adminName)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();

            userRepository.save(admin);
            log.info("Default Admin user created successfully: email={}", adminEmail);
        }

        // 2. Seed Sample Indian & Foreign Companies and Jobs if no jobs exist
        if (jobRepository.count() == 0) {
            seedSampleCompaniesAndJobs();
        }
    }

    private void seedSampleCompaniesAndJobs() {
        log.info("Seeding realistic Indian and International job listings...");

        // Seed Employer 1: Razorpay (Bangalore, India)
        User empUser1 = getOrCreateEmployerUser("Harshil Mathur", "recruiter@razorpay.com", "Razorpay Software");
        Company razorpay = getOrCreateCompany(empUser1, "Razorpay Software", "https://razorpay.com", "Bangalore, Karnataka, India", "Leading financial services and payment gateway provider in India.", ApprovalStatus.APPROVED);

        // Seed Employer 2: Infosys Digital (Bangalore, India)
        User empUser2 = getOrCreateEmployerUser("Salil Parekh", "careers@infosys.com", "Infosys Digital");
        Company infosys = getOrCreateCompany(empUser2, "Infosys Digital", "https://infosys.com", "Bangalore, Karnataka, India", "Global leader in next-generation digital services and consulting.", ApprovalStatus.APPROVED);

        // Seed Employer 3: Zomato Tech (Gurgaon, India)
        User empUser3 = getOrCreateEmployerUser("Deepinder Goyal", "tech-hiring@zomato.com", "Zomato Tech");
        Company zomato = getOrCreateCompany(empUser3, "Zomato Tech", "https://zomato.com", "Gurgaon, Haryana, India", "Food discovery and quick commerce tech ecosystem.", ApprovalStatus.APPROVED);

        // Seed Employer 4: Swiggy Labs (Hyderabad, India)
        User empUser4 = getOrCreateEmployerUser("Sriharsha Majety", "jobs@swiggy.in", "Swiggy Labs");
        Company swiggy = getOrCreateCompany(empUser4, "Swiggy Labs", "https://swiggy.com", "Hyderabad, Telangana, India", "Empowering on-demand convenience and technology in India.", ApprovalStatus.APPROVED);

        // Seed Employer 5: Stripe Global (San Francisco, USA)
        User empUser5 = getOrCreateEmployerUser("Patrick Collison", "jobs@stripe.com", "Stripe Global");
        Company stripe = getOrCreateCompany(empUser5, "Stripe Global", "https://stripe.com", "San Francisco, CA, USA", "Financial infrastructure platform for the global internet economy.", ApprovalStatus.APPROVED);

        // Indian Openings (in Indian Rupees - INR)
        List<Job> jobs = Arrays.asList(
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

                // Foreign Openings (in US Dollars - USD)
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
        log.info("Successfully seeded {} Indian and Foreign job postings!", jobs.size());
    }

    private User getOrCreateEmployerUser(String name, String email, String companyName) {
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
