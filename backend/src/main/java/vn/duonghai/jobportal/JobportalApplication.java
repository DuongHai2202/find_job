package vn.duonghai.jobportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Diem khoi dong ung dung Job Portal (Monolithic backend - Spring Boot).
 * Kien truc phan tang: Controller -> Service -> Repository(DAO) -> Entity -> MySQL.
 */
@SpringBootApplication
@EnableAsync // cho phep gui thong bao (Observer) bat dong bo, khong nghen luong chinh
public class JobportalApplication {

	public static void main(String[] args) {
		SpringApplication.run(JobportalApplication.class, args);
	}

}
