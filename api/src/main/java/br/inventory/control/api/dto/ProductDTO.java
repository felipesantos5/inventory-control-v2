package br.inventory.control.api.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

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
    private CategoryInfo category;
    private List<StockMovementResponseDTO> movements;

    @Data
    public static class CategoryInfo {
        private Long id;
        private String name;
    }

}