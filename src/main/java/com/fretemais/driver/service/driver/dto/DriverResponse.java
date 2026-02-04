package com.fretemais.driver.service.driver.dto;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import com.fretemais.driver.service.driver.domain.VehicleType;

public record DriverResponse(
        UUID id,
        String name,
        String email,
        String phone,
        String city,
        String state,
        Set<VehicleType> vehicleTypes,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
