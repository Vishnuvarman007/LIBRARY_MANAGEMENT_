package com.lms.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;
    
    private String genre;

    @Column(unique = true, nullable = false)
    private String isbn;

    private int totalCopies;
    private int availableCopies;
    
    // Could add cover image URL, description, etc.
}
