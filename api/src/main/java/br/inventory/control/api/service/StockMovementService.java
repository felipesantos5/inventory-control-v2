package br.inventory.control.api.service;

import br.inventory.control.api.dto.StockMovementDTO;
import br.inventory.control.api.dto.StockMovementResponseDTO;
import br.inventory.control.api.exception.InsufficientStockException;
import br.inventory.control.api.exception.ResourceNotFoundException;
import br.inventory.control.api.model.MovementType;
import br.inventory.control.api.model.Product;
import br.inventory.control.api.model.StockMovement;
import br.inventory.control.api.repository.ProductRepository;
import br.inventory.control.api.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final ProductRepository productRepository;
    private final ProductService productService; // Para reutilizar a lógica de permissão

    @Transactional
    public StockMovementResponseDTO registerEntry(StockMovementDTO movementDTO) {
        Product product = findAndCheckProductPermission(movementDTO.getProductId());

        product.setQuantityInStock(product.getQuantityInStock() + movementDTO.getQuantity());

        String warning = null;
        if (product.getQuantityInStock() > product.getMaxStockQuantity()) {
            warning = "Warning: Stock quantity is now above the maximum defined level.";
        }

        productRepository.save(product);
        StockMovement movement = saveMovement(product, movementDTO.getQuantity(), MovementType.ENTRY);

        return toResponseDTO(movement, warning);
    }

    @Transactional
    public StockMovementResponseDTO registerExit(StockMovementDTO movementDTO) {
        Product product = findAndCheckProductPermission(movementDTO.getProductId());

        if (product.getQuantityInStock() < movementDTO.getQuantity()) {
            throw new InsufficientStockException("Insufficient stock for product: " + product.getName());
        }

        product.setQuantityInStock(product.getQuantityInStock() - movementDTO.getQuantity());

        String warning = null;
        if (product.getQuantityInStock() < product.getMinStockQuantity()) {
            warning = "Warning: Stock quantity is now below the minimum defined level.";
        }

        productRepository.save(product);
        StockMovement movement = saveMovement(product, movementDTO.getQuantity(), MovementType.EXIT);

        return toResponseDTO(movement, warning);
    }

    private Product findAndCheckProductPermission(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        productService.checkPermission(product.getCategory());
        return product;
    }

    private StockMovement saveMovement(Product product, int quantity, MovementType type) {
        StockMovement movement = new StockMovement();
        movement.setProduct(product);
        movement.setQuantity(quantity);
        movement.setType(type);
        movement.setMovementDate(LocalDateTime.now());
        return stockMovementRepository.save(movement);
    }

    private StockMovementResponseDTO toResponseDTO(StockMovement movement, String warning) {
        return StockMovementResponseDTO.builder()
                .id(movement.getId())
                .productId(movement.getProduct().getId())
                .productName(movement.getProduct().getName())
                .movementDate(movement.getMovementDate())
                .quantity(movement.getQuantity())
                .type(movement.getType())
                .warning(warning)
                .build();
    }
}