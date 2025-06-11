package com.example.googleprompt.model;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "embedding")
@Data
public class EmbeddingProperties {
    private String baseUrl;
    private Endpoints endpoints;

    @Data
    public static class Endpoints {
        private String search;
        private String embed;
    }
}
