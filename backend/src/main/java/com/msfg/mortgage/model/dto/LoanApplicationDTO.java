package com.msfg.mortgage.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class LoanApplicationDTO {

    @NotBlank
    private String loanPurpose;

    private String loanType;

    private BigDecimal loanAmount;

    private BigDecimal propertyValue;

    private String status;

    private PropertyDTO property;

    private List<BorrowerDTO> borrowers;

    private List<LiabilityDTO> liabilities;
}
