package br.inventory.control.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class TopMovementProductDTO {
    private String productName;
    private long movementCount;
}
