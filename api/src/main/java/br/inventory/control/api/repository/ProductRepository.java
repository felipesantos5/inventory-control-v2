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
    List<Product> findAllByOrderByNameAsc();
    long countByCategory(Category category);

    @Modifying
    @Query("UPDATE Product p SET p.unitPrice = p.unitPrice * (1 + :percentage / 100.0)")
    void adjustPriceByPercentage(@Param("percentage") BigDecimal percentage);
    @Query("SELECT new br.inventory.control.api.dto.ProductCountByCategoryDTO(p.category.name, COUNT(p)) FROM Product p GROUP BY p.category.name")
    List<br.inventory.control.api.dto.ProductCountByCategoryDTO> countProductsByCategory();

    @Query("SELECT new br.inventory.control.api.dto.ProductCountByCategoryDTO(p.category.name, COUNT(p)) FROM Product p WHERE p.category IN :categories GROUP BY p.category.name")
    List<br.inventory.control.api.dto.ProductCountByCategoryDTO> countProductsByCategoryFiltered(@Param("categories") Collection<Category> categories);

    List<Product> findByQuantityInStockLessThan(int minStockQuantity);
    List<Product> findByQuantityInStockLessThanAndCategoryIn(int minStockQuantity, Collection<Category> categories);
}