package br.inventory.control.api.dto;

import lombok.Data;

@Data
public class CategoryDTO {
    private Long id;
    private String name;
    private String size;
    private String packaging;
}
