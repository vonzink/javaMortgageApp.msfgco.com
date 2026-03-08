package com.msfg.mortgage.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "declarations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Declaration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrower_id", nullable = false)
    private Borrower borrower;

    @Column(name = "outstanding_judgments")
    private Boolean outstandingJudgments;

    private Boolean bankruptcy;

    private Boolean foreclosure;

    private Boolean lawsuit;

    @Column(name = "loan_foreclosure")
    private Boolean loanForeclosure;

    @Column(name = "presently_delinquent")
    private Boolean presentlyDelinquent;

    @Column(name = "alimony_child_support")
    private Boolean alimonyChildSupport;

    @Column(name = "borrowing_down_payment")
    private Boolean borrowingDownPayment;

    @Column(name = "comaker_endorser")
    private Boolean comakerEndorser;

    @Column(name = "us_citizen")
    private Boolean usCitizen;

    @Column(name = "permanent_resident")
    private Boolean permanentResident;

    @Column(name = "intent_to_occupy")
    private Boolean intentToOccupy;

    @Column(name = "down_payment_gift")
    private Boolean downPaymentGift;

    @Column(name = "ownership_interest")
    private Boolean ownershipInterest;

    @Column(name = "property_type_changed")
    private Boolean propertyTypeChanged;

    @Column(name = "prior_property_type")
    private Boolean priorPropertyType;

    @Column(name = "prior_property_title")
    private Boolean priorPropertyTitle;

    @Column(name = "gift_source")
    private String giftSource;

    @Column(name = "co_signer_obligation")
    private String coSignerObligation;

    @Column(name = "credit_explanation", columnDefinition = "TEXT")
    private String creditExplanation;

    @Column(name = "employment_gap_explanation", columnDefinition = "TEXT")
    private String employmentGapExplanation;

    @Column(name = "gift_amount", precision = 15, scale = 2)
    private BigDecimal giftAmount;

    @Column(name = "pending_credit_inquiry")
    private Boolean pendingCreditInquiry;

    @Column(name = "income_verification_consent")
    private Boolean incomeVerificationConsent;

    @Column(name = "credit_report_consent")
    private Boolean creditReportConsent;

    @Column(name = "property_insurance_required")
    private Boolean propertyInsuranceRequired;

    @Column(name = "flood_insurance_required")
    private Boolean floodInsuranceRequired;
}
