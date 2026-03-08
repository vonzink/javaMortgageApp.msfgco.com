package com.msfg.mortgage.service;

import com.msfg.mortgage.model.entity.LoanApplication;
import org.springframework.stereotype.Service;

@Service
public class GoHighLevelService {

    public String createContact(LoanApplication application) {
        return "STUB-CONTACT-ID";
    }

    public String updateContactStatus(String contactId, String status) {
        // No-op stub
        return "ok";
    }
}
