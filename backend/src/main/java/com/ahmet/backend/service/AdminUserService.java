package com.ahmet.backend.service;

import com.ahmet.backend.dto.AdminUserResponse;
import com.ahmet.backend.entity.Role;
import com.ahmet.backend.entity.UserEntity;
import com.ahmet.backend.repository.UserRepository;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AdminUserService {

    private final UserRepository
            userRepository;


    public AdminUserService(
            UserRepository userRepository
    ) {

        this.userRepository =
                userRepository;
    }


    @Transactional(readOnly = true)
    public List<AdminUserResponse>
    getAllUsers() {

        return userRepository
                .findAll(
                        Sort.by(
                                Sort.Direction.ASC,
                                "email"
                        )
                )
                .stream()
                .map(
                        AdminUserResponse::from
                )
                .toList();
    }


    @Transactional
    public AdminUserResponse
    updateRole(
            Long id,
            Role role,
            String currentUserEmail
    ) {

        UserEntity user =
                getUser(id);


        if (
                user.getEmail()
                        .equalsIgnoreCase(
                                currentUserEmail
                        )
                        &&
                        role != Role.ADMIN
        ) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "You cannot remove your own admin role."
            );
        }


        user.setRole(role);


        return AdminUserResponse.from(
                userRepository.save(user)
        );
    }


    @Transactional
    public AdminUserResponse
    updateEnabled(
            Long id,
            boolean enabled,
            String currentUserEmail
    ) {

        UserEntity user =
                getUser(id);


        if (
                user.getEmail()
                        .equalsIgnoreCase(
                                currentUserEmail
                        )
                        &&
                        !enabled
        ) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "You cannot disable your own account."
            );
        }


        user.setEnabled(enabled);


        return AdminUserResponse.from(
                userRepository.save(user)
        );
    }


    private UserEntity
    getUser(
            Long id
    ) {

        return userRepository
                .findById(id)
                .orElseThrow(
                        () ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "User not found."
                                )
                );
    }
}