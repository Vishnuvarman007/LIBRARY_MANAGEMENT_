package com.lms.backend.model;

import jakarta.persistence.*;
import lombok.Data;
//import java.util.List;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Core Auth
    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = true) // Password generated after approval
    private String password;

    @Column(nullable = false)
    private String role; // "MEMBER", "LIBRARIAN", "ADMIN"

    private String status; // "PENDING", "APPROVED", "REJECTED"

    @Column(unique = true, nullable = true) // Optional for now, but good to be unique if provided
    private String registrationId; // Manual Registration No / ID

    @Column(columnDefinition = "boolean default false")
    private boolean passwordUpdateRequired;

    // Personal Details
    private String firstName;
    private String lastName;
    private String phone;
    private String gender;
    private String maritalStatus;

    // Address
    private String street;
    private String city;
    private String state;
    private String pincode;

    // Librarian Specific
    private String employeeId;
    private Integer yearsOfExperience;
    private String specialization;
    private String idProofPath;

    // Government ID
    private String govtIdType;
    private String govtIdNumber;

    // Complex types stored as JSON strings for simplicity in this phase
    // Alternatively, could be explicit OneToMany relations, but stringified JSON is
    // easier for "store all details" requirement without complex mapping initially.
    // However, user asked for "detailed register details". Let's use
    // @ElementCollection or just JSON strings.
    // Given the constraints and the nature of "academic info", JSON/Text is
    // simplest.

    @Column(columnDefinition = "TEXT")
    private String academicInfoJson; // Stores usage of Institution, Degree, Passing Year, Grade, Percentage

    @Column(columnDefinition = "TEXT")
    private String workExperienceJson; // Stores usage of Company, Designation, CTC, Dates
}
