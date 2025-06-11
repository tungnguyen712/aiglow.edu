package com.example.googleprompt.model;


import com.google.genai.types.Content;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collections;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private List<ResponseContent> aiResponseParts;
    private List<Content> updatedHistory;

    public ChatResponse(String errorMessage, List<Content> history) {
        this.aiResponseParts = List.of(new ResponseContent(OutputPartType.TEXT, errorMessage, null));
        this.updatedHistory = history;
    }
}
