package br.inventory.control.api.repository;

import br.inventory.control.api.model.Category;
import br.inventory.control.api.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryIn(Collection<Category> categories);

    @Modifying
    @Query("UPDATE Product p SET p.unitPrice = p.unitPrice * (1 + :percentage / 100.0)")
    void adjustPriceByPercentage(@Param("percentage") BigDecimal percentage);

    List<Product> findByQuantityInStockLessThan(int minStockQuantity);
    List<Product> findByQuantityInStockLessThanAndCategoryIn(int minStockQuantity, Collection<Category> categories);
}