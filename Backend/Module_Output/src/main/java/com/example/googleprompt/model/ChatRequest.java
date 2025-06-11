package com.example.googleprompt.model;

import com.google.genai.types.Content;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRequest {
    private String inputText;
    private List<Content> history;
}


