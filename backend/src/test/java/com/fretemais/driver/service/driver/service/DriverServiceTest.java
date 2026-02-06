package com.fretemais.driver.service.driver.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Set;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.fretemais.driver.service.driver.domain.Driver;
import com.fretemais.driver.service.driver.domain.VehicleType;
import com.fretemais.driver.service.driver.dto.DriverCreateRequest;
import com.fretemais.driver.service.driver.dto.DriverFilter;
import com.fretemais.driver.service.driver.dto.DriverUpdateRequest;
import com.fretemais.driver.service.driver.exception.DriverNotFoundException;
import com.fretemais.driver.service.driver.repository.DriverRepository;

@ExtendWith(MockitoExtension.class)
class DriverServiceTest {

    @Mock
    private DriverRepository driverRepository;

    @InjectMocks
    private DriverService driverService;

    @Test
    void create_sets_fields_and_normalizes_state() {
        DriverCreateRequest request = new DriverCreateRequest(
                "Maria",
                "maria@fretemais.com",
                "11999999999",
                "Sao Paulo",
                "sp",
                Set.of(VehicleType.VAN, VehicleType.BAU)
        );

        when(driverRepository.save(any(Driver.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Driver created = driverService.create(request);

        assertEquals("Maria", created.getName());
        assertEquals("maria@fretemais.com", created.getEmail());
        assertEquals("11999999999", created.getPhone());
        assertEquals("Sao Paulo", created.getCity());
        assertEquals("SP", created.getState());
        assertEquals(2, created.getVehicleTypes().length);
    }

    @Test
    void update_throws_when_driver_not_found() {
        UUID id = UUID.randomUUID();
        DriverUpdateRequest request = new DriverUpdateRequest(
                "Carlos",
                "carlos@fretemais.com",
                "11888888888",
                "Campinas",
                "SP",
                Set.of(VehicleType.TRUCK)
        );

        when(driverRepository.findById(id)).thenReturn(java.util.Optional.empty());

        assertThrows(DriverNotFoundException.class, () -> driverService.update(id, request));
        verify(driverRepository, never()).save(any());
    }

    @Test
    void delete_marks_driver_as_inactive() {
        UUID id = UUID.randomUUID();
        Driver driver = new Driver();
        driver.setId(id);
        driver.setActive(true);

        when(driverRepository.findById(id)).thenReturn(java.util.Optional.of(driver));
        when(driverRepository.save(any(Driver.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        driverService.delete(id);

        ArgumentCaptor<Driver> captor = ArgumentCaptor.forClass(Driver.class);
        verify(driverRepository).save(captor.capture());
        assertEquals(false, captor.getValue().isActive());
    }

    @Test
    void search_returns_page_from_repository() {
        DriverFilter filter = new DriverFilter(
                "maria",
                "Sao Paulo",
                "SP",
                Set.of(VehicleType.VAN)
        );

        Page<Driver> expected = new PageImpl<>(java.util.List.of(new Driver()));

        when(driverRepository.findAll(
                org.mockito.ArgumentMatchers.<Specification<Driver>>any(),
                any(Pageable.class)
        ))
                .thenReturn(expected);

        Page<Driver> result = driverService.search(filter, PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
    }
}
