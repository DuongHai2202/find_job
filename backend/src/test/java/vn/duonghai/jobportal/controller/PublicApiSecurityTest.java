//package vn.duonghai.jobportal.controller;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mockito;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.context.annotation.Import;
//import org.springframework.data.domain.PageImpl;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//import vn.duonghai.jobportal.config.AppProperties;
//import vn.duonghai.jobportal.config.SecurityConfig;
//import vn.duonghai.jobportal.dto.request.LoginRequest;
//import vn.duonghai.jobportal.dto.response.AuthResponse;
//import vn.duonghai.jobportal.dto.response.CategoryResponse;
//import vn.duonghai.jobportal.dto.response.EmployerProfileResponse;
//import vn.duonghai.jobportal.dto.response.JobPostResponse;
//import vn.duonghai.jobportal.dto.response.PageResponse;
//import vn.duonghai.jobportal.enums.Role;
//import vn.duonghai.jobportal.enums.UserStatus;
//import vn.duonghai.jobportal.security.CustomUserDetailsService;
//import vn.duonghai.jobportal.security.JwtAuthenticationFilter;
//import vn.duonghai.jobportal.security.JwtTokenProvider;
//import vn.duonghai.jobportal.service.AuthService;
//import vn.duonghai.jobportal.service.CategoryService;
//import vn.duonghai.jobportal.service.EmployerService;
//import vn.duonghai.jobportal.service.JobRecommendationService;
//import vn.duonghai.jobportal.service.JobService;
//
//import java.util.List;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@WebMvcTest(controllers = {AuthController.class, CategoryController.class, EmployerController.class, JobController.class})
//@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
//class PublicApiSecurityTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private JobService jobService;
//
//    @MockBean
//    private JobRecommendationService jobRecommendationService;
//
//    @MockBean
//    private CategoryService categoryService;
//
//    @MockBean
//    private EmployerService employerService;
//
//    @MockBean
//    private AuthService authService;
//
//    @MockBean
//    private JwtTokenProvider jwtTokenProvider;
//
//    @MockBean
//    private CustomUserDetailsService customUserDetailsService;
//
//    @MockBean
//    private AppProperties appProperties;
//
//    @BeforeEach
//    void setUp() {
//        AppProperties.Cors cors = Mockito.mock(AppProperties.Cors.class);
//        Mockito.when(cors.allowedOrigins()).thenReturn(List.of("http://localhost:5173"));
//        Mockito.when(appProperties.cors()).thenReturn(cors);
//
//        AppProperties.Google google = Mockito.mock(AppProperties.Google.class);
//        Mockito.when(google.clientId()).thenReturn("test-google-client-id");
//        Mockito.when(appProperties.google()).thenReturn(google);
//        Mockito.when(jwtTokenProvider.isValid(any())).thenReturn(false);
//
//        var page = new PageImpl<JobPostResponse>(List.of(), PageRequest.of(0, 10), 0);
//        Mockito.when(jobService.getPublicJobs(any(), any(), any(), any(), any(), eq(0), eq(10)))
//                .thenReturn(PageResponse.from(page));
//        Mockito.when(categoryService.getAllCategories())
//                .thenReturn(List.of(new CategoryResponse(1L, "Cong nghe thong tin", null, null, null, null)));
//        Mockito.when(employerService.getCompanyProfile(1L))
//                .thenReturn(new EmployerProfileResponse(
//                        1L,
//                        "employer@jobportal.test",
//                        "Nhan su FindJob",
//                        null,
//                        UserStatus.ACTIVE,
//                        true,
//                        "FindJob Tech",
//                        "Cong ty cong nghe",
//                        null,
//                        null,
//                        "findjob.test",
//                        "51-200",
//                        "Ha Noi"
//                ));
//        Mockito.when(authService.login(any(LoginRequest.class)))
//                .thenReturn(new AuthResponse(
//                        "jwt-token",
//                        3600000L,
//                        new AuthResponse.UserInfo(1L, "candidate@jobportal.test", "Candidate Demo", Role.CANDIDATE, UserStatus.ACTIVE)
//                ));
//    }
//
//    @Test
//    void publicJobsShouldBeAccessibleWithoutJwt() throws Exception {
//        mockMvc.perform(get("/api/v1/jobs"))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    void categoriesShouldBeAccessibleWithoutJwt() throws Exception {
//        mockMvc.perform(get("/api/v1/categories"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$[0].name").value("Cong nghe thong tin"));
//    }
//
//    @Test
//    void companyProfileShouldBeAccessibleWithoutJwt() throws Exception {
//        mockMvc.perform(get("/api/v1/employers/1"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.companyName").value("FindJob Tech"));
//    }
//
//    @Test
//    void employerPrivateProfileShouldRequireJwt() throws Exception {
//        mockMvc.perform(get("/api/v1/employers/me"))
//                .andExpect(status().isUnauthorized());
//    }
//
//    @Test
//    void adminCategoryCreateShouldRequireJwt() throws Exception {
//        mockMvc.perform(post("/api/v1/categories")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content("""
//                                {"name":"Data"}
//                                """))
//                .andExpect(status().isUnauthorized());
//    }
//
//    @Test
//    void loginShouldRemainPublic() throws Exception {
//        mockMvc.perform(post("/api/v1/auth/login")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content("""
//                                {"email":"candidate@jobportal.test","password":"123456"}
//                                """))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.token").value("jwt-token"));
//    }
//}
