package com.lms.backend.controller;

import com.lms.backend.model.Admin;
import com.lms.backend.model.User;
import com.lms.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow frontend access
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public ResponseEntity<?> register(
            @RequestParam("user") String userJson,
            @RequestParam(value = "file", required = true) org.springframework.web.multipart.MultipartFile file) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            User user = mapper.readValue(userJson, User.class);

            if (file != null && !file.isEmpty()) {
                String filePath = authService.saveIdProof(file);
                user.setIdProofPath(filePath);
            }

            User registeredUser = authService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (java.io.IOException e) {
            return ResponseEntity.badRequest().body("Error processing file: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/approve/{userId}")
    public ResponseEntity<?> approveUser(@PathVariable Long userId,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            String customPassword = (body != null) ? body.get("password") : null;
            User approvedUser = authService.approveUser(userId, customPassword);
            return ResponseEntity.ok("User approved and email sent to " + approvedUser.getEmail());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        // role is unused for now as we check admin/user tables directly

        // Admin Login?
        // User asked for "admin can login with his credentials".
        // Maybe check admin table first or have a separate endpoint?
        // Let's check both or use specific logic.

        Admin admin = authService.loginAdmin(email, password); // reuse email field for username
        if (admin != null) {
            return ResponseEntity.ok(Map.of("role", "ADMIN", "id", admin.getId(), "name", admin.getName()));
        }

        User user = authService.loginUser(email, password);
        if (user != null) {
            return ResponseEntity.ok(Map.of("role", user.getRole(), "id", user.getId(), "user", user));
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            String newPassword = (String) payload.get("newPassword");
            User user = authService.updatePassword(userId, newPassword);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
