package com.msfg.mortgage.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "liabilities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Liability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private LoanApplication application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrower_id")
    private Borrower borrower;

    @Column(name = "account_number")
    private String accountNumber;

    @Column(name = "creditor_name")
    private String creditorName;

    @Column(name = "liability_type")
    private String liabilityType;

    @Column(name = "monthly_payment", precision = 15, scale = 2)
    private BigDecimal monthlyPayment;

    @Column(name = "unpaid_balance", precision = 15, scale = 2)
    private BigDecimal unpaidBalance;

    @Column(name = "payoff_status")
    private Boolean payoffStatus;

    @Column(name = "to_be_paid_off")
    private Boolean toBePaidOff;
}
