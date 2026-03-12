package com.lms.backend.controller;

import com.lms.backend.model.BookRequestMessage;
import com.lms.backend.service.BookRequestMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class BookRequestMessageController {

    @Autowired
    private BookRequestMessageService messageService;

    @PostMapping("/request")
    public ResponseEntity<?> createRequest(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            Long bookId = Long.valueOf(payload.get("bookId").toString());
            String message = (String) payload.get("message");
            return ResponseEntity.ok(messageService.createRequest(userId, bookId, message));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/respond/{id}")
    public ResponseEntity<?> respondToRequest(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            String status = (String) payload.get("status");
            String responseMessage = (String) payload.get("responseMessage");
            Long adminId = Long.valueOf(payload.get("adminId").toString());
            Long dueDateOffset = payload.containsKey("dueDateOffset")
                    ? Long.valueOf(payload.get("dueDateOffset").toString())
                    : 14L;

            return ResponseEntity
                    .ok(messageService.respondToRequest(id, status, responseMessage, adminId, dueDateOffset));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pending")
    public List<BookRequestMessage> getPendingRequests() {
        return messageService.getPendingRequests();
    }

    @GetMapping("/user/{userId}")
    public List<BookRequestMessage> getUserRequests(@PathVariable Long userId) {
        return messageService.getUserRequests(userId);
    }
}
