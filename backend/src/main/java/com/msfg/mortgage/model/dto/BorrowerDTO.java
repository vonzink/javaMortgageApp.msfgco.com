package com.msfg.mortgage.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class BorrowerDTO {

    private Integer sequenceNumber;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String ssn;
    private String birthDate;
    private String maritalStatus;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String phone;

    private String citizenshipType;
    private Integer dependentsCount;

    private String currentAddressLine;
    private String currentCity;
    private String currentState;
    private String currentZipCode;

    private List<EmploymentDTO> employmentHistory;
    private List<IncomeSourceDTO> incomeSources;
    private List<ResidenceDTO> residences;
    private List<REOPropertyDTO> reoProperties;
    private List<AssetDTO> assets;
    private DeclarationDTO declaration;
}
