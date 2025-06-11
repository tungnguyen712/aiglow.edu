package com.example.googleprompt.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Resource {
    private String id;
    private String name;
    private String link;
    private String status;
    private Integer avg_time_to_finish;
}
