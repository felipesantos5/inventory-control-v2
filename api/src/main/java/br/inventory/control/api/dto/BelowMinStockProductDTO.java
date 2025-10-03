package br.inventory.control.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class BelowMinStockProductDTO {
    private String productName;
    private int quantityInStock;
    private int minStockQuantity;
}