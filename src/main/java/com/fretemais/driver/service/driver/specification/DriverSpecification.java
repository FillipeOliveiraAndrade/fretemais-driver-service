package com.fretemais.driver.service.driver.specification;

import java.util.Set;

import org.springframework.data.jpa.domain.Specification;

import com.fretemais.driver.service.driver.domain.Driver;
import com.fretemais.driver.service.driver.domain.VehicleType;

public class DriverSpecification {

    private DriverSpecification() {
    }

    public static Specification<Driver> isActive() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("isActive"));
    }

    public static Specification<Driver> hasName(String name) {
        if (name == null || name.isBlank()) {
            return null;
        }

        return (root, query, criteriaBuilder) -> criteriaBuilder.like(
                criteriaBuilder.lower(root.get("name")),
                "%" + name.toLowerCase() + "%");
    }

    public static Specification<Driver> hasCity(String city) {
        if (city == null || city.isBlank()) {
            return null;
        }

        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(
                criteriaBuilder.lower(root.get("city")),
                city.toLowerCase());
    }

    public static Specification<Driver> hasState(String state) {
        if (state == null || state.isBlank()) {
            return null;
        }

        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(
                root.get("state"),
                state.toUpperCase());
    }

    public static Specification<Driver> hasVehicleTypes(Set<VehicleType> vehicleTypes) {
        if (vehicleTypes == null || vehicleTypes.isEmpty()) {
            return null;
        }

        return (root, query, criteriaBuilder) -> root.get("vehicleTypes").in(vehicleTypes);
    }

}
