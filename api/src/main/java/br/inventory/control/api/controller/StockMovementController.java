package br.inventory.control.api.controller;

import br.inventory.control.api.dto.StockMovementDTO;
import br.inventory.control.api.dto.StockMovementResponseDTO;
import br.inventory.control.api.service.StockMovementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stock-movements")
@RequiredArgsConstructor
@Tag(name = "Stock Movements", description = "Endpoints for registering stock entries and exits")
@SecurityRequirement(name = "bearerAuth")
public class StockMovementController {

    private final StockMovementService stockMovementService;

    @Operation(summary = "Register a stock entry", description = "Registers an entry of a product into the stock.")
    @ApiResponse(responseCode = "201", description = "Entry registered successfully. May contain a warning about max stock.")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @PostMapping("/entry")
    public ResponseEntity<StockMovementResponseDTO> registerEntry(@RequestBody StockMovementDTO movementDTO) {
        StockMovementResponseDTO response = stockMovementService.registerEntry(movementDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Register a stock exit", description = "Registers an exit of a product from the stock.")
    @ApiResponse(responseCode = "201", description = "Exit registered successfully. May contain a warning about min stock.")
    @ApiResponse(responseCode = "400", description = "Insufficient stock")
    @ApiResponse(responseCode = "403", description = "Access denied")
    @PostMapping("/exit")
    public ResponseEntity<StockMovementResponseDTO> registerExit(@RequestBody StockMovementDTO movementDTO) {
        StockMovementResponseDTO response = stockMovementService.registerExit(movementDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}