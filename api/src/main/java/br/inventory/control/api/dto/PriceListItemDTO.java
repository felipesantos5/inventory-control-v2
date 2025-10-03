package br.inventory.control.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data @AllArgsConstructor
public class PriceListItemDTO {
    private String productName;
    private BigDecimal unitPrice;
    private String categoryName;
}