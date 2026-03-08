package com.msfg.mortgage.repository;

import com.msfg.mortgage.model.entity.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {

    Optional<LoanApplication> findByApplicationNumber(String applicationNumber);

    List<LoanApplication> findByStatus(String status);

    List<LoanApplication> findAllByOrderByCreatedDateDesc();
}
