package com.ahmet.backend.security;

import com.ahmet.backend.entity.UserEntity;
import com.ahmet.backend.repository.UserRepository;
import com.ahmet.backend.service.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final UserRepository userRepository;


    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {

        this.jwtService =
                jwtService;

        this.userRepository =
                userRepository;
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader(
                        "Authorization"
                );


        if (
                authorizationHeader == null ||
                        !authorizationHeader
                                .startsWith("Bearer ")
        ) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        String token =
                authorizationHeader
                        .substring(7);


        try {

            String email =
                    jwtService
                            .extractEmail(token);


            if (
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication()
                            == null
            ) {

                userRepository
                        .findByEmailIgnoreCase(
                                email
                        )
                        .filter(
                                UserEntity::isEnabled
                        )
                        .ifPresent(user -> {

                            if (
                                    jwtService
                                            .isTokenValid(
                                                    token,
                                                    user.getEmail()
                                            )
                            ) {

                                SimpleGrantedAuthority authority =
                                        new SimpleGrantedAuthority(
                                                "ROLE_" +
                                                        user
                                                                .getRole()
                                                                .name()
                                        );


                                UsernamePasswordAuthenticationToken authentication =
                                        new UsernamePasswordAuthenticationToken(
                                                user.getEmail(),
                                                null,
                                                List.of(
                                                        authority
                                                )
                                        );


                                SecurityContextHolder
                                        .getContext()
                                        .setAuthentication(
                                                authentication
                                        );
                            }

                        });

            }

        } catch (
                JwtException |
                IllegalArgumentException ignored
        ) {

            // Invalid token:
            // request continues unauthenticated.

        }


        filterChain.doFilter(
                request,
                response
        );
    }
}