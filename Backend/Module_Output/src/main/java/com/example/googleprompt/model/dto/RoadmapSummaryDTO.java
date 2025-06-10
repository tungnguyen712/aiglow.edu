package com.example.googleprompt.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoadmapSummaryDTO {
    //@JsonProperty("roadmapId")
    private String id;
    //@JsonProperty("roadmapName")
    private String name;
    private String userId;
    //@JsonProperty("goal")
    private String goal;
    //@JsonProperty("deadline")
    private LocalDate due;
    //@JsonProperty("studyHourPerWeek")
    private Integer hpw;

    //private List<CourseNodeDTO> nodes;
}
