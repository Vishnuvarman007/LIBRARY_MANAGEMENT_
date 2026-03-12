package com.lms.backend.repository;

import com.lms.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByEmailOrRegistrationId(String email, String registrationId);

    boolean existsByEmail(String email);
}
