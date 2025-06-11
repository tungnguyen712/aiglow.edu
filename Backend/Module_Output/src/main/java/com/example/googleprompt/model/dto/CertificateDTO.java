package com.example.googleprompt.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CertificateDTO {
    private String name;
    private String issuer;
    private LocalDate issueDate;
    private String credentialId;
    private String category;
    private String url;
    private String fileUrl;
}
