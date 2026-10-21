package com.ahmet.backend.controller;

import com.ahmet.backend.dto.AdminUserResponse;
import com.ahmet.backend.dto.UpdateUserEnabledRequest;
import com.ahmet.backend.dto.UpdateUserRoleRequest;
import com.ahmet.backend.service.AdminUserService;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(
        "/api/admin/users"
)
public class AdminUserController {

    private final AdminUserService
            adminUserService;


    public AdminUserController(
            AdminUserService adminUserService
    ) {

        this.adminUserService =
                adminUserService;
    }


    @GetMapping
    public List<AdminUserResponse>
    getAllUsers() {

        return adminUserService
                .getAllUsers();
    }


    @PatchMapping(
            "/{id}/role"
    )
    public AdminUserResponse
    updateRole(

            @PathVariable
            Long id,

            @Valid
            @RequestBody
            UpdateUserRoleRequest request,

            Authentication authentication

    ) {

        return adminUserService
                .updateRole(

                        id,

                        request.getRole(),

                        authentication.getName()
                );
    }


    @PatchMapping(
            "/{id}/enabled"
    )
    public AdminUserResponse
    updateEnabled(

            @PathVariable
            Long id,

            @Valid
            @RequestBody
            UpdateUserEnabledRequest request,

            Authentication authentication

    ) {

        return adminUserService
                .updateEnabled(

                        id,

                        request.getEnabled(),

                        authentication.getName()
                );
    }
}