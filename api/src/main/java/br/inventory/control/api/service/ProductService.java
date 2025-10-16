package br.inventory.control.api.service;

import br.inventory.control.api.dto.PriceAdjustmentDTO;
import br.inventory.control.api.dto.ProductDTO;
import br.inventory.control.api.dto.StockMovementResponseDTO;
import br.inventory.control.api.exception.ResourceNotFoundException;
import br.inventory.control.api.exception.UnauthorizedOperationException;
import br.inventory.control.api.model.Category;
import br.inventory.control.api.model.Product;
import br.inventory.control.api.model.Role;
import br.inventory.control.api.model.User;
import br.inventory.control.api.repository.CategoryRepository;
import br.inventory.control.api.repository.ProductRepository;
import br.inventory.control.api.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StockMovementRepository stockMovementRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts() {
        User currentUser = userService.getAuthenticatedUser();
        List<Product> products;

        if (currentUser.getRole() == Role.ADMIN || currentUser.getAllowedCategories().isEmpty()) {
            products = productRepository.findAllByOrderByNameAsc();
        } else {
            products = productRepository.findByCategoryIn(currentUser.getAllowedCategories());
        }
        return products.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        checkPermission(product.getCategory());
        ProductDTO dto = toDTO(product);
        dto.setMovements(stockMovementRepository.findByProductId(id).stream().map(mov ->
                StockMovementResponseDTO.builder()
                        .id(mov.getId())
                        .productId(mov.getProduct().getId())
                        .productName(mov.getProduct().getName())
                        .movementDate(mov.getMovementDate())
                        .quantity(mov.getQuantity())
                        .type(mov.getType())
                        .build()
        ).collect(Collectors.toList()));
        return dto;
    }

    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDTO.getCategory().getId()));
        checkPermission(category);
        Product product = toEntity(productDTO);
        product.setCategory(category);
        Product savedProduct = productRepository.save(product);
        return toDTO(savedProduct);
    }

    @Transactional
    public void adjustAllPrices(PriceAdjustmentDTO dto) {
        productRepository.adjustPriceByPercentage(dto.getPercentage());
    }

    public void checkPermission(Category category) {
        User currentUser = userService.getAuthenticatedUser();
        if (currentUser.getRole() == Role.EMPLOYEE &&
                !currentUser.getAllowedCategories().isEmpty() &&
                !currentUser.getAllowedCategories().contains(category)) {
            throw new UnauthorizedOperationException("User not permitted to manage products in this category.");
        }
    }

    private ProductDTO toDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setUnitPrice(product.getUnitPrice());
        dto.setUnitOfMeasure(product.getUnitOfMeasure());
        dto.setQuantityInStock(product.getQuantityInStock());
        dto.setMinStockQuantity(product.getMinStockQuantity());
        dto.setMaxStockQuantity(product.getMaxStockQuantity());

        ProductDTO.CategoryInfo categoryInfo = new ProductDTO.CategoryInfo();
        categoryInfo.setId(product.getCategory().getId());
        categoryInfo.setName(product.getCategory().getName());
        dto.setCategory(categoryInfo);
        dto.setCategoryId(product.getCategory().getId());

        return dto;
    }

    private Product toEntity(ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setUnitPrice(dto.getUnitPrice());
        product.setUnitOfMeasure(dto.getUnitOfMeasure());
        product.setQuantityInStock(dto.getQuantityInStock());
        product.setMinStockQuantity(dto.getMinStockQuantity());
        product.setMaxStockQuantity(dto.getMaxStockQuantity());
        return product;
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        checkPermission(product.getCategory());

        product.setName(productDTO.getName());
        product.setUnitPrice(productDTO.getUnitPrice());
        product.setUnitOfMeasure(productDTO.getUnitOfMeasure());
        product.setQuantityInStock(productDTO.getQuantityInStock());
        product.setMinStockQuantity(productDTO.getMinStockQuantity());
        product.setMaxStockQuantity(productDTO.getMaxStockQuantity());

        if (productDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + productDTO.getCategoryId()));
            checkPermission(category);
            product.setCategory(category);
        }

        Product updatedProduct = productRepository.save(product);
        return toDTO(updatedProduct);
    }
}