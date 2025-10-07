package br.inventory.control.api.service;

import br.inventory.control.api.config.security.JwtService;
import br.inventory.control.api.dto.JwtResponseDTO;
import br.inventory.control.api.dto.LoginRequestDTO;
import br.inventory.control.api.dto.LoginResponseDTO;
import br.inventory.control.api.model.RefreshToken;
import br.inventory.control.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public LoginResponseDTO login(LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(request.getEmail());

        return new LoginResponseDTO(jwtToken, refreshToken.getToken());
    }
}