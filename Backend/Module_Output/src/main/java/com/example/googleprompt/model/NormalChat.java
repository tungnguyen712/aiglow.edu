package com.example.googleprompt.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NormalChat {
    private String roadmap_id;
    private String text;
}
