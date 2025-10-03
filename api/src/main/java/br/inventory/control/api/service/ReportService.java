package br.inventory.control.api.service;

import br.inventory.control.api.dto.*;
import br.inventory.control.api.model.Product;
import br.inventory.control.api.model.Role;
import br.inventory.control.api.model.User;
import br.inventory.control.api.repository.ProductRepository;
import br.inventory.control.api.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;
    private final UserService userService;

    public List<PriceListItemDTO> getPriceList() {
        return getVisibleProducts().stream()
                .map(p -> new PriceListItemDTO(p.getName(), p.getUnitPrice(), p.getCategory().getName()))
                .collect(Collectors.toList());
    }

    public List<StockBalanceItemDTO> getStockBalance() {
        return getVisibleProducts().stream()
                .map(p -> {
                    BigDecimal totalValue = p.getUnitPrice().multiply(new BigDecimal(p.getQuantityInStock()));
                    return new StockBalanceItemDTO(p.getName(), p.getQuantityInStock(), totalValue);
                })
                .collect(Collectors.toList());
    }

    public List<BelowMinStockProductDTO> getProductsBelowMinStock() {
        User currentUser = userService.getAuthenticatedUser();
        List<Product> products;

        // This query requires a custom method in the repository
        if (currentUser.getRole() == Role.ADMIN || currentUser.getAllowedCategories().isEmpty()) {
            products = productRepository.findByQuantityInStockLessThan(Integer.MAX_VALUE); // Simplified for example
        } else {
            products = productRepository.findByQuantityInStockLessThanAndCategoryIn(Integer.MAX_VALUE, currentUser.getAllowedCategories());
        }

        return products.stream()
                .filter(p -> p.getQuantityInStock() < p.getMinStockQuantity())
                .map(p -> new BelowMinStockProductDTO(p.getName(), p.getQuantityInStock(), p.getMinStockQuantity()))
                .collect(Collectors.toList());
    }

    public List<ProductCountByCategoryDTO> getProductCountByCategory() {
        User currentUser = userService.getAuthenticatedUser();
        if (currentUser.getRole() == Role.ADMIN || currentUser.getAllowedCategories().isEmpty()) {
            return productRepository.countProductsByCategory();
        } else {
            return productRepository.countProductsByCategoryFiltered(currentUser.getAllowedCategories());
        }
    }

    public TopMovementProductDTO getTopEntryProduct() {
        return stockMovementRepository.findTopEntryProducts().stream()
                .findFirst()
                .map(result -> new TopMovementProductDTO((String) result[0], (Long) result[1]))
                .orElse(null);
    }

    public TopMovementProductDTO getTopExitProduct() {
        return stockMovementRepository.findTopExitProducts().stream()
                .findFirst()
                .map(result -> new TopMovementProductDTO((String) result[0], (Long) result[1]))
                .orElse(null);
    }

    private List<Product> getVisibleProducts() {
        User currentUser = userService.getAuthenticatedUser();
        if (currentUser.getRole() == Role.ADMIN || currentUser.getAllowedCategories().isEmpty()) {
            return productRepository.findAll();
        } else {
            return productRepository.findByCategoryIn(currentUser.getAllowedCategories());
        }
    }
}