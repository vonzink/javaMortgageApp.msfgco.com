package com.msfg.mortgage.model.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class REOPropertyDTO {

    private Long id;
    private Integer sequenceNumber;
    private String addressLine;
    private String city;
    private String state;
    private String zipCode;
    private String propertyType;
    private BigDecimal propertyValue;
    private BigDecimal monthlyRentalIncome;
    private BigDecimal monthlyPayment;
    private BigDecimal unpaidBalance;
}
