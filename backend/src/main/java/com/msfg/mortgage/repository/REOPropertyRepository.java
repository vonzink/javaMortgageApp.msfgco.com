package com.msfg.mortgage.repository;

import com.msfg.mortgage.model.entity.REOProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface REOPropertyRepository extends JpaRepository<REOProperty, Long> {

    List<REOProperty> findByBorrowerIdOrderBySequenceNumber(Long borrowerId);
}
