package com.example.googleprompt.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResponseContent {
    private OutputPartType type;
    private String value;
    private String mimeType;

}


