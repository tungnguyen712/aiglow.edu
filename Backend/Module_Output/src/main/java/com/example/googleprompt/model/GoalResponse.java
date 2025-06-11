package com.example.googleprompt.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoalResponse {
    private String goalId;
    private String goal;
    private List<String> fundamentalSkills;
}
