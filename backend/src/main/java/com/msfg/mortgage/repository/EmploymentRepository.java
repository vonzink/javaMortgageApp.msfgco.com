package com.msfg.mortgage.repository;

import com.msfg.mortgage.model.entity.Employment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmploymentRepository extends JpaRepository<Employment, Long> {

    List<Employment> findByBorrowerIdOrderBySequenceNumber(Long borrowerId);
}
