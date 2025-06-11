package com.example.googleprompt.service;

import java.util.List;

public interface EmbeddingServiceIf {
    List<String> searchSimilar(String queryText);
    void embedText(String text);
}
