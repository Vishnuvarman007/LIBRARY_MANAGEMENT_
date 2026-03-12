package com.lms.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "admins")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = true) // Nullable for backward compatibility if any
    private String email;

    @Column(nullable = true)
    private String password;

    // Admin details can be expanded if needed
    private String name;
}
