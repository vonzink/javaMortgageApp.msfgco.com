package com.msfg.mortgage.service;

import com.msfg.mortgage.model.dto.AIReviewResult;
import com.msfg.mortgage.model.dto.LoanApplicationDTO;
import com.msfg.mortgage.model.entity.LoanApplication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class OpenAIService {

    public AIReviewResult evaluateApplication(LoanApplication application) {
        AIReviewResult result = new AIReviewResult();
        result.setSummary("Application review is currently unavailable. This feature will be enabled in a future update.");
        result.setIssues(new ArrayList<>());
        result.setMissingFields(new ArrayList<>());
        result.setRecommendedDocuments(new ArrayList<>());
        return result;
    }

    public AIReviewResult evaluateApplicationDTO(LoanApplicationDTO dto) {
        AIReviewResult result = new AIReviewResult();
        result.setSummary("Application review is currently unavailable. This feature will be enabled in a future update.");
        result.setIssues(new ArrayList<>());
        result.setMissingFields(new ArrayList<>());
        result.setRecommendedDocuments(new ArrayList<>());
        return result;
    }
}
