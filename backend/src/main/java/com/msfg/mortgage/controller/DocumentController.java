package com.msfg.mortgage.controller;

import com.msfg.mortgage.model.dto.ApiResponse;
import com.msfg.mortgage.model.dto.DocumentDTO;
import com.msfg.mortgage.model.entity.Document;
import com.msfg.mortgage.service.DocumentService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<DocumentDTO>> upload(
            @RequestParam Long applicationId,
            @RequestParam String documentType,
            @RequestParam("file") MultipartFile file) {

        Document document = documentService.uploadDocument(applicationId, documentType, file);
        DocumentDTO dto = toDTO(document);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Document uploaded successfully"));
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<ApiResponse<List<DocumentDTO>>> getByApplication(@PathVariable Long applicationId) {
        List<Document> documents = documentService.getApplicationDocuments(applicationId);
        List<DocumentDTO> dtos = documents.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<ApiResponse<DocumentDTO>> getMetadata(@PathVariable Long documentId) {
        Document document = documentService.getDocumentById(documentId);
        return ResponseEntity.ok(ApiResponse.success(toDTO(document)));
    }

    @GetMapping("/download/{documentId}")
    public ResponseEntity<Resource> download(@PathVariable Long documentId) {
        Document document = documentService.getDocumentById(documentId);
        Resource resource = documentService.downloadDocument(documentId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + document.getFileName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long documentId) {
        documentService.deleteDocument(documentId);
        return ResponseEntity.ok(ApiResponse.success("Document deleted successfully"));
    }

    private DocumentDTO toDTO(Document document) {
        return DocumentDTO.builder()
                .id(document.getId())
                .applicationId(document.getApplication().getId())
                .documentType(document.getDocumentType())
                .fileName(document.getFileName())
                .filePath(document.getFilePath())
                .fileSize(document.getFileSize())
                .uploadedAt(document.getUploadedAt())
                .build();
    }
}
