package com.lms.backend.service;

import com.lms.backend.model.Admin;
import com.lms.backend.model.User;
import com.lms.backend.repository.AdminRepository;
import com.lms.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private EmailService emailService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
        StringBuilder sb = new StringBuilder();
        java.util.Random random = new java.util.Random();
        for (int i = 0; i < 10; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        user.setStatus("PENDING");
        user.setPassword("PENDING");
        return userRepository.save(user);
    }

    public User approveUser(Long userId, String customPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("APPROVED".equals(user.getStatus())) {
            throw new RuntimeException("User already approved");
        }

        String rawPassword = (customPassword != null && !customPassword.trim().isEmpty())
                ? customPassword
                : generateRandomPassword();

        user.setPassword(rawPassword); // In real app, hash this!
        user.setStatus("APPROVED");
        user.setPasswordUpdateRequired(true);

        User savedUser = userRepository.save(user);

        // Send Email
        String subject = "Registration Approved - Welcome to Librario";
        String body = "Dear " + user.getFirstName() + ",\n\n" +
                "Thank you for registering with Librario!\n" +
                "We are pleased to inform you that your account has been approved.\n\n" +
                "Here are your login credentials:\n" +
                "Email: " + user.getEmail() + "\n" +
                "Temporary Password: " + rawPassword + "\n\n" +
                "Please login and change your password immediately upon your first sign-in.\n\n" +
                "Best Regards,\n" +
                "The Librario Team";

        try {
            System.out.println("Attempting to send approval email to: " + user.getEmail());
            emailService.sendEmail(user.getEmail(), subject, body);
            System.out.println("Approval email sent successfully.");
        } catch (Exception e) {
            System.err.println("Failed to send approval email to " + user.getEmail());
            e.printStackTrace();
            // We don't rethrow to avoid rolling back the user approval, but we log the
            // error.
        }

        return savedUser;
    }

    public User updatePassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(newPassword); // In real app, hash this!
        user.setPasswordUpdateRequired(false);
        return userRepository.save(user);
    }

    public User loginUser(String identifier, String password) {
        // identifier can be email or registrationId
        Optional<User> userOpt = userRepository.findByEmailOrRegistrationId(identifier, identifier);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (!"APPROVED".equals(user.getStatus())) {
                throw new RuntimeException("Account is " + (user.getStatus() == null ? "PENDING" : user.getStatus())
                        + ". Please wait for admin approval.");
            }
            // Simple password check (plaintext as per current setup)
            if (password.equals(user.getPassword())) {
                return user;
            }
        }
        return null; // Invalid credentials
    }

    public Admin loginAdmin(String identifier, String password) {
        // Admin login logic (using explicit Admin table)
        // identifier can be username or email
        Optional<Admin> adminOpt = adminRepository.findByUsernameOrEmail(identifier, identifier);
        if (adminOpt.isPresent() && adminOpt.get().getPassword().equals(password)) {
            return adminOpt.get();
        }

        // Allow fallback for initial seed/testing if needed, or strictly use DB.
        // For now, let's stick to DB.
        return null;
    }

    public void seedAdmin() {
        // Ensure admin account exists and has the correct password
        Admin admin = adminRepository.findByUsername("admin").orElse(new Admin());
        admin.setUsername("admin");
        admin.setEmail("saaiedarshan@gmail.com");
        admin.setPassword("Admin~123");
        admin.setName("System Admin");
        adminRepository.save(admin);
    }

    public String saveIdProof(org.springframework.web.multipart.MultipartFile file) throws java.io.IOException {
        String idProofDir = uploadDir + "/id_proofs/";
        java.io.File directory = new java.io.File(idProofDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String filePath = idProofDir + fileName;
        file.transferTo(new java.io.File(filePath));
        return "uploads/id_proofs/" + fileName;
    }
}
