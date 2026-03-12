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

    private String publisher;

    @Column(name = "cover_image")
    private String coverImage;

    @Column(name = "is_premium", columnDefinition = "boolean default false")
    private boolean isPremium;
}
