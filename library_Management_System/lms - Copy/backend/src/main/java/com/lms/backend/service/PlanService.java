package com.lms.backend.service;

import com.lms.backend.model.Plan;
import com.lms.backend.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlanService {
    @Autowired
    private PlanRepository planRepository;

    public Plan addPlan(Plan plan) {
        if (planRepository.existsByName(plan.getName())) {
            throw new RuntimeException("Plan with this name already exists");
        }
        return planRepository.save(plan);
    }

    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }
}
