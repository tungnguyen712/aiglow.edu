package com.example.googleprompt.service;

import com.google.genai.types.Content;

import java.util.List;

public interface ChatHistoryServiceIf {
    List<Content> getHistory(String roadmapId);
    void updateHistory(String roadmapId, List<Content> updatedHistory);
    void clearHistory(String roadmapId);
}
;
