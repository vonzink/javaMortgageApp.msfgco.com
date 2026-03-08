package com.msfg.mortgage.service;

import com.msfg.mortgage.exception.ResourceNotFoundException;
import com.msfg.mortgage.model.entity.Document;
import com.msfg.mortgage.model.entity.LoanApplication;
import com.msfg.mortgage.repository.DocumentRepository;
import com.msfg.mortgage.repository.LoanApplicationRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final LoanApplicationRepository loanApplicationRepository;
    private final Path uploadDir;

    public DocumentService(DocumentRepository documentRepository,
                           LoanApplicationRepository loanApplicationRepository) {
        this.documentRepository = documentRepository;
        this.loanApplicationRepository = loanApplicationRepository;
        this.uploadDir = Paths.get("uploads");
    }

    @Transactional
    public Document uploadDocument(Long applicationId, String documentType, MultipartFile file) {
        LoanApplication application = loanApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("LoanApplication", applicationId));

        try {
            // Create directory structure: uploads/{applicationId}/
            Path appDir = uploadDir.resolve(String.valueOf(applicationId));
            Files.createDirectories(appDir);

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID() + extension;

            // Save file
            Path filePath = appDir.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Create document record
            Document document = Document.builder()
                    .application(application)
                    .documentType(documentType)
                    .fileName(originalFilename)
                    .filePath(filePath.toString())
                    .fileSize(file.getSize())
                    .build();

            return documentRepository.save(document);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload document", e);
        }
    }

    @Transactional(readOnly = true)
    public List<Document> getApplicationDocuments(Long applicationId) {
        return documentRepository.findByApplicationId(applicationId);
    }

    @Transactional(readOnly = true)
    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document", id));
    }

    public Resource downloadDocument(Long id) {
        Document document = getDocumentById(id);

        try {
            Path filePath = Paths.get(document.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found or not readable: " + document.getFilePath());
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error reading file: " + document.getFilePath(), e);
        }
    }

    @Transactional
    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document", id));

        // Delete physical file
        try {
            Path filePath = Paths.get(document.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log but don't fail if file deletion fails
        }

        documentRepository.delete(document);
    }
}
