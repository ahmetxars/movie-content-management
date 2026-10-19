package com.ahmet.backend.controller;

import com.ahmet.backend.dto.AuthResponse;
import com.ahmet.backend.dto.LoginRequest;
import com.ahmet.backend.dto.RegisterRequest;
import com.ahmet.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;


    public AuthController(
            AuthService authService
    ) {

        this.authService =
                authService;
    }


    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(
            @Valid
            @RequestBody
            RegisterRequest request
    ) {

        return authService
                .register(request);
    }


    @PostMapping("/login")
    public AuthResponse login(
            @Valid
            @RequestBody
            LoginRequest request
    ) {

        return authService
                .login(request);
    }
}