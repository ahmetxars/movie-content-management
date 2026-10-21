package com.ahmet.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter
            jwtAuthenticationFilter;


    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:4200",
                        "https://movie-content-ui.onrender.com"
                )
        );


        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );


        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type"
                )
        );


        configuration.setExposedHeaders(
                List.of(
                        "Authorization"
                )
        );


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
                "/**",
                configuration
        );


        return source;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                .csrf(
                        csrf ->
                                csrf.disable()
                )

                .cors(
                        Customizer.withDefaults()
                )

                .sessionManagement(
                        session ->
                                session.sessionCreationPolicy(
                                        SessionCreationPolicy.STATELESS
                                )
                )

                .authorizeHttpRequests(
                        auth -> auth

                                .requestMatchers(
                                        "/api/auth/**"
                                )
                                .permitAll()


                                .requestMatchers(
                                        "/api/admin/**"
                                )
                                .hasRole("ADMIN")


                                .requestMatchers(
                                        HttpMethod.GET,
                                        "/api/contents/**"
                                )
                                .permitAll()


                                .requestMatchers(
                                        HttpMethod.POST,
                                        "/api/contents/**"
                                )
                                .hasRole("ADMIN")


                                .requestMatchers(
                                        HttpMethod.PUT,
                                        "/api/contents/**"
                                )
                                .hasRole("ADMIN")


                                .requestMatchers(
                                        HttpMethod.PATCH,
                                        "/api/contents/**"
                                )
                                .hasRole("ADMIN")


                                .requestMatchers(
                                        HttpMethod.DELETE,
                                        "/api/contents/**"
                                )
                                .hasRole("ADMIN")


                                .anyRequest()
                                .authenticated()
                )


                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }
}