package com.fretemais.driver.service.driver.controller;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fretemais.driver.service.driver.domain.Driver;
import com.fretemais.driver.service.driver.domain.VehicleType;
import com.fretemais.driver.service.driver.dto.DriverCreateRequest;
import com.fretemais.driver.service.driver.dto.DriverFilter;
import com.fretemais.driver.service.driver.dto.DriverResponse;
import com.fretemais.driver.service.driver.dto.DriverUpdateRequest;
import com.fretemais.driver.service.driver.service.DriverService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/drivers")
@RequiredArgsConstructor
@Validated
public class DriverController {

    private final DriverService driverService;

    @PostMapping
    public ResponseEntity<DriverResponse> create(@Valid @RequestBody DriverCreateRequest request) {
        Driver driver = driverService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(driver));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DriverResponse> findById(@PathVariable UUID id) {
        Driver driver = driverService.findById(id);
        return ResponseEntity.ok(toResponse(driver));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DriverResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody DriverUpdateRequest request) {
        Driver driver = driverService.update(id, request);
        return ResponseEntity.ok(toResponse(driver));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        driverService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public Page<DriverResponse> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) Set<VehicleType> vehicleTypes,
            Pageable pageable) {

        DriverFilter filter = new DriverFilter(
                name,
                city,
                state,
                vehicleTypes);

        return driverService.search(filter, pageable)
                .map(DriverController::toResponse);
    }

    private static DriverResponse toResponse(Driver driver) {
        Set<VehicleType> vehicleTypes = driver.getVehicleTypes() == null
                ? Set.of()
                : Arrays.stream(driver.getVehicleTypes())
                        .collect(Collectors.toSet());

        return new DriverResponse(
                driver.getId(),
                driver.getName(),
                driver.getEmail(),
                driver.getPhone(),
                driver.getCity(),
                driver.getState(),
                vehicleTypes,
                driver.isActive(),
                driver.getCreatedAt(),
                driver.getUpdatedAt()
        );
    }
}
