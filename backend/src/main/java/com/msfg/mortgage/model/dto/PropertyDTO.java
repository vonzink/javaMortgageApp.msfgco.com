package com.msfg.mortgage.model.dto;

import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PropertyDTO {

    private String addressLine;
    private String city;
    private String state;
    private String zipCode;
    private String county;
    private String propertyType;

    @DecimalMin("0.0")
    private BigDecimal propertyValue;

    private String constructionType;
    private String yearBuilt;
    private Integer unitsCount;
}
