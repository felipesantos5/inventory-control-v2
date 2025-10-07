package br.inventory.control.api.dto;

import lombok.Data;

@Data
public class RefreshTokenRequestDTO {
    private String refreshToken;
}