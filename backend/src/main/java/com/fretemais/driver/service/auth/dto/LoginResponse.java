package com.fretemais.driver.service.auth.dto;

public record LoginResponse(String token, String expiresAt) {
}
