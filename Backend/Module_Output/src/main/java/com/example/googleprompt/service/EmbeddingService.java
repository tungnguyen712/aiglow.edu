package com.example.googleprompt.service;

import com.example.googleprompt.model.EmbeddingProperties;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class EmbeddingService implements EmbeddingServiceIf{
    private final RestTemplate restTemplate;
    private final EmbeddingProperties properties;

    public EmbeddingService(RestTemplateBuilder builder, EmbeddingProperties properties) {
        this.restTemplate = builder.build();
        this.properties = properties;
    }

    public List<String> searchSimilar(String queryText){
        String url = properties.getBaseUrl() + properties.getEndpoints().getSearch();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> request = Map.of("text", queryText);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(request, headers);

        ResponseEntity<List> response = restTemplate.postForEntity(url, entity, List.class);
        List<Map<String, String>> result = response.getBody();

        if(result == null) return List.of();
        return result.stream()
                .map(item -> item.get("content"))
                .filter(Objects::nonNull)
                .toList();
    }
    public void embedText(String text){
        String url = properties.getBaseUrl() + properties.getEndpoints().getEmbed();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(Map.of("text", text), headers);
        try{
            restTemplate.postForEntity(url, entity, Void.class);
        }
        catch (Exception e){
            throw new RuntimeException("Failed to call /embed",e);
        }
    }
}
