package com.ahmet.backend.service;

import com.ahmet.backend.dto.AuthResponse;
import com.ahmet.backend.dto.LoginRequest;
import com.ahmet.backend.dto.RegisterRequest;
import com.ahmet.backend.entity.Role;
import com.ahmet.backend.entity.UserEntity;
import com.ahmet.backend.exception.EmailAlreadyExistsException;
import com.ahmet.backend.exception.InvalidCredentialsException;
import com.ahmet.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;


    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {

        this.userRepository =
                userRepository;

        this.passwordEncoder =
                passwordEncoder;

        this.jwtService =
                jwtService;
    }


    public AuthResponse register(
            RegisterRequest request
    ) {

        String email =
                request
                        .getEmail()
                        .trim()
                        .toLowerCase();


        if (
                userRepository
                        .existsByEmailIgnoreCase(
                                email
                        )
        ) {

            throw new EmailAlreadyExistsException(
                    "Email is already registered."
            );
        }


        UserEntity user =
                UserEntity.builder()
                        .email(email)
                        .password(
                                passwordEncoder
                                        .encode(
                                                request.getPassword()
                                        )
                        )
                        .role(
                                Role.USER
                        )
                        .enabled(true)
                        .build();


        UserEntity savedUser =
                userRepository.save(user);


        String token =
                jwtService.generateToken(
                        savedUser
                );


        return new AuthResponse(
                token,
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }


    public AuthResponse login(
            LoginRequest request
    ) {

        String email =
                request
                        .getEmail()
                        .trim()
                        .toLowerCase();


        UserEntity user =
                userRepository
                        .findByEmailIgnoreCase(
                                email
                        )
                        .orElseThrow(() ->
                                new InvalidCredentialsException(
                                        "Invalid email or password."
                                )
                        );


        if (
                !user.isEnabled() ||
                        !passwordEncoder.matches(
                                request.getPassword(),
                                user.getPassword()
                        )
        ) {

            throw new InvalidCredentialsException(
                    "Invalid email or password."
            );
        }


        String token =
                jwtService.generateToken(
                        user
                );


        return new AuthResponse(
                token,
                user.getEmail(),
                user.getRole()
        );
    }
}