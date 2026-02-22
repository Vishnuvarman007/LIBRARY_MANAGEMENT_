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
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public BorrowRecord issueBook(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("Book is not available");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        BorrowRecord record = new BorrowRecord();
        record.setUser(user);
        record.setBook(book);
        record.setIssueDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(14)); // 2 weeks loan
        record.setStatus("ISSUED");

        return borrowRecordRepository.save(record);
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

        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

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
