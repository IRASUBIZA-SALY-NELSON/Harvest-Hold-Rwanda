package rw.harvesthold.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HarvestHoldApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(HarvestHoldApiApplication.class, args);
	}

}
