package com.fretemais.driver.service.driver.specification;

import java.util.Set;
import java.util.stream.Stream;

import org.springframework.data.jpa.domain.Specification;

import com.fretemais.driver.service.driver.domain.Driver;
import com.fretemais.driver.service.driver.domain.VehicleType;

public class DriverSpecification {

    private DriverSpecification() {
    }

    public static Specification<Driver> isActive() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("isActive"));
    }

    public static Specification<Driver> hasText(String text) {
        if (text == null || text.isBlank()) {
            return null;
        }

        String like = "%" + text.toLowerCase() + "%";

        return (root, query, criteriaBuilder) -> criteriaBuilder.or(
                criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        like),
                criteriaBuilder.like(
                        criteriaBuilder.lower(
                                criteriaBuilder.coalesce(root.get("email"), "")),
                        like),
                criteriaBuilder.like(
                        criteriaBuilder.lower(
                                criteriaBuilder.coalesce(root.get("phone"), "")),
                        like)
        );
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

        String[] types = vehicleTypes.stream()
                .flatMap(DriverSpecification::mapVehicleType)
                .toArray(String[]::new);

        if (types.length == 0) {
            return null;
        }

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.isTrue(
                        criteriaBuilder.function(
                                "array_overlap",
                                Boolean.class,
                                root.get("vehicleTypes"),
                                criteriaBuilder.literal(types)
                        )
                );
    }

    private static Stream<String> mapVehicleType(VehicleType type) {
        if (type == null) {
            return Stream.empty();
        }

        return Stream.of(type.name());
    }
}
