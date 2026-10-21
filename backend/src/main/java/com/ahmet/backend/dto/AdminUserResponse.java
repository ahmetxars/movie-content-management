package com.ahmet.backend.dto;

import com.ahmet.backend.entity.Role;
import com.ahmet.backend.entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class AdminUserResponse {

    private Long id;

    private String email;

    private Role role;

    private boolean enabled;

    private LocalDateTime createdAt;


    public static AdminUserResponse from(
            UserEntity user
    ) {

        return AdminUserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
