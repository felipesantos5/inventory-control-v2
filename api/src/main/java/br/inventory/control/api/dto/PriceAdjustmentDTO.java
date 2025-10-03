package br.inventory.control.api.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PriceAdjustmentDTO {
    private BigDecimal percentage;
}