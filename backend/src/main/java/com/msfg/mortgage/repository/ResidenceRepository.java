package com.msfg.mortgage.repository;

import com.msfg.mortgage.model.entity.Residence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResidenceRepository extends JpaRepository<Residence, Long> {

    List<Residence> findByBorrowerId(Long borrowerId);
}
