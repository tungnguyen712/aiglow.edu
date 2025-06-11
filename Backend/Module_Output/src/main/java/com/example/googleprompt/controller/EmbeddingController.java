package com.example.googleprompt.controller;

import com.example.googleprompt.service.EmbeddingService;
import com.example.googleprompt.service.EmbeddingServiceIf;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/test/embedding")

public class EmbeddingController {
    private final EmbeddingServiceIf embeddingService;

    public EmbeddingController(EmbeddingService embeddingService) {
        this.embeddingService = embeddingService;
    }

    @PostMapping("/embed")
    public ResponseEntity<String>testEmbed(@RequestBody String text){
        try{
            embeddingService.embedText(text);
            return ResponseEntity.ok("Embed OK");
        }
        catch(Exception e){
            return ResponseEntity.internalServerError().body("Embed Not OK"+e.getMessage());
        }
    }

    @PostMapping("/search")
    public ResponseEntity<List<String>>testSearch(@RequestBody String query){
        try{
            List<String> results = embeddingService.searchSimilar(query);
            return ResponseEntity.ok(results);
        }
        catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }
    }
}
