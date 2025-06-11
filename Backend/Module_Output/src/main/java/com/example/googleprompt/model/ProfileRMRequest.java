package com.example.googleprompt.model;

import com.example.googleprompt.model.dto.ExistingRoadmapDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileRMRequest {
    private String userId;
    private String goal;
    private String deadline;
    private String rmName;
    private double studyHourPerWeek;
    private List<String> previousRoadmapIds;
    private List<ExistingRoadmapDTO> existingRoadmap;
    private List<String> certName;
}
