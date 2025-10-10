package br.inventory.control.api.repository;

import br.inventory.control.api.model.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByProductId(Long productId);

    @Query("SELECT sm.product.name, COUNT(sm) as movementCount " +
            "FROM StockMovement sm " +
            "WHERE sm.type = br.inventory.control.api.model.MovementType.ENTRY " +
            "GROUP BY sm.product.name " +
            "ORDER BY movementCount DESC")
    List<Object[]> findTopEntryProducts();

    @Query("SELECT sm.product.name, COUNT(sm) as movementCount " +
            "FROM StockMovement sm " +
            "WHERE sm.type = br.inventory.control.api.model.MovementType.EXIT " +
            "GROUP BY sm.product.name " +
            "ORDER BY movementCount DESC")
    List<Object[]> findTopExitProducts();
}