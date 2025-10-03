package br.inventory.control.api.controller;

import br.inventory.control.api.dto.*;
import br.inventory.control.api.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Endpoints for generating stock reports")
@SecurityRequirement(name = "bearerAuth")
public class ReportController {

    private final ReportService reportService;

    @Operation(summary = "Get price list report", description = "Returns a list of all visible products with their prices and categories.")
    @ApiResponse(responseCode = "200", description = "Report generated successfully")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @GetMapping("/price-list")
    public ResponseEntity<List<PriceListItemDTO>> getPriceList() {
        return ResponseEntity.ok(reportService.getPriceList());
    }

    @Operation(summary = "Get stock balance report", description = "Returns the physical quantity and total financial value of each product in stock.")
    @ApiResponse(responseCode = "200", description = "Report generated successfully")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @GetMapping("/stock-balance")
    public ResponseEntity<List<StockBalanceItemDTO>> getStockBalance() {
        return ResponseEntity.ok(reportService.getStockBalance());
    }

    @Operation(summary = "Get products below minimum stock", description = "Lists all products whose quantity in stock is below the defined minimum.")
    @ApiResponse(responseCode = "200", description = "Report generated successfully")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @GetMapping("/below-min-stock")
    public ResponseEntity<List<BelowMinStockProductDTO>> getProductsBelowMinStock() {
        return ResponseEntity.ok(reportService.getProductsBelowMinStock());
    }

    @Operation(summary = "Get product count by category", description = "Returns the count of distinct products for each category.")
    @ApiResponse(responseCode = "200", description = "Report generated successfully")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @GetMapping("/product-count-by-category")
    public ResponseEntity<List<ProductCountByCategoryDTO>> getProductCountByCategory() {
        return ResponseEntity.ok(reportService.getProductCountByCategory());
    }

    @Operation(summary = "Get top movement products", description = "Identifies the product with the highest number of entry movements and the one with the highest number of exit movements.")
    @ApiResponse(responseCode = "200", description = "Report generated successfully")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @GetMapping("/top-movement-products")
    public ResponseEntity<Map<String, TopMovementProductDTO>> getTopMovementProducts() {
        TopMovementProductDTO topEntry = reportService.getTopEntryProduct();
        TopMovementProductDTO topExit = reportService.getTopExitProduct();
        return ResponseEntity.ok(Map.of("topEntryProduct", topEntry, "topExitProduct", topExit));
    }
}