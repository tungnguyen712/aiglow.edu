package com.example.googleprompt.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseNodeDTO {
    private String id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("link")
    private String link;
    private String status;  // Ví dụ: "finished" hoặc "unfinished"
    @JsonProperty("avgTimeToFinish")
    private int avgTimeToFinish;
    private String roadmapId;
    private String children;
    //private List<String> children;
}
