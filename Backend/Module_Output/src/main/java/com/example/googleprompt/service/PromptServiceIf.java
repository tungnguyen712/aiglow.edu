package com.example.googleprompt.service;

import com.example.googleprompt.model.ChatResponse;
import com.google.genai.types.Content;

import java.util.List;

public interface PromptServiceIf {
    /**
     * Generates AI output based on a new input text and existing chat history.
     *
     * @param history The current chat history (list of Content objects).
     * @param newInputText The new text input from the user.
     * @return A ChatResponse object containing AI's response parts and updated history.
     */
    ChatResponse generateOutputWithContext(List<Content> history, String newInputText);
    String generateTextFromPrompt(String prompt);
}
