package br.inventory.control.api.dto;

import br.inventory.control.api.model.MovementType;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class StockMovementResponseDTO {
    private Long id;
    private Long productId;
    private String productName;
    private LocalDateTime movementDate;
    private int quantity;
    private MovementType type;
    private String warning;
}