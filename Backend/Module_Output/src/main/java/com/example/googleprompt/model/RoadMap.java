package com.example.googleprompt.model;

import com.example.googleprompt.model.dto.CourseNodeDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RoadMap {
    private String roadmapId;
    private String roadmapName;
    private String goal;
    private String userId;
    private LocalDate deadline;
    private Integer studyHourPerWeek;
    private List<String> selectedSkills;
    @JsonProperty("nodes")
    private List<CourseNodeDTO> nodes;
    @JsonIgnore
    private List<String> previousRoadmapIds;
}
