package com.lms.backend.controller;

import com.lms.backend.model.BorrowRecord;
import com.lms.backend.service.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrow")
@CrossOrigin(origins = "*")
public class BorrowController {

    @Autowired
    private BorrowService borrowService;

    @PostMapping("/issue")
    public ResponseEntity<?> issueBook(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long bookId = request.get("bookId");
            return ResponseEntity.ok(borrowService.issueBook(userId, bookId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/return/{id}")
    public ResponseEntity<?> returnBook(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(borrowService.returnBook(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reserve")
    public ResponseEntity<?> reserveBook(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long bookId = request.get("bookId");
            return ResponseEntity.ok(borrowService.reserveBook(userId, bookId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cancel/{id}")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        try {
            borrowService.cancelReservation(id);
            return ResponseEntity.ok("Reservation cancelled");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public List<BorrowRecord> getUserHistory(@PathVariable Long userId) {
        return borrowService.getBorrowHistory(userId);
    }

    @GetMapping("/all")
    public List<BorrowRecord> getAllRecords() {
        return borrowService.getAllBorrowRecords();
    }
}
