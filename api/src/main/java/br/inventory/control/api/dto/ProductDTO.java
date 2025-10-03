package br.inventory.control.api.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private BigDecimal unitPrice;
    private String unitOfMeasure;
    private int quantityInStock;
    private int minStockQuantity;
    private int maxStockQuantity;
    private Long categoryId;
}
