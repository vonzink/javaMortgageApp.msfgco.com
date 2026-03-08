package com.msfg.mortgage.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "reo_properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class REOProperty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrower_id", nullable = false)
    private Borrower borrower;

    @Column(name = "sequence_number")
    private Integer sequenceNumber;

    @Column(name = "address_line")
    private String addressLine;

    private String city;

    private String state;

    @Column(name = "zip_code")
    private String zipCode;

    @Column(name = "property_type")
    private String propertyType;

    @Column(name = "property_value", precision = 15, scale = 2)
    private BigDecimal propertyValue;

    @Column(name = "monthly_rental_income", precision = 15, scale = 2)
    private BigDecimal monthlyRentalIncome;

    @Column(name = "monthly_payment", precision = 15, scale = 2)
    private BigDecimal monthlyPayment;

    @Column(name = "unpaid_balance", precision = 15, scale = 2)
    private BigDecimal unpaidBalance;
}
