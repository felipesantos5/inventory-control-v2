package br.inventory.control.api.service;

import br.inventory.control.api.dto.CategoryDTO;
import br.inventory.control.api.exception.ResourceNotFoundException;
import br.inventory.control.api.model.Category;
import br.inventory.control.api.repository.CategoryRepository;
import br.inventory.control.api.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = toEntity(categoryDTO);
        Category savedCategory = categoryRepository.save(category);
        return toDTO(savedCategory);
    }

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAllByOrderByNameAsc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return toDTO(category);
    }

    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        existingCategory.setName(categoryDTO.getName());
        existingCategory.setSize(categoryDTO.getSize());
        existingCategory.setPackaging(categoryDTO.getPackaging());

        Category updatedCategory = categoryRepository.save(existingCategory);
        return toDTO(updatedCategory);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryDTO toDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setSize(category.getSize());
        dto.setPackaging(category.getPackaging());
        dto.setProductCount(productRepository.countByCategory(category));
        return dto;
    }

    private Category toEntity(CategoryDTO dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setSize(dto.getSize());
        category.setPackaging(dto.getPackaging());
        return category;
    }
}