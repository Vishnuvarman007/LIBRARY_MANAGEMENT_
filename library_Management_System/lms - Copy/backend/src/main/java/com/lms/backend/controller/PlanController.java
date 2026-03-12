package com.lms.backend.controller;

import com.lms.backend.model.Plan;
import com.lms.backend.service.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin(origins = "*")
public class PlanController {

    @Autowired
    private PlanService planService;

    @PostMapping
    public ResponseEntity<?> addPlan(@RequestBody Plan plan) {
        try {
            return ResponseEntity.ok(planService.addPlan(plan));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<Plan> getAllPlans() {
        return planService.getAllPlans();
    }
}
