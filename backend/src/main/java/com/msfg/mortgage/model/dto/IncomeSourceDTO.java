package com.msfg.mortgage.model.dto;

import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class IncomeSourceDTO {

    private Long id;
    private String incomeType;

    @DecimalMin("0.01")
    private BigDecimal monthlyAmount;

    private String description;
}
