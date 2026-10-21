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


    private final JwtService
            jwtService;

    private final UserRepository
            userRepository;


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


        /*
         * Authorization header yoksa
         * veya Bearer token değilse
         * authentication yapmadan devam et.
         */
        if (
                authorizationHeader == null ||
                        !authorizationHeader
                                .startsWith(
                                        "Bearer "
                                )
        ) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        /*
         * "Bearer " kısmını çıkar.
         */
        String token =
                authorizationHeader
                        .substring(7);


        try {

            /*
             * Token içinden email al.
             */
            String email =
                    jwtService
                            .extractEmail(
                                    token
                            );


            /*
             * Kullanıcı daha önce
             * authenticate edilmemişse
             * authentication yap.
             */
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

                        /*
                         * Disabled kullanıcıların
                         * sisteme erişmesini engeller.
                         */
                        .filter(
                                UserEntity::isEnabled
                        )

                        .ifPresent(
                                user -> {


                                    /*
                                     * JWT gerçekten
                                     * bu kullanıcıya mı ait
                                     * ve geçerli mi?
                                     */
                                    if (
                                            jwtService
                                                    .isTokenValid(
                                                            token,
                                                            user.getEmail()
                                                    )
                                    ) {


                                        /*
                                         * Spring Security rolü:
                                         *
                                         * USER
                                         * ->
                                         * ROLE_USER
                                         *
                                         * ADMIN
                                         * ->
                                         * ROLE_ADMIN
                                         */
                                        SimpleGrantedAuthority authority =
                                                new SimpleGrantedAuthority(

                                                        "ROLE_" +
                                                                user
                                                                        .getRole()
                                                                        .name()

                                                );


                                        /*
                                         * Authentication nesnesi oluştur.
                                         */
                                        UsernamePasswordAuthenticationToken authentication =
                                                new UsernamePasswordAuthenticationToken(

                                                        user.getEmail(),

                                                        null,

                                                        List.of(
                                                                authority
                                                        )

                                                );


                                        /*
                                         * Kullanıcıyı Spring Security
                                         * context'ine ekle.
                                         */
                                        SecurityContextHolder
                                                .getContext()
                                                .setAuthentication(
                                                        authentication
                                                );
                                    }

                                }
                        );

            }

        } catch (

                JwtException |
                IllegalArgumentException ignored

        ) {

            /*
             * Token bozuksa veya süresi
             * geçmişse kullanıcı authenticate
             * edilmez.
             *
             * Request yine devam eder.
             * SecurityConfig gerekiyorsa
             * 401 / 403 döndürür.
             */

        }


        /*
         * Filter chain devam eder.
         */
        filterChain.doFilter(
                request,
                response
        );
    }
}