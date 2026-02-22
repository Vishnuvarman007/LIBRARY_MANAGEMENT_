package com.lms.backend.repository;

import com.lms.backend.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByUsername(String username);

    Optional<Admin> findByUsernameOrEmail(String username, String email);

    boolean existsByUsername(String username);
}
