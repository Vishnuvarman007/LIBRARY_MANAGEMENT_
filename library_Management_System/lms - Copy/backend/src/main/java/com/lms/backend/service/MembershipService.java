package com.lms.backend.service;

import com.lms.backend.model.Membership;
import com.lms.backend.model.Plan;
import com.lms.backend.model.User;
import com.lms.backend.repository.MembershipRepository;
import com.lms.backend.repository.PlanRepository;
import com.lms.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MembershipService {
    @Autowired
    private MembershipRepository membershipRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PlanRepository planRepository;

    public Membership addMembership(Long userId, Long planId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        Optional<Membership> existingActive = membershipRepository.findTopByUserIdAndStatusOrderByEndDateDesc(userId,
                "ACTIVE");
        if (existingActive.isPresent() && existingActive.get().getEndDate().isAfter(LocalDate.now())) {
            throw new RuntimeException("User already has an active membership");
        }

        Optional<Membership> existingPending = membershipRepository.findTopByUserIdAndStatusOrderByEndDateDesc(userId,
                "PENDING");
        if (existingPending.isPresent()) {
            throw new RuntimeException("User already has a pending membership request");
        }

        Membership membership = new Membership();
        membership.setUser(user);
        membership.setPlan(plan);
        membership.setStartDate(LocalDate.now());
        membership.setEndDate(LocalDate.now()); // Temporary until approved
        membership.setStatus("PENDING");

        return membershipRepository.save(membership);
    }

    public Membership approveMembership(Long id) {
        Membership membership = membershipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Membership not found"));

        if (!"PENDING".equals(membership.getStatus())) {
            throw new RuntimeException("Only pending memberships can be approved");
        }

        membership.setStartDate(LocalDate.now());
        membership.setEndDate(LocalDate.now().plusMonths(membership.getPlan().getDurationInMonths()));
        membership.setStatus("ACTIVE");

        return membershipRepository.save(membership);
    }

    public Membership rejectMembership(Long id) {
        Membership membership = membershipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Membership not found"));

        if (!"PENDING".equals(membership.getStatus())) {
            throw new RuntimeException("Only pending memberships can be rejected");
        }

        membership.setStatus("CANCELLED");
        return membershipRepository.save(membership);
    }

    public Membership updateMembership(Long id, Membership updatedMembership) {
        Membership membership = membershipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Membership not found"));

        membership.setStatus(updatedMembership.getStatus());
        membership.setEndDate(updatedMembership.getEndDate());
        return membershipRepository.save(membership);
    }

    public void deleteMembership(Long id) {
        membershipRepository.deleteById(id);
    }

    public Membership getMembershipDetails(Long id) {
        return membershipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Membership not found"));
    }

    public List<Membership> getAllMemberships() {
        return membershipRepository.findAll();
    }

    public List<Membership> getMembershipsByUserId(Long userId) {
        return membershipRepository.findByUserId(userId);
    }
}
