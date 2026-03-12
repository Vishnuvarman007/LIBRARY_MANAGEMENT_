package com.lms.backend.controller;

import com.lms.backend.model.Membership;
import com.lms.backend.service.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MembershipController {

    @Autowired
    private MembershipService membershipService;

    @PostMapping
    public ResponseEntity<?> addMembership(@RequestBody Map<String, Long> payload) {
        try {
            Long userId = payload.get("userId");
            Long planId = payload.get("planId");
            return ResponseEntity.ok(membershipService.addMembership(userId, planId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<Membership> getAllMemberships() {
        return membershipService.getAllMemberships();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMembershipDetails(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(membershipService.getMembershipDetails(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pending")
    public List<Membership> getPendingMemberships() {
        return membershipService.getAllMemberships().stream()
                .filter(m -> "PENDING".equals(m.getStatus()))
                .toList();
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveMembership(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(membershipService.approveMembership(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectMembership(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(membershipService.rejectMembership(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public List<Membership> getMembershipsByUser(@PathVariable Long userId) {
        return membershipService.getMembershipsByUserId(userId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMembership(@PathVariable Long id, @RequestBody Membership membership) {
        try {
            return ResponseEntity.ok(membershipService.updateMembership(id, membership));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMembership(@PathVariable Long id) {
        try {
            membershipService.deleteMembership(id);
            return ResponseEntity.ok("Membership deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
