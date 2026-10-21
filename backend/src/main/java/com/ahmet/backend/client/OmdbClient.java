package com.ahmet.backend.client;

import com.ahmet.backend.dto.OmdbMovieDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;

@Component
public class OmdbClient {

    private final RestClient restClient;

    private final String apiKey;


    public OmdbClient(
            @Value("${omdb.api.url}")
            String apiUrl,

            @Value("${omdb.api.key}")
            String apiKey,

            @Value("${omdb.connect-timeout-ms:3000}")
            long connectTimeoutMs,

            @Value("${omdb.read-timeout-ms:5000}")
            long readTimeoutMs
    ) {

        this.apiKey =
                apiKey;


        SimpleClientHttpRequestFactory requestFactory =
                new SimpleClientHttpRequestFactory();


        requestFactory.setConnectTimeout(
                Duration.ofMillis(
                        connectTimeoutMs
                )
        );


        requestFactory.setReadTimeout(
                Duration.ofMillis(
                        readTimeoutMs
                )
        );


        this.restClient =
                RestClient.builder()
                        .baseUrl(apiUrl)
                        .requestFactory(
                                requestFactory
                        )
                        .build();
    }


    @Cacheable(
            value = "omdbMovies",
            key = "#title.trim().toLowerCase(T(java.util.Locale).ROOT)"
    )

    public OmdbMovieDto getMovieByTitle(
            String title
    ) {
        System.out.println(
                "OMDB API CALLED: " + title
        );

        return restClient
                .get()
                .uri(uriBuilder ->
                        uriBuilder
                                .queryParam(
                                        "apikey",
                                        apiKey
                                )
                                .queryParam(
                                        "t",
                                        title
                                )
                                .build()
                )
                .retrieve()
                .body(
                        OmdbMovieDto.class
                );
    }
}