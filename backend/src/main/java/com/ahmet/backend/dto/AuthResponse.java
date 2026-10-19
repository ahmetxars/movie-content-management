package com.ahmet.backend.dto;

import com.ahmet.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String token;

    private String email;

    private Role role;
}