package com.fretemais.driver.service.driver.dto;

public enum DriverSortBy {
    NAME("name"),
    EMAIL("email"),
    CREATED_AT("createdAt"),
    UPDATED_AT("updatedAt"),
    CITY("city"),
    STATE("state");

    private final String property;

    DriverSortBy(String property) {
        this.property = property;
    }

    public String getProperty() {
        return property;
    }
}
