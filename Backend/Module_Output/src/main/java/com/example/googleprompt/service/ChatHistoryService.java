package com.example.googleprompt.service;

import com.google.genai.types.Content;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatHistoryService implements ChatHistoryServiceIf{
    private final Map<String, List<Content>> roadmapHistories = new ConcurrentHashMap<>();

    public List<Content> getHistory(String roadmapId) {
        return roadmapHistories.getOrDefault(roadmapId, new ArrayList<>());
    }

    public void updateHistory(String roadmapId, List<Content> updatedHistory) {
        roadmapHistories.put(roadmapId, updatedHistory);
    }

    public void clearHistory(String roadmapId) {
        roadmapHistories.remove(roadmapId);
    }
}
