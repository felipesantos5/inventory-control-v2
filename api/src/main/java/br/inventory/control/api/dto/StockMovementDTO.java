package br.inventory.control.api.dto;

import lombok.Data;

@Data
public class StockMovementDTO {
    private Long productId;
    private int quantity;
}
