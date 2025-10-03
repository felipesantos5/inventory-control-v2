package br.inventory.control.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data @AllArgsConstructor
public class ProductCountByCategoryDTO {
    private String categoryName;
    private long productCount;
}