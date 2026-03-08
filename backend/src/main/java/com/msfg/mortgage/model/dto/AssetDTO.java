package com.msfg.mortgage.model.dto;

import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AssetDTO {

    private Long id;
    private String assetType;
    private String bankName;
    private String accountNumber;

    @DecimalMin("0.00")
    private BigDecimal assetValue;

    private Boolean usedForDownpayment;
}
