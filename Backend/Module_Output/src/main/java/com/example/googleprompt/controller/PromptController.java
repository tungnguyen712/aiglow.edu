package com.example.googleprompt.controller;

import com.example.googleprompt.model.ChatRequest;
import com.example.googleprompt.model.ChatResponse;
import com.example.googleprompt.service.PromptServiceIf;
import com.google.genai.types.Content;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/prompt")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://dxt-bid-masters-career-upskilling-a.vercel.app/"
})
public class PromptController {

    private PromptServiceIf promptService;
    public PromptController(PromptServiceIf promptService){
        this.promptService = promptService;
    }

    @PostMapping("/generate")
    public ResponseEntity<ChatResponse> generateOutput(@RequestBody ChatRequest chatRequest) {
        String inputText = chatRequest.getInputText();
        if (inputText == null || inputText.isEmpty()) {
            List<com.google.genai.types.Content> history = chatRequest.getHistory() != null ? chatRequest.getHistory() : new ArrayList<>();
            return ResponseEntity.badRequest().body(new ChatResponse("Input text cannot be empty", history));
        }
        List<Content> currentHistory = chatRequest.getHistory();
        ChatResponse response = promptService.generateOutputWithContext(currentHistory, inputText);

        return ResponseEntity.ok(response);
    }
}
