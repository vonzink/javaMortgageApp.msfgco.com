package com.msfg.mortgage.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ResidenceDTO {

    private Long id;

    @NotBlank
    private String addressLine;

    @NotBlank
    private String city;

    private String state;
    private String zipCode;
    private String residencyType;
    private String residencyBasis;

    @Min(1)
    private Integer durationMonths;

    private BigDecimal monthlyRent;
}
