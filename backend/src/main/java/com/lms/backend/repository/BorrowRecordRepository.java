package com.lms.backend.repository;

import com.lms.backend.model.BorrowRecord;
import com.lms.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    List<BorrowRecord> findByUser(User user);

    List<BorrowRecord> findByStatus(String status);
}
