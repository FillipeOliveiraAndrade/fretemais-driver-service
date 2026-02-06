package com.fretemais.driver.service.driver.seed;

import java.util.List;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fretemais.driver.service.driver.domain.Driver;
import com.fretemais.driver.service.driver.domain.VehicleType;
import com.fretemais.driver.service.driver.repository.DriverRepository;

@Configuration
public class DriverSeed {

    @Bean
    ApplicationRunner loadDrivers(DriverRepository driverRepository) {
        return args -> {

            if (driverRepository.count() > 0) {
                return;
            }

            Driver d1 = new Driver();
            d1.setName("João Silva");
            d1.setCity("São Paulo");
            d1.setState("SP");
            d1.setVehicleTypes(new VehicleType[]{VehicleType.VAN, VehicleType.TRUCK});

            Driver d2 = new Driver();
            d2.setName("Maria Oliveira");
            d2.setCity("Campinas");
            d2.setState("SP");
            d2.setVehicleTypes(new VehicleType[]{VehicleType.BAU});

            Driver d3 = new Driver();
            d3.setName("Carlos Souza");
            d3.setCity("Rio de Janeiro");
            d3.setState("RJ");
            d3.setVehicleTypes(new VehicleType[]{VehicleType.SIDER, VehicleType.BITRUCK});

            driverRepository.saveAll(List.of(d1, d2, d3));
        };
    }
}
