package com.ahmet.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserEnabledRequest {

    @NotNull(
            message = "Enabled value is required"
    )
    private Boolean enabled;
}
