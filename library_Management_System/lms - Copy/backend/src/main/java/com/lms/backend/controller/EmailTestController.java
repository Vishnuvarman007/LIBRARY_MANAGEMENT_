package com.lms.backend.controller;

import com.lms.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class EmailTestController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/email")
    public ResponseEntity<?> sendTestEmail(@RequestParam String to) {
        try {
            emailService.sendEmail(to, "Test Email from LMS", "This is a test email to verify configuration.");
            return ResponseEntity.ok("Email sent successfully to " + to);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to send email: " + e.getMessage());
        }
    }
}
