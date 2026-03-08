package com.msfg.mortgage.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "employment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrower_id", nullable = false)
    private Borrower borrower;

    @Column(name = "sequence_number")
    private Integer sequenceNumber;

    @Column(name = "employer_name")
    private String employerName;

    private String position;

    @Column(name = "employer_phone")
    private String employerPhone;

    @Column(name = "employer_address")
    private String employerAddress;

    @Column(name = "employer_city")
    private String employerCity;

    @Column(name = "employer_state")
    private String employerState;

    @Column(name = "employer_zip")
    private String employerZip;

    @Column(name = "start_date")
    private String startDate;

    @Column(name = "end_date")
    private String endDate;

    @Column(name = "monthly_income", precision = 15, scale = 2)
    private BigDecimal monthlyIncome;

    @Column(name = "employment_status")
    private String employmentStatus;

    @Column(name = "is_present")
    private Boolean isPresent;

    @Column(name = "self_employed")
    private Boolean selfEmployed;
}
