package com.hireloop.backend.service;

import com.hireloop.backend.exception.BadRequestException;
import com.hireloop.backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(@Value("${file.upload-dir:uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir, "resumes").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create directory for uploaded resumes.", ex);
        }
    }

    /**
     * Stores a resume PDF file and returns its relative stored path.
     */
    public String storeResume(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file is empty.");
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        // Security check: path traversal
        if (originalFilename.contains("..")) {
            throw new BadRequestException("Filename contains invalid path sequence: " + originalFilename);
        }

        // Validate PDF extension
        if (!originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new BadRequestException("Only PDF resumes are supported. Please upload a .pdf document.");
        }

        try {
            // Generate unique filename to avoid collision
            String uniqueFilename = UUID.randomUUID().toString() + "_" + originalFilename.replaceAll("\\s+", "_");
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFilename);

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return "uploads/resumes/" + uniqueFilename;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFilename + ". Please try again!", ex);
        }
    }

    /**
     * Loads a file as a Spring Resource for download or preview
     */
    public Resource loadFileAsResource(String filePath) {
        try {
            Path file = Paths.get(filePath).toAbsolutePath().normalize();
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Resume file not found: " + filePath);
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("Resume file not found: " + filePath);
        }
    }
}
