package com.msfg.mortgage.repository;

import com.msfg.mortgage.model.entity.Declaration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeclarationRepository extends JpaRepository<Declaration, Long> {

    Optional<Declaration> findByBorrowerId(Long borrowerId);
}
