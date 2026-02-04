package com.fretemais.driver.service.driver.dto;

import java.util.Set;

import com.fretemais.driver.service.driver.domain.VehicleType;

public record DriverFilter(
        String name,
        String city,
        String state,
        Set<VehicleType> vehicleTypes
) {
}
