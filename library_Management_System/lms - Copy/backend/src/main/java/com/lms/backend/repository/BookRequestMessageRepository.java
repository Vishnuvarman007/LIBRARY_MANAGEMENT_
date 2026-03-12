package com.lms.backend.repository;

import com.lms.backend.model.BookRequestMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRequestMessageRepository extends JpaRepository<BookRequestMessage, Long> {
    List<BookRequestMessage> findByUserId(Long userId);

    List<BookRequestMessage> findByStatus(String status);
}
