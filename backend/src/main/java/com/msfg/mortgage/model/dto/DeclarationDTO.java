package com.msfg.mortgage.model.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DeclarationDTO {

    private Long id;

    private Boolean outstandingJudgments;
    private Boolean bankruptcy;
    private Boolean foreclosure;
    private Boolean lawsuit;
    private Boolean loanForeclosure;
    private Boolean presentlyDelinquent;
    private Boolean alimonyChildSupport;
    private Boolean borrowingDownPayment;
    private Boolean comakerEndorser;
    private Boolean usCitizen;
    private Boolean permanentResident;
    private Boolean intentToOccupy;
    private Boolean downPaymentGift;
    private Boolean ownershipInterest;
    private Boolean propertyTypeChanged;
    private Boolean priorPropertyType;
    private Boolean priorPropertyTitle;

    private String giftSource;
    private String coSignerObligation;
    private String creditExplanation;
    private String employmentGapExplanation;

    private BigDecimal giftAmount;

    private Boolean pendingCreditInquiry;
    private Boolean incomeVerificationConsent;
    private Boolean creditReportConsent;
    private Boolean propertyInsuranceRequired;
    private Boolean floodInsuranceRequired;
}
