package com.fretemais.driver.service.driver.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.fretemais.driver.service.driver.domain.Driver;
import com.fretemais.driver.service.driver.dto.DriverFilter;
import com.fretemais.driver.service.driver.repository.DriverRepository;
import com.fretemais.driver.service.driver.specification.DriverSpecification;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;

    public Page<Driver> search(DriverFilter filter, @NonNull Pageable pageable) {

        Specification<Driver> spec = Specification
                .where(DriverSpecification.isActive())
                .and(DriverSpecification.hasName(filter.name()))
                .and(DriverSpecification.hasCity(filter.city()))
                .and(DriverSpecification.hasState(filter.state()))
                .and(DriverSpecification.hasVehicleTypes(filter.vehicleTypes()));

        return driverRepository.findAll(spec, pageable);
    }

}
