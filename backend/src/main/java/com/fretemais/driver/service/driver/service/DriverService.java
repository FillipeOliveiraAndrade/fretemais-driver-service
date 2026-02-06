package com.fretemais.driver.service.driver.service;

import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.fretemais.driver.service.driver.domain.Driver;
import com.fretemais.driver.service.driver.domain.VehicleType;
import com.fretemais.driver.service.driver.dto.DriverCreateRequest;
import com.fretemais.driver.service.driver.dto.DriverFilter;
import com.fretemais.driver.service.driver.dto.DriverUpdateRequest;
import com.fretemais.driver.service.driver.exception.DriverNotFoundException;
import com.fretemais.driver.service.driver.repository.DriverRepository;
import com.fretemais.driver.service.driver.specification.DriverSpecification;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;

    public Driver create(DriverCreateRequest request) {
        Driver driver = new Driver();
        applyRequest(driver, request.name(), request.email(), request.phone(),
                request.city(), request.state(), request.vehicleTypes());

        return driverRepository.save(driver);
    }

    public Driver findById(UUID id) {
        return findActiveDriver(id);
    }

    public Driver update(UUID id, DriverUpdateRequest request) {
        Driver driver = findActiveDriver(id);
        applyRequest(driver, request.name(), request.email(), request.phone(),
                request.city(), request.state(), request.vehicleTypes());

        return driverRepository.save(driver);
    }

    public void delete(UUID id) {
        Driver driver = findActiveDriver(id);
        driver.setActive(false);
        driverRepository.save(driver);
    }

    public Page<Driver> search(DriverFilter filter, @NonNull Pageable pageable) {

        Specification<Driver> spec = Specification
                .where(DriverSpecification.isActive())
                .and(DriverSpecification.hasText(filter.text()))
                .and(DriverSpecification.hasCity(filter.city()))
                .and(DriverSpecification.hasState(filter.state()))
                .and(DriverSpecification.hasVehicleTypes(filter.vehicleTypes()));

        return driverRepository.findAll(spec, pageable);
    }

    private Driver findActiveDriver(UUID id) {
        return driverRepository.findById(id)
                .filter(Driver::isActive)
                .orElseThrow(() -> new DriverNotFoundException(id));
    }

    private void applyRequest(
            Driver driver,
            String name,
            String email,
            String phone,
            String city,
            String state,
            Set<VehicleType> vehicleTypes
    ) {
        driver.setName(name);
        driver.setEmail(email);
        driver.setPhone(phone);
        driver.setCity(city);
        driver.setState(state == null ? null : state.toUpperCase());
        driver.setVehicleTypes(vehicleTypes == null ? null : vehicleTypes.toArray(new VehicleType[0]));
    }
}
