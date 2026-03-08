package com.msfg.mortgage.repository;

import com.msfg.mortgage.model.entity.Liability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LiabilityRepository extends JpaRepository<Liability, Long> {

    List<Liability> findByApplicationId(Long applicationId);
}
