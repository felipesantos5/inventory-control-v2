package br.inventory.control.api.service;

import br.inventory.control.api.dto.CategoryDTO;
import br.inventory.control.api.dto.UserDTO;
import br.inventory.control.api.exception.ResourceNotFoundException;
import br.inventory.control.api.model.Category;
import br.inventory.control.api.model.Role;
import br.inventory.control.api.model.User;
import br.inventory.control.api.repository.CategoryRepository;
import br.inventory.control.api.repository.RefreshTokenRepository;
import br.inventory.control.api.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;

    public UserDTO createUser(UserDTO userDTO) {
        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole(Role.EMPLOYEE);

        if (userDTO.getCategoryIds() != null && !userDTO.getCategoryIds().isEmpty()) {
            Set<Category> categories = new HashSet<>(categoryRepository.findAllById(userDTO.getCategoryIds()));
            user.setAllowedCategories(categories);
        }

        User savedUser = userRepository.save(user);
        return toDTO(savedUser);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        refreshTokenRepository.deleteByUser(user);
        userRepository.deleteById(id);
    }

    @Transactional
    public Set<CategoryDTO> getMyCategories() {
        User user = getAuthenticatedUser();
        return user.getAllowedCategories().stream()
                .map(category -> {
                    CategoryDTO dto = new CategoryDTO();
                    dto.setId(category.getId());
                    dto.setName(category.getName());
                    dto.setSize(category.getSize());
                    dto.setPackaging(category.getPackaging());
                    return dto;
                })
                .collect(Collectors.toSet());
    }

    public User getAuthenticatedUser() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        if (user.getAllowedCategories() != null) {
            dto.setCategoryIds(user.getAllowedCategories().stream().map(Category::getId).collect(Collectors.toSet()));
        }
        return dto;
    }
}