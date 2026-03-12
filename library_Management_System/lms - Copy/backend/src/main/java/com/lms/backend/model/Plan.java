package com.lms.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Data
@Table(name = "plans")
public class Plan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // e.g., "1 Month", "2 Months", "3 Months"

    @Column(nullable = false)
    private int durationInMonths;

    @Column(nullable = false)
    private BigDecimal price;

    private String description;

    @Column(nullable = false, columnDefinition = "integer default 2")
    private int maxBooks;

    @Column(nullable = false, columnDefinition = "integer default 0")
    private int premiumBooks;

    @Column(nullable = false, columnDefinition = "integer default 14")
    private int borrowDueDays;
}
