package br.inventory.control.api.controller;

import br.inventory.control.api.dto.PriceAdjustmentDTO;
import br.inventory.control.api.dto.ProductDTO;
import br.inventory.control.api.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Endpoints for managing products")
@SecurityRequirement(name = "bearerAuth")
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "Create a new product", description = "Creates a new product. EMPLOYEEs are restricted to their assigned categories.")
    @ApiResponse(responseCode = "201", description = "Product created successfully")
    @ApiResponse(responseCode = "400", description = "Validation error")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        return new ResponseEntity<>(productService.createProduct(productDTO), HttpStatus.CREATED);
    }

    @Operation(summary = "Get product by ID", description = "Fetches a single product by its ID. EMPLOYEEs are restricted to their assigned categories.")
    @ApiResponse(responseCode = "200", description = "Product found")
    @ApiResponse(responseCode = "404", description = "Product not found")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @Operation(summary = "List all products", description = "Lists all products. EMPLOYEEs will only see products from their assigned categories.")
    @ApiResponse(responseCode = "200", description = "Products listed successfully")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @Operation(summary = "Adjust all product prices", description = "Adjusts the price of all products by a given percentage. Access restricted to ADMIN.")
    @ApiResponse(responseCode = "200", description = "Prices adjusted successfully")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @PostMapping("/adjust-price")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> adjustPrice(@RequestBody PriceAdjustmentDTO priceAdjustmentDTO) {
        productService.adjustAllPrices(priceAdjustmentDTO);
        return ResponseEntity.ok("Product prices adjusted successfully by " + priceAdjustmentDTO.getPercentage() + "%.");
    }
}