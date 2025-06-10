package com.example.googleprompt.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExistingRoadmapDTO {
    private String name;
    private float progress;
    private String status;
}
