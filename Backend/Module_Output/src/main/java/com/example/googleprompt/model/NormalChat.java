package com.example.googleprompt.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NormalChat {
    @JsonProperty("roadmapId")
    private String roadmap_id;
    private String text;
}
