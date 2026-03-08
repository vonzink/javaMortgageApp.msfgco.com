package com.msfg.mortgage.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "borrowers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Borrower {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private LoanApplication application;

    @Column(name = "sequence_number")
    private Integer sequenceNumber;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private String ssn;

    @Column(name = "birth_date")
    private String birthDate;

    @Column(name = "marital_status")
    private String maritalStatus;

    private String email;

    private String phone;

    @Column(name = "citizenship_type")
    private String citizenshipType;

    @Column(name = "dependents_count")
    private Integer dependentsCount;

    @Column(name = "current_address_line")
    private String currentAddressLine;

    @Column(name = "current_city")
    private String currentCity;

    @Column(name = "current_state")
    private String currentState;

    @Column(name = "current_zip_code")
    private String currentZipCode;

    @OneToMany(mappedBy = "borrower", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Employment> employmentHistory = new ArrayList<>();

    @OneToMany(mappedBy = "borrower", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<IncomeSource> incomeSources = new ArrayList<>();

    @OneToMany(mappedBy = "borrower", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Residence> residences = new ArrayList<>();

    @OneToMany(mappedBy = "borrower", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<REOProperty> reoProperties = new ArrayList<>();

    @OneToMany(mappedBy = "borrower", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Asset> assets = new ArrayList<>();

    @OneToOne(mappedBy = "borrower", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Declaration declaration;
}
