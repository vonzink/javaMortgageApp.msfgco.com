package com.msfg.mortgage.service;

import com.msfg.mortgage.exception.ResourceNotFoundException;
import com.msfg.mortgage.model.dto.*;
import com.msfg.mortgage.model.entity.*;
import com.msfg.mortgage.repository.LoanApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class LoanApplicationService {

    private final LoanApplicationRepository loanApplicationRepository;

    public LoanApplicationService(LoanApplicationRepository loanApplicationRepository) {
        this.loanApplicationRepository = loanApplicationRepository;
    }

    @Transactional
    public LoanApplication createApplication(LoanApplicationDTO dto) {
        LoanApplication application = new LoanApplication();
        application.setLoanPurpose(dto.getLoanPurpose());
        application.setLoanType(dto.getLoanType());
        application.setLoanAmount(dto.getLoanAmount());
        application.setPropertyValue(dto.getPropertyValue());
        application.setStatus(dto.getStatus() != null ? dto.getStatus() : "DRAFT");
        application.setBorrowers(new ArrayList<>());
        application.setLiabilities(new ArrayList<>());
        application.setDocuments(new ArrayList<>());

        // Set property
        if (dto.getProperty() != null) {
            Property property = mapPropertyFromDTO(dto.getProperty());
            property.setApplication(application);
            application.setProperty(property);
        }

        // Set borrowers
        if (dto.getBorrowers() != null) {
            for (BorrowerDTO borrowerDTO : dto.getBorrowers()) {
                Borrower borrower = mapBorrowerFromDTO(borrowerDTO);
                borrower.setApplication(application);
                application.getBorrowers().add(borrower);
            }
        }

        // Set liabilities
        if (dto.getLiabilities() != null) {
            for (LiabilityDTO liabilityDTO : dto.getLiabilities()) {
                Liability liability = mapLiabilityFromDTO(liabilityDTO, application);
                application.getLiabilities().add(liability);
            }
        }

        return loanApplicationRepository.save(application);
    }

    @Transactional(readOnly = true)
    public List<LoanApplication> getAllApplications() {
        return loanApplicationRepository.findAllByOrderByCreatedDateDesc();
    }

    @Transactional(readOnly = true)
    public LoanApplication getApplicationById(Long id) {
        return loanApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LoanApplication", id));
    }

    @Transactional(readOnly = true)
    public LoanApplication getApplicationByNumber(String applicationNumber) {
        return loanApplicationRepository.findByApplicationNumber(applicationNumber)
                .orElseThrow(() -> new ResourceNotFoundException("LoanApplication", applicationNumber));
    }

    @Transactional(readOnly = true)
    public List<LoanApplication> getApplicationsByStatus(String status) {
        return loanApplicationRepository.findByStatus(status);
    }

    @Transactional
    public LoanApplication updateApplication(Long id, LoanApplicationDTO dto) {
        LoanApplication application = loanApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LoanApplication", id));

        application.setLoanPurpose(dto.getLoanPurpose());
        application.setLoanType(dto.getLoanType());
        application.setLoanAmount(dto.getLoanAmount());
        application.setPropertyValue(dto.getPropertyValue());
        if (dto.getStatus() != null) {
            application.setStatus(dto.getStatus());
        }

        // Update property
        if (dto.getProperty() != null) {
            if (application.getProperty() != null) {
                updatePropertyFromDTO(application.getProperty(), dto.getProperty());
            } else {
                Property property = mapPropertyFromDTO(dto.getProperty());
                property.setApplication(application);
                application.setProperty(property);
            }
        } else {
            application.setProperty(null);
        }

        // Update borrowers - clear and re-add
        application.getBorrowers().clear();
        if (dto.getBorrowers() != null) {
            for (BorrowerDTO borrowerDTO : dto.getBorrowers()) {
                Borrower borrower = mapBorrowerFromDTO(borrowerDTO);
                borrower.setApplication(application);
                application.getBorrowers().add(borrower);
            }
        }

        // Update liabilities - clear and re-add
        application.getLiabilities().clear();
        if (dto.getLiabilities() != null) {
            for (LiabilityDTO liabilityDTO : dto.getLiabilities()) {
                Liability liability = mapLiabilityFromDTO(liabilityDTO, application);
                application.getLiabilities().add(liability);
            }
        }

        return loanApplicationRepository.save(application);
    }

    @Transactional
    public LoanApplication updateApplicationStatus(Long id, String status) {
        LoanApplication application = loanApplicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LoanApplication", id));
        application.setStatus(status);
        return loanApplicationRepository.save(application);
    }

    @Transactional
    public void deleteApplication(Long id) {
        if (!loanApplicationRepository.existsById(id)) {
            throw new ResourceNotFoundException("LoanApplication", id);
        }
        loanApplicationRepository.deleteById(id);
    }

    // ---- Mapping helpers ----

    private Property mapPropertyFromDTO(PropertyDTO dto) {
        Property property = new Property();
        property.setAddressLine(dto.getAddressLine());
        property.setCity(dto.getCity());
        property.setState(dto.getState());
        property.setZipCode(dto.getZipCode());
        property.setCounty(dto.getCounty());
        property.setPropertyType(dto.getPropertyType());
        property.setPropertyValue(dto.getPropertyValue());
        property.setConstructionType(dto.getConstructionType());
        property.setYearBuilt(dto.getYearBuilt());
        property.setUnitsCount(dto.getUnitsCount());
        return property;
    }

    private void updatePropertyFromDTO(Property property, PropertyDTO dto) {
        property.setAddressLine(dto.getAddressLine());
        property.setCity(dto.getCity());
        property.setState(dto.getState());
        property.setZipCode(dto.getZipCode());
        property.setCounty(dto.getCounty());
        property.setPropertyType(dto.getPropertyType());
        property.setPropertyValue(dto.getPropertyValue());
        property.setConstructionType(dto.getConstructionType());
        property.setYearBuilt(dto.getYearBuilt());
        property.setUnitsCount(dto.getUnitsCount());
    }

    private Borrower mapBorrowerFromDTO(BorrowerDTO dto) {
        Borrower borrower = new Borrower();
        borrower.setSequenceNumber(dto.getSequenceNumber());
        borrower.setFirstName(dto.getFirstName());
        borrower.setLastName(dto.getLastName());
        borrower.setSsn(dto.getSsn());
        borrower.setBirthDate(dto.getBirthDate());
        borrower.setMaritalStatus(dto.getMaritalStatus());
        borrower.setEmail(dto.getEmail());
        borrower.setPhone(dto.getPhone());
        borrower.setCitizenshipType(dto.getCitizenshipType());
        borrower.setDependentsCount(dto.getDependentsCount());
        borrower.setCurrentAddressLine(dto.getCurrentAddressLine());
        borrower.setCurrentCity(dto.getCurrentCity());
        borrower.setCurrentState(dto.getCurrentState());
        borrower.setCurrentZipCode(dto.getCurrentZipCode());

        // Initialize collections
        borrower.setEmploymentHistory(new ArrayList<>());
        borrower.setIncomeSources(new ArrayList<>());
        borrower.setResidences(new ArrayList<>());
        borrower.setReoProperties(new ArrayList<>());
        borrower.setAssets(new ArrayList<>());

        // Employment history
        if (dto.getEmploymentHistory() != null) {
            for (EmploymentDTO empDTO : dto.getEmploymentHistory()) {
                Employment employment = mapEmploymentFromDTO(empDTO);
                employment.setBorrower(borrower);
                borrower.getEmploymentHistory().add(employment);
            }
        }

        // Income sources
        if (dto.getIncomeSources() != null) {
            for (IncomeSourceDTO incDTO : dto.getIncomeSources()) {
                IncomeSource incomeSource = mapIncomeSourceFromDTO(incDTO);
                incomeSource.setBorrower(borrower);
                borrower.getIncomeSources().add(incomeSource);
            }
        }

        // Residences
        if (dto.getResidences() != null) {
            for (ResidenceDTO resDTO : dto.getResidences()) {
                Residence residence = mapResidenceFromDTO(resDTO);
                residence.setBorrower(borrower);
                borrower.getResidences().add(residence);
            }
        }

        // REO Properties
        if (dto.getReoProperties() != null) {
            for (REOPropertyDTO reoDTO : dto.getReoProperties()) {
                REOProperty reoProperty = mapREOPropertyFromDTO(reoDTO);
                reoProperty.setBorrower(borrower);
                borrower.getReoProperties().add(reoProperty);
            }
        }

        // Assets
        if (dto.getAssets() != null) {
            for (AssetDTO assetDTO : dto.getAssets()) {
                Asset asset = mapAssetFromDTO(assetDTO);
                asset.setBorrower(borrower);
                borrower.getAssets().add(asset);
            }
        }

        // Declaration
        if (dto.getDeclaration() != null) {
            Declaration declaration = mapDeclarationFromDTO(dto.getDeclaration());
            declaration.setBorrower(borrower);
            borrower.setDeclaration(declaration);
        }

        return borrower;
    }

    private Employment mapEmploymentFromDTO(EmploymentDTO dto) {
        Employment employment = new Employment();
        employment.setSequenceNumber(dto.getSequenceNumber());
        employment.setEmployerName(dto.getEmployerName());
        employment.setPosition(dto.getPosition());
        employment.setEmployerPhone(dto.getEmployerPhone());
        employment.setEmployerAddress(dto.getEmployerAddress());
        employment.setEmployerCity(dto.getEmployerCity());
        employment.setEmployerState(dto.getEmployerState());
        employment.setEmployerZip(dto.getEmployerZip());
        employment.setStartDate(dto.getStartDate());
        employment.setEndDate(dto.getEndDate());
        employment.setMonthlyIncome(dto.getMonthlyIncome());
        employment.setEmploymentStatus(dto.getEmploymentStatus());
        employment.setIsPresent(dto.getIsPresent());
        employment.setSelfEmployed(dto.getSelfEmployed());
        return employment;
    }

    private IncomeSource mapIncomeSourceFromDTO(IncomeSourceDTO dto) {
        IncomeSource incomeSource = new IncomeSource();
        incomeSource.setIncomeType(dto.getIncomeType());
        incomeSource.setMonthlyAmount(dto.getMonthlyAmount());
        incomeSource.setDescription(dto.getDescription());
        return incomeSource;
    }

    private Residence mapResidenceFromDTO(ResidenceDTO dto) {
        Residence residence = new Residence();
        residence.setAddressLine(dto.getAddressLine());
        residence.setCity(dto.getCity());
        residence.setState(dto.getState());
        residence.setZipCode(dto.getZipCode());
        residence.setResidencyType(dto.getResidencyType());
        residence.setResidencyBasis(dto.getResidencyBasis());
        residence.setDurationMonths(dto.getDurationMonths());
        residence.setMonthlyRent(dto.getMonthlyRent());
        return residence;
    }

    private REOProperty mapREOPropertyFromDTO(REOPropertyDTO dto) {
        REOProperty reoProperty = new REOProperty();
        reoProperty.setSequenceNumber(dto.getSequenceNumber());
        reoProperty.setAddressLine(dto.getAddressLine());
        reoProperty.setCity(dto.getCity());
        reoProperty.setState(dto.getState());
        reoProperty.setZipCode(dto.getZipCode());
        reoProperty.setPropertyType(dto.getPropertyType());
        reoProperty.setPropertyValue(dto.getPropertyValue());
        reoProperty.setMonthlyRentalIncome(dto.getMonthlyRentalIncome());
        reoProperty.setMonthlyPayment(dto.getMonthlyPayment());
        reoProperty.setUnpaidBalance(dto.getUnpaidBalance());
        return reoProperty;
    }

    private Asset mapAssetFromDTO(AssetDTO dto) {
        Asset asset = new Asset();
        asset.setAssetType(dto.getAssetType());
        asset.setBankName(dto.getBankName());
        asset.setAccountNumber(dto.getAccountNumber());
        asset.setAssetValue(dto.getAssetValue());
        asset.setUsedForDownpayment(dto.getUsedForDownpayment());
        return asset;
    }

    private Liability mapLiabilityFromDTO(LiabilityDTO dto, LoanApplication application) {
        Liability liability = new Liability();
        liability.setApplication(application);
        liability.setAccountNumber(dto.getAccountNumber());
        liability.setCreditorName(dto.getCreditorName());
        liability.setLiabilityType(dto.getLiabilityType());
        liability.setMonthlyPayment(dto.getMonthlyPayment());
        liability.setUnpaidBalance(dto.getUnpaidBalance());
        liability.setPayoffStatus(dto.getPayoffStatus());
        liability.setToBePaidOff(dto.getToBePaidOff());
        return liability;
    }

    private Declaration mapDeclarationFromDTO(DeclarationDTO dto) {
        Declaration declaration = new Declaration();
        declaration.setOutstandingJudgments(dto.getOutstandingJudgments());
        declaration.setBankruptcy(dto.getBankruptcy());
        declaration.setForeclosure(dto.getForeclosure());
        declaration.setLawsuit(dto.getLawsuit());
        declaration.setLoanForeclosure(dto.getLoanForeclosure());
        declaration.setPresentlyDelinquent(dto.getPresentlyDelinquent());
        declaration.setAlimonyChildSupport(dto.getAlimonyChildSupport());
        declaration.setBorrowingDownPayment(dto.getBorrowingDownPayment());
        declaration.setComakerEndorser(dto.getComakerEndorser());
        declaration.setUsCitizen(dto.getUsCitizen());
        declaration.setPermanentResident(dto.getPermanentResident());
        declaration.setIntentToOccupy(dto.getIntentToOccupy());
        declaration.setDownPaymentGift(dto.getDownPaymentGift());
        declaration.setOwnershipInterest(dto.getOwnershipInterest());
        declaration.setPropertyTypeChanged(dto.getPropertyTypeChanged());
        declaration.setPriorPropertyType(dto.getPriorPropertyType());
        declaration.setPriorPropertyTitle(dto.getPriorPropertyTitle());
        declaration.setGiftSource(dto.getGiftSource());
        declaration.setCoSignerObligation(dto.getCoSignerObligation());
        declaration.setCreditExplanation(dto.getCreditExplanation());
        declaration.setEmploymentGapExplanation(dto.getEmploymentGapExplanation());
        declaration.setGiftAmount(dto.getGiftAmount());
        declaration.setPendingCreditInquiry(dto.getPendingCreditInquiry());
        declaration.setIncomeVerificationConsent(dto.getIncomeVerificationConsent());
        declaration.setCreditReportConsent(dto.getCreditReportConsent());
        declaration.setPropertyInsuranceRequired(dto.getPropertyInsuranceRequired());
        declaration.setFloodInsuranceRequired(dto.getFloodInsuranceRequired());
        return declaration;
    }
}
