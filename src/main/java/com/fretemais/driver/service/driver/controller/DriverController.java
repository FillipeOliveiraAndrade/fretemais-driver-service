package com.fretemais.driver.service.driver.controller;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fretemais.driver.service.driver.domain.Driver;
import com.fretemais.driver.service.driver.domain.VehicleType;
import com.fretemais.driver.service.driver.dto.DriverFilter;
import com.fretemais.driver.service.driver.service.DriverService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    @GetMapping
    public Page<Driver> search(
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

        return driverService.search(filter, pageable);
    }
}
