package vn.duonghai.jobportal.bootstrap;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import vn.duonghai.jobportal.config.AppProperties;
import vn.duonghai.jobportal.entity.Application;
import vn.duonghai.jobportal.entity.Candidate;
import vn.duonghai.jobportal.entity.Category;
import vn.duonghai.jobportal.entity.CompanyFollow;
import vn.duonghai.jobportal.entity.Employer;
import vn.duonghai.jobportal.entity.JobPost;
import vn.duonghai.jobportal.entity.Notification;
import vn.duonghai.jobportal.entity.Resume;
import vn.duonghai.jobportal.entity.SavedJob;
import vn.duonghai.jobportal.entity.User;
import vn.duonghai.jobportal.enums.ApplicationStatus;
import vn.duonghai.jobportal.enums.JobLevel;
import vn.duonghai.jobportal.enums.JobStatus;
import vn.duonghai.jobportal.enums.JobType;
import vn.duonghai.jobportal.enums.NotificationType;
import vn.duonghai.jobportal.enums.Role;
import vn.duonghai.jobportal.enums.UserStatus;
import vn.duonghai.jobportal.exception.BusinessException;
import vn.duonghai.jobportal.repository.ApplicationRepository;
import vn.duonghai.jobportal.repository.CandidateRepository;
import vn.duonghai.jobportal.repository.CategoryRepository;
import vn.duonghai.jobportal.repository.CompanyFollowRepository;
import vn.duonghai.jobportal.repository.EmployerRepository;
import vn.duonghai.jobportal.repository.JobPostRepository;
import vn.duonghai.jobportal.repository.NotificationRepository;
import vn.duonghai.jobportal.repository.ResumeRepository;
import vn.duonghai.jobportal.repository.SavedJobRepository;
import vn.duonghai.jobportal.repository.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AppProperties appProperties;
    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final EmployerRepository employerRepository;
    private final CategoryRepository categoryRepository;
    private final JobPostRepository jobPostRepository;
    private final ResumeRepository resumeRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;
    private final CompanyFollowRepository companyFollowRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (!appProperties.seed() || userRepository.count() > 0) {
            return;
        }

        User admin = createUser("admin@jobportal.test", "Admin JobPortal", Role.ADMIN, UserStatus.ACTIVE);

        Candidate candidateA = createCandidate(
                "candidate@jobportal.test",
                "Nguyen Van An",
                "Backend Developer Fresher",
                "Ung vien quan tam Spring Boot, REST API va SQL."
        );
        Candidate candidateB = createCandidate(
                "candidate2@jobportal.test",
                "Tran Minh Chau",
                "Frontend Developer Intern",
                "Ung vien tap trung React, UI va responsive web."
        );

        Employer employerA = createEmployer(
                "employer@jobportal.test",
                "Nhan su FindJob",
                "FindJob Tech",
                "Nen tang cong nghe ket noi ung vien va nha tuyen dung.",
                "51-200",
                "Ha Noi"
        );
        Employer employerB = createEmployer(
                "employer2@jobportal.test",
                "Recruiter GreenSoft",
                "GreenSoft Vietnam",
                "Cong ty phat trien san pham web va giai phap doanh nghiep.",
                "201-500",
                "Da Nang"
        );

        Category engineering = createCategory("Cong nghe thong tin");
        Category marketing = createCategory("Marketing");
        Category data = createCategory("Du lieu va AI");

        Resume resumeA = createResume(candidateA, "CV Backend Developer", "Java, Spring Boot, MySQL, Docker");
        Resume resumeB = createResume(candidateB, "CV Frontend Developer", "React, JavaScript, CSS, Figma");

        JobPost jobA = createJob(
                employerA,
                engineering,
                "Java Spring Boot Developer",
                "Phat trien REST API cho he thong tuyen dung.",
                "Co nen tang Java, SQL va tu duy lam viec nhom.",
                "Ha Noi",
                JobType.FULLTIME,
                JobLevel.JUNIOR
        );
        JobPost jobB = createJob(
                employerA,
                engineering,
                "React Frontend Developer",
                "Xay dung giao dien React/Vite va toi uu trai nghiem ung vien.",
                "Nam chac React, JavaScript va responsive web.",
                "Ha Noi",
                JobType.FULLTIME,
                JobLevel.MIDDLE
        );
        createJob(
                employerB,
                marketing,
                "Marketing Executive",
                "Van hanh noi dung, quang ba thuong hieu va campaign so.",
                "Co kinh nghiem content va social media la loi the.",
                "Da Nang",
                JobType.FULLTIME,
                JobLevel.JUNIOR
        );
        createJob(
                employerB,
                data,
                "Data Analyst",
                "Tong hop du lieu, lap dashboard va rut ra insight kinh doanh.",
                "Thanh thao Excel/SQL, uu tien biet Power BI.",
                "Ho Chi Minh",
                JobType.REMOTE,
                JobLevel.MIDDLE
        );

        createSavedJob(candidateA, jobB);
        createCompanyFollow(candidateA, employerA);
        createApplication(candidateA, resumeA, jobA, ApplicationStatus.INTERVIEW);
        createApplication(candidateB, resumeB, jobB, ApplicationStatus.PENDING);
        createNotification(admin, NotificationType.SYSTEM, "Seed hoan tat", "Du lieu demo da duoc nap thanh cong.");
        createNotification(
                candidateA.getUser(),
                NotificationType.APPLICATION_STATUS,
                "Ho so da duoc cap nhat",
                "Nha tuyen dung da chuyen ho so cua ban sang trang thai phong van."
        );
    }

    private Candidate createCandidate(String email, String fullName, String headline, String summary) {
        var user = createUser(email, fullName, Role.CANDIDATE, UserStatus.ACTIVE);
        var candidate = new Candidate();
        candidate.setUser(user);
        candidate.setHeadline(headline);
        candidate.setSummary(summary);
        return candidateRepository.save(candidate);
    }

    private Employer createEmployer(
            String email,
            String fullName,
            String companyName,
            String companyDescription,
            String companySize,
            String address
    ) {
        var user = createUser(email, fullName, Role.EMPLOYER, UserStatus.ACTIVE);
        var employer = new Employer();
        employer.setUser(user);
        employer.setCompanyName(companyName);
        employer.setCompanyDescription(companyDescription);
        employer.setCompanySize(companySize);
        employer.setAddress(address);
        employer.setApproved(true);
        return employerRepository.save(employer);
    }

    private User createUser(String email, String fullName, Role role, UserStatus status) {
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException(HttpStatus.CONFLICT, "Email da ton tai: " + email);
        }

        var user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode("123456"));
        user.setFullName(fullName);
        user.setRole(role);
        user.setStatus(status);
        return userRepository.save(user);
    }

    private Category createCategory(String name) {
        var category = new Category();
        category.setName(name);
        return categoryRepository.save(category);
    }

    private Resume createResume(Candidate candidate, String title, String content) {
        var resume = new Resume();
        resume.setCandidate(candidate);
        resume.setTitle(title);
        resume.setContent(content);
        return resumeRepository.save(resume);
    }

    private JobPost createJob(
            Employer employer,
            Category category,
            String title,
            String description,
            String requirements,
            String location,
            JobType type,
            JobLevel level
    ) {
        var jobPost = new JobPost();
        jobPost.setEmployer(employer);
        jobPost.setCategory(category);
        jobPost.setTitle(title);
        jobPost.setDescription(description);
        jobPost.setRequirements(requirements);
        jobPost.setSalaryMin(BigDecimal.valueOf(12_000_000));
        jobPost.setSalaryMax(BigDecimal.valueOf(25_000_000));
        jobPost.setLocation(location);
        jobPost.setJobType(type);
        jobPost.setLevel(level);
        jobPost.setStatus(JobStatus.APPROVED);
        jobPost.setDeadline(LocalDate.now().plusDays(30));
        return jobPostRepository.save(jobPost);
    }

    private void createSavedJob(Candidate candidate, JobPost jobPost) {
        var savedJob = new SavedJob();
        savedJob.setCandidate(candidate);
        savedJob.setJobPost(jobPost);
        savedJobRepository.save(savedJob);
    }

    private void createCompanyFollow(Candidate candidate, Employer employer) {
        var companyFollow = new CompanyFollow();
        companyFollow.setCandidate(candidate);
        companyFollow.setEmployer(employer);
        companyFollowRepository.save(companyFollow);
    }

    private void createApplication(Candidate candidate, Resume resume, JobPost jobPost, ApplicationStatus status) {
        var application = new Application();
        application.setCandidate(candidate);
        application.setResume(resume);
        application.setJobPost(jobPost);
        application.setStatus(status);
        application.setCoverLetter("Em mong muon dong gop cho doi ngu ky thuat cua cong ty.");
        applicationRepository.save(application);
    }

    private void createNotification(User user, NotificationType type, String title, String content) {
        var notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setContent(content);
        notificationRepository.save(notification);
    }
}
