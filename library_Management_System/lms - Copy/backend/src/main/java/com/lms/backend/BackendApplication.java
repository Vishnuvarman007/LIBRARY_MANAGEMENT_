package com.lms.backend;

import com.lms.backend.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner run(AuthService authService) {
		return args -> {
			authService.seedAdmin();
		};
	}

	@Bean
	CommandLineRunner seedPlans(com.lms.backend.service.PlanService planService) {
		return args -> {
			try {
				com.lms.backend.model.Plan plan1 = new com.lms.backend.model.Plan();
				plan1.setName("Plan 1");
				plan1.setDurationInMonths(1);
				plan1.setPrice(new java.math.BigDecimal("99"));
				plan1.setMaxBooks(2);
				plan1.setPremiumBooks(0);
				plan1.setBorrowDueDays(10);
				plan1.setDescription("Basic Plan for 1 Month");
				planService.addPlan(plan1);
			} catch (Exception e) {
			}

			try {
				com.lms.backend.model.Plan plan2 = new com.lms.backend.model.Plan();
				plan2.setName("Plan 2");
				plan2.setDurationInMonths(3);
				plan2.setPrice(new java.math.BigDecimal("199"));
				plan2.setMaxBooks(4);
				plan2.setPremiumBooks(2);
				plan2.setBorrowDueDays(15);
				plan2.setDescription("Standard Plan for 3 Months");
				planService.addPlan(plan2);
			} catch (Exception e) {
			}

			try {
				com.lms.backend.model.Plan plan3 = new com.lms.backend.model.Plan();
				plan3.setName("Plan 3");
				plan3.setDurationInMonths(5);
				plan3.setPrice(new java.math.BigDecimal("299"));
				plan3.setMaxBooks(6);
				plan3.setPremiumBooks(3);
				plan3.setBorrowDueDays(25);
				plan3.setDescription("Premium Plan for 5 Months");
				planService.addPlan(plan3);
			} catch (Exception e) {
			}
		};
	}
}
