package com.msfg.mortgage.model.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class EmploymentDTO {

    private Long id;
    private Integer sequenceNumber;

    @NotBlank
    private String employerName;

    private String position;
    private String employerPhone;
    private String employerAddress;
    private String employerCity;
    private String employerState;
    private String employerZip;
    private String startDate;
    private String endDate;

    @DecimalMin("0.01")
    private BigDecimal monthlyIncome;

    private String employmentStatus;
    private Boolean isPresent;
    private Boolean selfEmployed;
}
