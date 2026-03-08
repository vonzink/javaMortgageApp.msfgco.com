package com.msfg.mortgage.model.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LiabilityDTO {

    private Long id;
    private String accountNumber;

    @NotBlank
    private String creditorName;

    private String liabilityType;

    @DecimalMin("0.00")
    private BigDecimal monthlyPayment;

    private BigDecimal unpaidBalance;
    private Boolean payoffStatus;
    private Boolean toBePaidOff;
    private Long borrowerId;
}
