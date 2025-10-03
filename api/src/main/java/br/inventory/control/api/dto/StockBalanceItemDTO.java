package br.inventory.control.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data @AllArgsConstructor
public class StockBalanceItemDTO {
    private String productName;
    private int quantityInStock;
    private BigDecimal totalValue;
}
