package com.ahmet.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ActorRequest {

    @NotBlank(
            message = "Actor name is required"
    )
    @Size(
            max = 150,
            message = "Actor name must be at most 150 characters"
    )
    private String name;

    private LocalDate birthDate;

    @Size(
            max = 3000,
            message = "Biography must be at most 3000 characters"
    )
    private String biography;

    @Size(
            max = 1000,
            message = "Photo URL must be at most 1000 characters"
    )
    private String photo;
}
