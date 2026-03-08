package com.msfg.mortgage.repository;

import com.msfg.mortgage.model.entity.Borrower;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowerRepository extends JpaRepository<Borrower, Long> {

    List<Borrower> findByApplicationIdOrderBySequenceNumber(Long applicationId);
}
