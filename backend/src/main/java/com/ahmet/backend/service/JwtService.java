package com.ahmet.backend.service;

import com.ahmet.backend.entity.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

    private final String secret;

    private final long expirationMs;


    public JwtService(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration-ms:86400000}") long expirationMs
    ) {

        this.secret =
                secret;

        this.expirationMs =
                expirationMs;
    }


    public String generateToken(
            UserEntity user
    ) {

        Instant now =
                Instant.now();

        Instant expiration =
                now.plusMillis(
                        expirationMs
                );


        return Jwts.builder()
                .subject(
                        user.getEmail()
                )
                .claim(
                        "role",
                        user.getRole().name()
                )
                .issuedAt(
                        Date.from(now)
                )
                .expiration(
                        Date.from(expiration)
                )
                .signWith(
                        getSigningKey()
                )
                .compact();
    }


    public String extractEmail(
            String token
    ) {

        return extractClaims(token)
                .getSubject();
    }


    public boolean isTokenValid(
            String token,
            String email
    ) {

        try {

            Claims claims =
                    extractClaims(token);

            return (
                    claims
                            .getSubject()
                            .equalsIgnoreCase(email)
                            &&
                            claims
                                    .getExpiration()
                                    .after(new Date())
            );

        } catch (
                JwtException |
                IllegalArgumentException e
        ) {

            return false;
        }
    }


    private Claims extractClaims(
            String token
    ) {

        return Jwts.parser()
                .verifyWith(
                        getSigningKey()
                )
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    private SecretKey getSigningKey() {

        byte[] keyBytes =
                Decoders.BASE64
                        .decode(secret);

        return Keys.hmacShaKeyFor(
                keyBytes
        );
    }
}