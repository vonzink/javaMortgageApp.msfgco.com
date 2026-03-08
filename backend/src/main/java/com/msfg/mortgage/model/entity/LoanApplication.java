package com.msfg.mortgage.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Entity
@Table(name = "loan_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_number", unique = true, nullable = false)
    private String applicationNumber;

    @Column(name = "loan_purpose")
    private String loanPurpose;

    @Column(name = "loan_type")
    private String loanType;

    @Column(name = "loan_amount", precision = 15, scale = 2)
    private BigDecimal loanAmount;

    @Column(name = "property_value", precision = 15, scale = 2)
    private BigDecimal propertyValue;

    @Column(nullable = false)
    @Builder.Default
    private String status = "DRAFT";

    @Column(name = "ghl_contact_id")
    private String ghlContactId;

    @OneToOne(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Property property;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Borrower> borrowers = new ArrayList<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Liability> liabilities = new ArrayList<>();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Document> documents = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @PrePersist
    public void prePersist() {
        if (this.applicationNumber == null || this.applicationNumber.isEmpty()) {
            long timestamp = System.currentTimeMillis();
            int random = ThreadLocalRandom.current().nextInt(1000, 9999);
            this.applicationNumber = "LA-" + timestamp + random;
        }
    }
}
