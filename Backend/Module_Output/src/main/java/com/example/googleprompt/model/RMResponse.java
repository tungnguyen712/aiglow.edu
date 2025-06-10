package com.example.googleprompt.model;

import com.example.googleprompt.model.dto.CourseNodeDTO;
import com.example.googleprompt.model.dto.RoadmapSummaryDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RMResponse {
    private RoadMap roadmap;
    private List<String> advice;
    @JsonProperty("nodes")
    private List<CourseNodeDTO> courseNodes;
}
