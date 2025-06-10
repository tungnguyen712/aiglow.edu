package com.example.googleprompt.service;

import com.example.googleprompt.model.*;
import com.google.genai.types.*;
import com.google.genai.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PromptService implements PromptServiceIf {

    private static final Logger logger = LoggerFactory.getLogger(PromptService.class);
    private final GeminiProperties geminiProperties;

    private Client aImodel;

    public PromptService(GeminiProperties geminiProperties) {
        this.geminiProperties = geminiProperties;
    }

    /*@Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model-name}")
    private String modelName;*/

    @PostConstruct
    public void init() {
        logger.info("Initializing PromptService...");
        List<String> keys = geminiProperties.getApiKeys();
        if (keys == null || keys.isEmpty()) {
            logger.error("Google Gemini API Key is not configured. Please check application.yml");
            throw new IllegalArgumentException("Google Gemini API Key is not configured. Please check application.yml");
        }
        String firstKey = keys.get(0);
        this.aImodel = Client.builder().apiKey(firstKey).build();
        logger.info("Google Gemini Client initialized successfully");
    }

    @Override
    public ChatResponse generateOutputWithContext(List<Content> history, String newInputText) {
        ChatResponse chatResponse = new ChatResponse();
        List<Content> currentHistory = (history != null) ? new ArrayList<>(history) : new ArrayList<>();

        if (newInputText == null || newInputText.isEmpty()) {
            logger.warn("New input text is null or blank");
            chatResponse.setAiResponseParts(List.of(new ResponseContent(OutputPartType.TEXT, "New input text cannot be empty", null)));
            chatResponse.setUpdatedHistory(currentHistory);
            return chatResponse;
        }

        Part userInputPart = Part.fromText(newInputText);
        Content userContent = Content.builder()
                .role("user")
                .parts(Collections.singletonList(userInputPart))
                .build();
        currentHistory.add(userContent);

        GenerateContentResponse response;
        try {
            response = aImodel.models.generateContent(this.geminiProperties.getModelName(), currentHistory, null);
        } catch (Exception e) {
            logger.error("Error calling Gemini API: {}", e.getMessage(), e);
            chatResponse.setAiResponseParts(List.of(new ResponseContent(OutputPartType.TEXT, "Error communicating with AI: " + e.getMessage(), null)));
            chatResponse.setUpdatedHistory(currentHistory);
            return chatResponse;
        }

        List<ResponseContent> aiResponseParts = new ArrayList<>();
        List<Candidate> candidates = response.candidates().orElse(Collections.emptyList());
        if (!candidates.isEmpty()) {
            Candidate firstCandidate = candidates.get(0);
            Content content = firstCandidate.content().get();

            if (content != null && content.parts() != null) {
                for (Part part : content.parts().get()) {
                    if (part.text().isPresent()) {
                        aiResponseParts.add(new ResponseContent(OutputPartType.TEXT, part.text().get(), null));
                    } else if (part.inlineData().isPresent()) {
                        Blob blob = part.inlineData().get();
                        String mimeType = blob.mimeType().get();
                        byte[] data = blob.data().get();

                        String base64Data = Base64.getEncoder().encodeToString(data);
                        if (mimeType != null && mimeType.startsWith("image/")) {
                            aiResponseParts.add(new ResponseContent(OutputPartType.IMAGE_URL, "data:" + mimeType + ";base64," + base64Data, mimeType));
                        } else {
                            aiResponseParts.add(new ResponseContent(OutputPartType.FILE_URL, "data:" + mimeType + ";base64," + base64Data, mimeType));
                        }
                    }
                }
            }
        }

        if (aiResponseParts.isEmpty()) {
            aiResponseParts.add(new ResponseContent(OutputPartType.TEXT, "No detailed response from AI.", null));
        }

        chatResponse.setAiResponseParts(aiResponseParts);

            List<Part> modelParts = new ArrayList<>();
            aiResponseParts.forEach(rc -> {
                if (rc.getType() == OutputPartType.TEXT) {
                    modelParts.add(Part.fromText(rc.getValue()));
                } else if (rc.getType() == OutputPartType.IMAGE_URL || rc.getType() == OutputPartType.FILE_URL) {
                    if (rc.getValue().startsWith("data:") && rc.getMimeType() != null) {
                        String[] dataUriParts = rc.getValue().split("[,;]", 2);
                        if (dataUriParts.length == 2) {
                            String base64Data = dataUriParts[1];
                            byte[] decodedData = Base64.getDecoder().decode(base64Data);
                            // Tạo Part chứa Blob bằng Part.fromBytes()
                            modelParts.add(Part.fromBytes(decodedData, rc.getMimeType()));
                        }
                    }
                }
            });

        if (!modelParts.isEmpty()) { // Chỉ thêm nếu có nội dung để thêm
            Content modelContent = Content.builder()
                    .role("model")
                    .parts(modelParts)
                    .build();
            currentHistory.add(modelContent);
        } else {
            logger.warn("No suitable parts to add to model history for context.");
        }


        chatResponse.setUpdatedHistory(currentHistory); // Gán lịch sử đã cập nhật vào phản hồi
        return chatResponse;
    }

    public String generateTextFromPrompt(String prompt) {
        List<String> apiKeys = geminiProperties.getApiKeys();
        if (apiKeys == null || apiKeys.isEmpty()) {
            logger.error("No API keys configured");
            return "Error: No API keys configured.";
        }
        Exception lastException = null;
        Part userInputPart = Part.fromText(prompt);
        Content userContent = Content.builder()
                .role("user")
                .parts(Collections.singletonList(userInputPart))
                .build();

        for (String apiKey : apiKeys) {
            try {
                Optional<String> resultOpt = callGenerateContentWithKey(apiKey, prompt);
                if (resultOpt.isPresent()) {
                    return resultOpt.get();
                } else {
                    logger.warn("Empty response from AI with API key [{}]", apiKey);
                }
            } catch (Exception e) {
                logger.warn("API key [{}] failed: {}", apiKey, e.getMessage());
                lastException = e;
            }
        }
        return "Error: All API keys failed. Last error: "
                + (lastException != null ? lastException.getMessage() : "unknown error");
    }

    private Optional<String> callGenerateContentWithKey(String apiKey, String prompt) throws Exception {
        Client client = Client.builder().apiKey(apiKey).build();

        Part userInputPart = Part.fromText(prompt);
        Content userContent = Content.builder()
                .role("user")
                .parts(Collections.singletonList(userInputPart))
                .build();

        GenerateContentResponse response = client.models.generateContent(
                geminiProperties.getModelName(),
                List.of(userContent),
                null);

        Optional<List<Candidate>> candidatesOpt = response.candidates();
        if (candidatesOpt.isPresent() && !candidatesOpt.get().isEmpty()) {
            Candidate candidate = candidatesOpt.get().get(0);
            Optional<Content> contentOpt = candidate.content();
            if (contentOpt.isPresent()) {
                Optional<List<Part>> partsOpt = contentOpt.get().parts();
                if (partsOpt.isPresent()) {
                    return Optional.of(partsOpt.get().stream()
                            .filter(p -> p.text().isPresent())
                            .map(p -> p.text().get())
                            .collect(Collectors.joining("\n")));
                }
            }
        }

        return Optional.empty();
    }

}
