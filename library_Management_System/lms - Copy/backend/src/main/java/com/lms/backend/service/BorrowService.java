package com.lms.backend.service;

import com.lms.backend.model.Book;
import com.lms.backend.model.BorrowRecord;
import com.lms.backend.model.User;
import com.lms.backend.repository.BookRepository;
import com.lms.backend.repository.BorrowRecordRepository;
import com.lms.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowService {

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    @Autowired
    private com.lms.backend.repository.MembershipRepository membershipRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public BorrowRecord issueBook(Long userId, Long bookId, Long dueDateOffsetDays) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("Book is not available");
        }

        // Check for active membership (optional - if exists, use plan limits)
        com.lms.backend.model.Membership activeMembership = membershipRepository
                .findTopByUserIdAndStatusOrderByEndDateDesc(userId, "ACTIVE")
                .orElse(null);

        if (activeMembership != null) {
            com.lms.backend.model.Plan plan = activeMembership.getPlan();

            long currentIssuedBooks = borrowRecordRepository.countByUserAndStatus(user, "ISSUED");
            if (currentIssuedBooks >= plan.getMaxBooks()) {
                throw new RuntimeException("User has reached the maximum allowed books for their plan");
            }

            if (book.isPremium()) {
                long currentPremiumBooks = borrowRecordRepository.countPremiumBooksByUserAndStatus(user, "ISSUED", true);
                if (currentPremiumBooks >= plan.getPremiumBooks()) {
                    throw new RuntimeException("User has reached the maximum allowed premium books for their plan");
                }
            }
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        BorrowRecord record = new BorrowRecord();
        record.setUser(user);
        record.setBook(book);
        record.setIssueDate(LocalDate.now());
        
        // Use plan's borrow due days if membership exists, otherwise use provided offset or default 14 days
        long offset = dueDateOffsetDays;
        if (activeMembership != null && activeMembership.getPlan() != null) {
            offset = activeMembership.getPlan().getBorrowDueDays();
        }
        
        record.setDueDate(LocalDate.now().plusDays(offset));
        record.setStatus("ISSUED");

        return borrowRecordRepository.save(record);
    }

    @Transactional
    public BorrowRecord issueBook(Long userId, Long bookId) {
        return issueBook(userId, bookId, 14L);
    }

    @Transactional
    public BorrowRecord returnBook(Long recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Borrow record not found"));

        if ("RETURNED".equals(record.getStatus())) {
            throw new RuntimeException("Book already returned");
        }

        record.setReturnDate(LocalDate.now());
        record.setStatus("RETURNED");

        if (record.getDueDate() != null && LocalDate.now().isAfter(record.getDueDate())) {
            long daysOverdue = java.time.temporal.ChronoUnit.DAYS.between(record.getDueDate(), LocalDate.now());
            record.setFineAmount((double) (daysOverdue * 10));
        } else {
            record.setFineAmount(0.0);
        }

        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return borrowRecordRepository.save(record);
    }

    @Transactional
    public BorrowRecord requestReturn(Long recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Borrow record not found"));

        if ("RETURNED".equals(record.getStatus())) {
            throw new RuntimeException("Book already returned");
        }

        record.setStatus("RETURN_REQUESTED");
        return borrowRecordRepository.save(record);
    }

    @Transactional
    public BorrowRecord requestRenew(Long recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Borrow record not found"));

        if ("RETURNED".equals(record.getStatus())) {
            throw new RuntimeException("Cannot renew a returned book");
        }

        record.setStatus("RENEW_REQUESTED");
        return borrowRecordRepository.save(record);
    }

    @Transactional
    public BorrowRecord approveReturn(Long recordId) {
        // Approving a return essentially executes the return sequence
        return returnBook(recordId);
    }

    @Transactional
    public BorrowRecord approveRenew(Long recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Borrow record not found"));

        if (!"RENEW_REQUESTED".equals(record.getStatus())) {
            throw new RuntimeException("No active renew request for this book");
        }

        // Add 5 days to the existing due date
        if (record.getDueDate() != null) {
            record.setDueDate(record.getDueDate().plusDays(5));
        } else {
            record.setDueDate(LocalDate.now().plusDays(5));
        }

        record.setStatus("ISSUED");
        return borrowRecordRepository.save(record);
    }

    @Transactional
    public BorrowRecord reserveBook(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("Book is not available for reservation");
        }

        // Check if user already has this book reserved or issued
        // For simplicity, skipping strict check, but ideally we should.

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        BorrowRecord record = new BorrowRecord();
        record.setUser(user);
        record.setBook(book);
        record.setIssueDate(LocalDate.now()); // Reservation date
        record.setDueDate(LocalDate.now().plusDays(3)); // 3 days to pick up
        record.setStatus("RESERVED");

        return borrowRecordRepository.save(record);
    }

    @Transactional
    public void cancelReservation(Long recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        if (!"RESERVED".equals(record.getStatus())) {
            throw new RuntimeException("Can only cancel reserved books");
        }

        record.setStatus("CANCELLED");

        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        borrowRecordRepository.save(record);
    }

    public List<BorrowRecord> getBorrowHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return borrowRecordRepository.findByUser(user);
    }

    public List<BorrowRecord> getAllBorrowRecords() {
        return borrowRecordRepository.findAll();
    }
}
