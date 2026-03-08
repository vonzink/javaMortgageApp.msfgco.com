package com.msfg.mortgage.model.dto;

import lombok.Data;

import java.util.List;

@Data
public class AIReviewResult {

    private String summary;
    private List<String> issues;
    private List<String> missingFields;
    private List<String> recommendedDocuments;
}
