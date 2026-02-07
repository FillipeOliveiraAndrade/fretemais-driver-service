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

            List<Driver> drivers = List.of(
                    driver("João Silva", "joao.silva@fretemais.com", "11990001111", "São Paulo", "SP",
                            VehicleType.VAN, VehicleType.TRUCK),
                    driver("Maria Oliveira", "maria.oliveira@fretemais.com", "11990002222", "Campinas", "SP",
                            VehicleType.BAU),
                    driver("Carlos Souza", "carlos.souza@fretemais.com", "21990003333", "Rio de Janeiro", "RJ",
                            VehicleType.SIDER, VehicleType.BITRUCK),
                    driver("Ana Paula", "ana.paula@fretemais.com", "21990004444", "Niterói", "RJ",
                            VehicleType.VAN),
                    driver("Bruno Costa", "bruno.costa@fretemais.com", "31990005555", "Belo Horizonte", "MG",
                            VehicleType.TRUCK),
                    driver("Larissa Almeida", "larissa.almeida@fretemais.com", "31990006666", "Uberlândia", "MG",
                            VehicleType.TOCO, VehicleType.BAU),
                    driver("Rafael Lima", "rafael.lima@fretemais.com", "41990007777", "Curitiba", "PR",
                            VehicleType.SIDER),
                    driver("Fernanda Rocha", "fernanda.rocha@fretemais.com", "47990008888", "Florianópolis", "SC",
                            VehicleType.VAN, VehicleType.BAU),
                    driver("Pedro Santos", "pedro.santos@fretemais.com", "51990009999", "Porto Alegre", "RS",
                            VehicleType.TRUCK, VehicleType.BITRUCK),
                    driver("Juliana Freitas", "juliana.freitas@fretemais.com", "71990001112", "Salvador", "BA",
                            VehicleType.BAU),
                    driver("Marcos Vieira", "marcos.vieira@fretemais.com", "81990002223", "Recife", "PE",
                            VehicleType.TOCO),
                    driver("Beatriz Nunes", "beatriz.nunes@fretemais.com", "85990003334", "Fortaleza", "CE",
                            VehicleType.SIDER),
                    driver("Diego Martins", "diego.martins@fretemais.com", "62990004445", "Goiânia", "GO",
                            VehicleType.TRUCK),
                    driver("Paula Ribeiro", "paula.ribeiro@fretemais.com", "61990005556", "Brasília", "DF",
                            VehicleType.VAN, VehicleType.BAU),
                    driver("Thiago Araújo", "thiago.araujo@fretemais.com", "11990006667", "São Paulo", "SP",
                            VehicleType.SIDER, VehicleType.TRUCK),
                    driver("Claudia Souza", "claudia.souza@fretemais.com", "71990001113", "Feira de Santana", "BA",
                            VehicleType.VAN, VehicleType.TOCO),
                    driver("Gustavo Melo", "gustavo.melo@fretemais.com", "81990002224", "Recife", "PE",
                            VehicleType.BAU, VehicleType.TRUCK),
                    driver("Luciana Pires", "luciana.pires@fretemais.com", "27990008889", "Vitoria", "ES",
                            VehicleType.SIDER),
                    driver("Henrique Dias", "henrique.dias@fretemais.com", "84990009990", "Natal", "RN",
                            VehicleType.TOCO, VehicleType.BAU),
                    driver("Camila Lopes", "camila.lopes@fretemais.com", "13990007778", "Santos", "SP",
                            VehicleType.VAN)
            );

            driverRepository.saveAll(drivers);
        };
    }

    private Driver driver(
            String name,
            String email,
            String phone,
            String city,
            String state,
            VehicleType... vehicleTypes
    ) {
        Driver driver = new Driver();
        driver.setName(name);
        driver.setEmail(email);
        driver.setPhone(phone);
        driver.setCity(city);
        driver.setState(state);
        driver.setVehicleTypes(vehicleTypes);
        return driver;
    }
}
