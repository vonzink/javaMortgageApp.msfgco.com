package com.msfg.mortgage.controller;

import com.msfg.mortgage.model.dto.AIReviewResult;
import com.msfg.mortgage.model.dto.ApiResponse;
import com.msfg.mortgage.model.dto.LoanApplicationDTO;
import com.msfg.mortgage.model.entity.LoanApplication;
import com.msfg.mortgage.service.LoanApplicationService;
import com.msfg.mortgage.service.OpenAIService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loan-applications")
public class LoanApplicationController {

    private final LoanApplicationService loanApplicationService;
    private final OpenAIService openAIService;

    public LoanApplicationController(LoanApplicationService loanApplicationService,
                                     OpenAIService openAIService) {
        this.loanApplicationService = loanApplicationService;
        this.openAIService = openAIService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LoanApplication>> create(@Valid @RequestBody LoanApplicationDTO dto) {
        LoanApplication application = loanApplicationService.createApplication(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(application, "Application created successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LoanApplication>>> getAll() {
        List<LoanApplication> applications = loanApplicationService.getAllApplications();
        return ResponseEntity.ok(ApiResponse.success(applications));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LoanApplication>> getById(@PathVariable Long id) {
        LoanApplication application = loanApplicationService.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.success(application));
    }

    @GetMapping("/number/{applicationNumber}")
    public ResponseEntity<ApiResponse<LoanApplication>> getByNumber(@PathVariable String applicationNumber) {
        LoanApplication application = loanApplicationService.getApplicationByNumber(applicationNumber);
        return ResponseEntity.ok(ApiResponse.success(application));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<LoanApplication>>> getByStatus(@PathVariable String status) {
        List<LoanApplication> applications = loanApplicationService.getApplicationsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(applications));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LoanApplication>> update(@PathVariable Long id,
                                                                @Valid @RequestBody LoanApplicationDTO dto) {
        LoanApplication application = loanApplicationService.updateApplication(id, dto);
        return ResponseEntity.ok(ApiResponse.success(application, "Application updated successfully"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<LoanApplication>> updateStatus(@PathVariable Long id,
                                                                      @RequestParam String status) {
        LoanApplication application = loanApplicationService.updateApplicationStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(application, "Status updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        loanApplicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/ai-review")
    public ResponseEntity<ApiResponse<AIReviewResult>> aiReview(@PathVariable Long id) {
        LoanApplication application = loanApplicationService.getApplicationById(id);
        AIReviewResult result = openAIService.evaluateApplication(application);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/ai-review-preview")
    public ResponseEntity<ApiResponse<AIReviewResult>> aiReviewPreview(@Valid @RequestBody LoanApplicationDTO dto) {
        AIReviewResult result = openAIService.evaluateApplicationDTO(dto);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
