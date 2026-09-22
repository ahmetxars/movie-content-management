package com.ahmet.backend.client;

import com.ahmet.backend.dto.OmdbMovieDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class OmdbClient {

    private final RestClient restClient;
    private final String apiKey;

    public OmdbClient(
            @Value("${omdb.api.url}") String apiUrl,
            @Value("${omdb.api.key}") String apiKey
    ) {

        this.restClient = RestClient.builder()
                .baseUrl(apiUrl)
                .build();

        this.apiKey = apiKey;
    }

    public OmdbMovieDto getMovieByTitle(String title) {

        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("apikey", apiKey)
                        .queryParam("t", title)
                        .build())
                .retrieve()
                .body(OmdbMovieDto.class);
    }
}