package com.fretemais.driver.service.driver.dto;

import java.util.Set;

import com.fretemais.driver.service.driver.domain.VehicleType;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record DriverCreateRequest(
        @NotBlank String name,
        @Email @Size(max = 255) String email,
        @Size(max = 50) String phone,
        @NotBlank String city,
        @NotBlank @Size(min = 2, max = 2) String state,
        @NotEmpty Set<VehicleType> vehicleTypes
) {
}
