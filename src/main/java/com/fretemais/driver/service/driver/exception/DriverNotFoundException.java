package com.fretemais.driver.service.driver.exception;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class DriverNotFoundException extends RuntimeException {

    public DriverNotFoundException(UUID id) {
        super("Motorista não encontrado: " + id);
    }
}
