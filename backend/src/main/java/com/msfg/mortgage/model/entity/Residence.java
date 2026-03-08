package com.msfg.mortgage.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "residences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Residence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrower_id", nullable = false)
    private Borrower borrower;

    @Column(name = "address_line")
    private String addressLine;

    private String city;

    private String state;

    @Column(name = "zip_code")
    private String zipCode;

    @Column(name = "residency_type")
    private String residencyType;

    @Column(name = "residency_basis")
    private String residencyBasis;

    @Column(name = "duration_months")
    private Integer durationMonths;

    @Column(name = "monthly_rent", precision = 15, scale = 2)
    private BigDecimal monthlyRent;
}
