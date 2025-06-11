package com.example.googleprompt.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManuRMRequest {
    private String userId;
    private String goal;
    private String deadline;
    private String rmName;
    private double studyHourPerWeek;
    private List<String> selectedSkills;
    private List<String> previousRoadmapIds;
}
