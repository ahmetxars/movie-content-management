package com.ahmet.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateContentRequest {

    @NotBlank(
            message = "Title is required"
    )
    private String title;


    @Min(
            value = 1888,
            message = "Year must be 1888 or later"
    )
    @Max(
            value = 2100,
            message = "Year must be 2100 or earlier"
    )
    private Integer year;


    private String genre;


    @DecimalMin(
            value = "0.0",
            message = "Rating must be at least 0"
    )
    @DecimalMax(
            value = "10.0",
            message = "Rating must be at most 10"
    )
    private Double rating;


    private String plot;

    private String poster;

    private String director;


    @NotNull(
            message = "Version is required"
    )
    private Long version;

}