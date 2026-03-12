package com.lms.backend.repository;

import com.lms.backend.model.BorrowRecord;
import com.lms.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
        List<BorrowRecord> findByUser(User user);

        List<BorrowRecord> findByStatus(String status);

        @org.springframework.data.jpa.repository.Query("SELECT COUNT(br) FROM BorrowRecord br WHERE br.user = :user AND br.status = :status")
        long countByUserAndStatus(@org.springframework.data.repository.query.Param("user") User user,
                        @org.springframework.data.repository.query.Param("status") String status);

        @org.springframework.data.jpa.repository.Query("SELECT COUNT(br) FROM BorrowRecord br WHERE br.user = :user AND br.status = :status AND br.book.isPremium = :isPremium")
        long countPremiumBooksByUserAndStatus(@org.springframework.data.repository.query.Param("user") User user,
                        @org.springframework.data.repository.query.Param("status") String status,
                        @org.springframework.data.repository.query.Param("isPremium") boolean isPremium);
}
