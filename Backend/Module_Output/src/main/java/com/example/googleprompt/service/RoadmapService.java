package com.example.googleprompt.service;

import com.example.googleprompt.controller.NotificationController;
import com.example.googleprompt.entity.CertificateEntity;
import com.example.googleprompt.entity.CourseNodeEntity;
import com.example.googleprompt.entity.RoadmapEntity;
import com.example.googleprompt.entity.UserEntity;
import com.example.googleprompt.model.*;
import com.example.googleprompt.model.dto.*;
import com.example.googleprompt.repository.CertificateRepository;
import com.example.googleprompt.repository.CourseNodeRepository;
import com.example.googleprompt.repository.RoadmapRepository;
import com.example.googleprompt.repository.UserRepository;
import com.example.googleprompt.util.IdGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.google.genai.types.Content;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;


@Service
public class RoadmapService implements RoadmapServiceIf {
    private static final Logger logger = LoggerFactory.getLogger(RoadmapService.class);
    private final RoadmapRepository roadmapRepository;
    private final CourseNodeRepository courseNodeRepository;
    private final UserRepository userRepository;
    private final CertificateRepository certificateRepository;
    private final PromptServiceIf promptService;
    private final EmbeddingServiceIf embeddingService;
    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationController notificationController;
    private final Map<String, RMResponse> roadmapStore = new ConcurrentHashMap<>();
    private final ChatHistoryServiceIf chatHistoryService;

    public RoadmapService(PromptService promptService,
                          ObjectMapper objectMapper,
                          RoadmapRepository roadmapRepository,
                          CourseNodeRepository courseNodeRepository,
                          UserRepository userRepository,
                          CertificateRepository certificateRepository,
                          EmbeddingService embeddingService,
                          SimpMessagingTemplate messagingTemplate,
                          NotificationController notificationController,
                          ChatHistoryService chatHistoryService) {
        this.promptService = promptService;
        this.objectMapper = objectMapper;
        this.roadmapRepository = roadmapRepository;
        this.courseNodeRepository = courseNodeRepository;
        this.userRepository = userRepository;
        this.certificateRepository = certificateRepository;
        this.embeddingService = embeddingService;
        this.messagingTemplate = messagingTemplate;
        this.notificationController = notificationController;
        this.chatHistoryService = chatHistoryService;
    }

    @Override
    public RMResponse generateRoadmap(ManuRMRequest request) {
        String generatedId = request.getUserId() + "-" + IdGenerator.generateShortId();
        String roadmapSuffix = generatedId.substring(generatedId.indexOf("-") + 1);
        List<String> nodeIds = IntStream.range(1, 9)
                .mapToObj(i -> roadmapSuffix + "_n" + i)
                .collect(Collectors.toList());
        logger.info("Node Ids include: ", nodeIds);

        List<String> contextList = embeddingService.searchSimilar(request.getGoal());
        String context = String.join("\n", contextList);

        Optional<UserEntity> userOpt = userRepository.findById(request.getUserId());
        String preference = userOpt.map(UserEntity::getPreference).orElse(null);

        String prompt = buildPrompt(request, generatedId, nodeIds, context, preference);
        logger.info("Prompt sent to AI:\n{}", prompt);

        String aiResponse = promptService.generateTextFromPrompt(prompt);
        logger.info("Raw response from AI:\n{}", aiResponse);
        // Xử lý nếu AI bọc trong ```json ... ```
        String cleaned = aiResponse
                .replaceAll("(?s)^```json\\s*", "")
                .replaceAll("(?s)```\\s*$", "")
                .trim();

        try {
            JsonNode rootNode = objectMapper.readTree(cleaned);
            if (!rootNode.has("roadmap")) {
                throw new IllegalArgumentException("Lacking 'roadmap'");
            }

            ObjectNode roadmapNode = (ObjectNode) rootNode.get("roadmap");

            roadmapNode.put("roadmapId", generatedId);
            roadmapNode.put("userId", request.getUserId());
            logger.info("Enforced roadmapId: {}", generatedId);

            ArrayNode nodesArray = (ArrayNode) roadmapNode.get("nodes");
            if (nodesArray != null) {
                for (JsonNode node : nodesArray) {
                    if (node instanceof ObjectNode objNode) {
                        objNode.put("roadmapId", generatedId);
                    }
                }
            }

            if (!rootNode.has("advice")) {
                logger.warn("Lacking 'advice'");
                ((ObjectNode) rootNode).putArray("advice");
            }

            String fixedJson = rootNode.toString();
            logger.debug("Fixed JSON:\n{}", fixedJson);
            System.out.println("Fixed JSON sent to objectMapper:\n" + fixedJson);
            String cleanedJson = fixedJson.replaceAll(",\\s*}", "}");
            RMResponse roadmapResponse = objectMapper.readValue(cleanedJson, RMResponse.class);


            List<CourseNodeDTO> courseNodes = roadmapResponse.getRoadmap().getNodes();
            roadmapResponse.setCourseNodes(courseNodes);

            embeddingService.embedText(request.getGoal());

            roadmapStore.put(roadmapResponse.getRoadmap().getRoadmapId(), roadmapResponse);
            saveRoadmapAndNodesFlat(roadmapResponse, request.getUserId());
            return roadmapResponse;

        } catch (Exception e) {
            logger.error("Error in parsing JSON from AI response:\n{}", aiResponse, e);
            throw new RuntimeException("Error in parsing response from AI", e);
        }
    }

    @Override
    public RMResponse generateRoadmapFromProfile(ProfileRMRequest request){
        String generatedId = request.getUserId() + "-" + IdGenerator.generateShortId();
        String roadmapSuffix = generatedId.substring(generatedId.indexOf("-") + 1);
        List<String> nodeIds = IntStream.range(1, 9)
                .mapToObj(i -> roadmapSuffix + "_n" + i)
                .collect(Collectors.toList());

        List<String> contextList = embeddingService.searchSimilar(request.getGoal());
        String context = String.join("\n", contextList);

        Optional<UserEntity> userOpt = userRepository.findById(request.getUserId());
        String preference = userOpt.map(UserEntity::getPreference).orElse(null);

        String prompt = buildPromptFromProfile(request, nodeIds, context, preference);
        logger.info("Prompt sent to AI:\n{}", prompt);

        String aiResponse = promptService.generateTextFromPrompt(prompt);
        logger.info("Raw response from AI:\n{}", aiResponse);

        String cleaned = aiResponse
                .replaceAll("(?s)^```json\\s*", "")
                .replaceAll("(?s)```\\s*$", "")
                .trim();

        try {
            JsonNode rootNode = objectMapper.readTree(cleaned);
            if (!rootNode.has("roadmap")) {
                throw new IllegalArgumentException("Lacking 'roadmap'");
            }
            ObjectNode roadmapNode = (ObjectNode) rootNode.get("roadmap");
            roadmapNode.put("roadmapId", generatedId);
            roadmapNode.put("userId", request.getUserId());
            logger.info("Enforced roadmapId: {}", generatedId);

            ArrayNode nodesArray = (ArrayNode) roadmapNode.get("nodes");
            if (nodesArray != null) {
                for (JsonNode node : nodesArray) {
                    if (node instanceof ObjectNode objNode) {
                        objNode.put("roadmapId", generatedId);
                    }
                }
            }
            if (!rootNode.has("advice")) {
                logger.warn("Lacking 'advice'");
                ((ObjectNode) rootNode).putArray("advice");
            }

            String fixedJson = rootNode.toString();
            logger.debug("Fixed JSON:\n{}", fixedJson);

            RMResponse roadmapResponse = objectMapper.readValue(fixedJson, RMResponse.class);

            List<CourseNodeDTO> courseNodes = roadmapResponse.getRoadmap().getNodes();
            roadmapResponse.setCourseNodes(courseNodes);

            embeddingService.embedText(request.getGoal());

            roadmapStore.put(roadmapResponse.getRoadmap().getRoadmapId(), roadmapResponse);

            saveRoadmapAndNodesFlat(roadmapResponse, request.getUserId());
            return roadmapResponse;

        } catch (Exception e) {
            logger.error("Error in parsing JSON from AI response:\n{}", aiResponse, e);
            throw new RuntimeException("Error in parsing response from AI", e);
        }
    }


    private String buildPrompt(ManuRMRequest request, String roadmapId, List<String> nodeIds, String context, String preference) {
        /*String previousIds = (request.getPreviousRoadmapIds() == null || request.getPreviousRoadmapIds().isEmpty()) ?
                "None" : String.join(", ", request.getPreviousRoadmapIds());*/
        return String.format("""
    You are an expert assistant. Generate a JSON response for a learning roadmap.
    Requirements:
    - The roadmap must contain **exactly 8 nodes** in total.
    - It must have a **tree-like structure** with **at least 3 levels** (root → child → grandchild), but returned as a **flat list**.
    - Each node is an object in the flat list, and the relationships between nodes are described using the field `"childIds"`.
    - Do NOT include skills already learned (selected skills) or listed in previous roadmap IDs.
    - All nodes must have:
      - You must use exactly these 8 pre-generated node IDs (in order): [%s]
      - Name of the skill
      - **Every node MUST have a valid, clickable course URL** in "link".
                              - **"name" is the name of the skills that you suggest user to learn,
                                  "link" is the url to the course that help user acquire such skill.
                              - **Do NOT leave "link" empty or null.
                                **Even if the course name is broad or general, you must provide a URL to a course, tutorial, article, or video that helps the user learn that specific topic or a major part of it.
                                **If no exact course exists, you MUST still provide a valid working link to an existing tutorial, documentation, or video that covers the topic. NEVER return "undefined" or fake URLs. Prefer courses from platforms like Coursera, Udemy, edX, Khan Academy or freeCodeCamp.
                              - All nodes should default to "unfinished" status.
      - Average time to finish in hours
      - The ID of the roadmap ("roadmapId")
      - A string of child node IDs in `"children"` (e.g., `"c002,c003"`). If no children, set `"children": ""`.
    
    - The output must be a **flat list** of these 8 nodes, not a tree.
    - Always prioritize goal over preference. If goal is completely different from preference, ignore preference.
    - Your advices must be useful and practical. And suggesting user key words to search for related videos on Youtube.
    - Please make sure the JSON response is valid and does not contain trailing commas.

    Input:
    - User ID: %s
    - Goal: %s
    - Deadline: %s
    - Study hours per week: %.1f
    - Selected skills: [%s]
    - Roadmap name: %s
    
    Context (for references):
                %s
    
    Preference: %s

    Return a JSON object strictly matching this format:
    {
      "roadmap": {
        "roadmapId": "string",
        "roadmapName": "string",
        "userId": "string",
        "goal": "string",
        "deadline": "yyyy-MM-dd",
        "studyHourPerWeek": number,
        "nodes": [
          {
            "id": "string",
            "name": "string",
            "link": "string",
            "status": "string",
            "avgTimeToFinish": number,
            "roadmapId": "string",
            "children": "string"
          }
        ]
      },
      "advice": ["string"]
    }
    Ensure the output is valid JSON with no markdown, explanations, or surrounding text.
    """,
                String.join(",", nodeIds),
                request.getUserId(),
                request.getGoal(),
                request.getDeadline(),
                request.getStudyHourPerWeek(),
                request.getSelectedSkills(),
                request.getRmName() != null ? request.getRmName() : "",
                //String.join(", ", nodeIds)
                context,
                preference
        );
    }


    private String buildPromptFromProfile(ProfileRMRequest request, List<String> nodeIds, String context, String preference) {
        String previousIds = (request.getPreviousRoadmapIds() == null || request.getPreviousRoadmapIds().isEmpty())
                ? "None"
                : String.join(", ", request.getPreviousRoadmapIds());

        ObjectMapper mapper = new ObjectMapper();
        String existingRM;
        try {
            existingRM = (request.getExistingRoadmap() == null || request.getExistingRoadmap().isEmpty())
                    ? "[]"
                    : mapper.writeValueAsString(request.getExistingRoadmap());
        } catch (JsonProcessingException e) {
            existingRM = "[]";
        }
        String certName = (request.getCertName() == null || request.getCertName().isEmpty())
                ? "None"
                : String.join(", ", request.getCertName());
        String deadlineStr = "";
        if (request.getDeadline() != null) {
            deadlineStr = request.getDeadline().toString();
        }

        logger.info("Passed roadmap IDs (if any): {}", previousIds);
        logger.info("Passed course names (if any): {}", existingRM);

        return String.format("""
You are an expert assistant. Generate a JSON response for a learning roadmap.
Requirements:
- The roadmap must contain **exactly 8 nodes** in total.
- It must have a **tree-like structure** with **at least 3 levels** (root → child → grandchild), but returned as a **flat list**.
- Each node is an object in the flat list, and the relationships between nodes are described using the field `"childIds"`.
- Do NOT include skills already learned or listed in previous roadmap IDs.
- Do not suggest skills that have already been learned with progress 100%% and status "completed".
- Consider skills with progress less than 100%% as partially learned, so you may prioritize or suggest next steps to complete them.
- All nodes must have:
  - A unique ID ("id")
  - You must use exactly these 8 pre-generated node IDs (in order): [%s]
  - Name of the skill
  - **Every node MUST have a valid, clickable course URL** in "link".
  - **"name" is the name of the skills that you suggest user to learn,
      "link" is the url to the course that help user acquire such skill.
  - **Do NOT leave "link" empty or null.
  - **Even if the course name is broad or general, you must provide a URL to a course, tutorial, article, or video that helps the user learn that specific topic or a major part of it.
  - **If no exact course exists, you MUST still provide a valid working link to an existing tutorial, documentation, or video that covers the topic. NEVER return "undefined" or fake URLs. Prefer courses from platforms like Coursera, Udemy, edX, Khan Academy or freeCodeCamp.
  - All nodes should default to "unfinished" status.
  - Average time to finish in hours
  - The ID of the roadmap ("roadmapId")
  - A string of child node IDs in `"children"` (e.g., `"c002,c003"`). If no children, set `"children": ""`.

- The output must be a **flat list** of these 8 nodes, not a tree.
- Always prioritize goal over preference. If goal is completely different from preference, ignore preference.
- Your advices must be useful and practical. And suggesting user key words to search for related videos on Youtube.
- Please make sure the JSON response is valid and does not contain trailing commas.

Input:
- User ID: %s
- Goal: %s
- Deadline: %s
- Study hours per week: %.1f
- Roadmap name: %s
- Existing roadmap (if any): %s
- Certificate (if any): %s

Context (for references):
                %s

Preference: %s

Return a JSON object strictly matching this format:
{
  "roadmap": {
    "roadmapId": "string",
    "roadmapName": "string",
    "userId": "string",
    "goal": "string",
    "deadline": "yyyy-MM-dd",
    "studyHourPerWeek": number,
    "nodes": [
      {
        "id": "string",
        "name": "string",
        "link": "string",
        "status": "string",
        "avgTimeToFinish": number,
        "roadmapId": "string",
        "children": "string"
      }
    ]
  },
  "advice": ["string"]
}

Ensure the output is valid JSON with no markdown, explanations, or surrounding text.
""",
                String.join(",", nodeIds),
                request.getUserId(),
                request.getGoal(),
                deadlineStr,
                request.getStudyHourPerWeek(),
                request.getRmName() != null ? request.getRmName() : "",
                existingRM,
                certName,
                //String.join(",", nodeIds)
                context,
                preference
        );

    }


    /**
     * Lấy roadmap đã tạo theo roadmapId.
     * @param roadmapId Id của roadmap
     * @return Optional chứa RMResponse nếu tìm thấy, Optional.empty() nếu không.
     */
    public Optional<RMResponse> getRoadmapDetail(String roadmapId) {
        if (roadmapId == null || roadmapId.isEmpty()) {
            logger.warn("getRoadmapDetail roadmapId null or empty");
            return Optional.empty();
        }

        Optional<RoadmapEntity> roadmapOpt = roadmapRepository.findById(roadmapId);
        if (roadmapOpt.isEmpty()) {
            logger.info("Roadmap not found with id: {}", roadmapId);
            return Optional.empty();
        }

        RoadmapEntity roadmapEntity = roadmapOpt.get();

        List<CourseNodeEntity> nodeEntities = courseNodeRepository.findAll().stream()
                .filter(node -> roadmapId.equals(node.getRoadmap().getId()))
                .collect(Collectors.toList());

        RoadMap roadmapDto = new RoadMap();
        roadmapDto.setRoadmapId(roadmapEntity.getId());
        roadmapDto.setRoadmapName(roadmapEntity.getName());
        roadmapDto.setUserId(roadmapEntity.getUserId());
        roadmapDto.setGoal(roadmapEntity.getGoal());
        roadmapDto.setDeadline(roadmapEntity.getDue() != null ? LocalDate.parse(roadmapEntity.getDue().toString()) : null);
        roadmapDto.setStudyHourPerWeek(roadmapEntity.getHpw() != null ? roadmapEntity.getHpw() : 0);

        List<CourseNodeDTO> courseNodeDtos = nodeEntities.stream()
                .map(this::toDto)
                .toList();

        RMResponse response = new RMResponse();
        response.setRoadmap(roadmapDto);
        response.setCourseNodes(courseNodeDtos);
        response.setAdvice(List.of());

        return Optional.of(response);
    }

    public List<RoadmapEntity> getRoadmapsByUserId(String userId) {
        return roadmapRepository.getAllByUserId(userId);
    }

    public Optional<UserDTO> getUserById(String id) {
        return userRepository.findById(id).map(user -> {
            List<CertificateDTO> certDTOs = user.getCerts().stream()
                    .map(c -> new CertificateDTO(
                            c.getName(), c.getIssuer(), c.getIssueDate(), c.getCredentialId(),
                            c.getCategory(), c.getUrl(), c.getFileUrl()))
                    .collect(Collectors.toList());

            return new UserDTO(
                    user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), certDTOs, user.getPreference());
        });
    }

    @Transactional
    public CertificateAddDTO addCertificateToUser(String userId, CertificateDTO certRequest) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CertificateEntity cert = new CertificateEntity();
        cert.setName(certRequest.getName());
        cert.setIssuer(certRequest.getIssuer());
        cert.setIssueDate(certRequest.getIssueDate());
        cert.setCredentialId(certRequest.getCredentialId());
        cert.setCategory(certRequest.getCategory());
        cert.setUrl(certRequest.getUrl());
        cert.setFileUrl(certRequest.getFileUrl());
        cert.setUser(user);
        certificateRepository.save(cert);

        CertificateAddDTO certadd = new CertificateAddDTO();
        certadd.setName(cert.getName());
        certadd.setIssuer(cert.getIssuer());
        certadd.setIssueDate(cert.getIssueDate());
        certadd.setUserId(user.getId());
        certadd.setCredentialId(cert.getCredentialId());
        certadd.setUrl(cert.getUrl());
        certadd.setFileUrl(certadd.getFileUrl());

        /*NotificationMessage msg = new NotificationMessage();
        msg.setUserId(userId);
        msg.setType("CERT_ADDED");
        msg.setMessage("You have added a new certification: " + cert.getName());
        messagingTemplate.convertAndSend("/topic/notifications/" + user.getId(), msg);
        logger.info("📢 Sent WebSocket message to user {}: {}", user.getId(), msg.getMessage());*/

        notificationController.notifyCertAdded(userId, cert.getName());

        return certadd;
    }

    @Transactional
    public CourseNodeDTO updateCourseNodeStatus(String nodeId, String newStatus) {
        CourseNodeEntity node = courseNodeRepository.findById(nodeId)
                .orElseThrow(() -> new RuntimeException("Node not found"));

        // Optional: validate status
        if (!newStatus.equalsIgnoreCase("finished") && !newStatus.equalsIgnoreCase("unfinished")) {
            throw new IllegalArgumentException("Invalid status: must be 'finished' or 'unfinished'");
        }

        node.setStatus(newStatus.toLowerCase());
        courseNodeRepository.save(node);

        if (newStatus.equalsIgnoreCase("finished")){
            RoadmapEntity roadmap = node.getRoadmap();
            List<CourseNodeEntity> allNodes = courseNodeRepository.findByRoadmapId(roadmap.getId());
            boolean allFinished = allNodes.stream()
                    .allMatch(n -> "finished".equalsIgnoreCase(n.getStatus()));
            if(allFinished){
                roadmap.setStatus("completed");
                roadmapRepository.save(roadmap);
                /*NotificationMessage msg = new NotificationMessage();
                msg.setUserId(roadmap.getUserId());
                msg.setType("ROADMAP_COMPLETED");
                msg.setMessage("🎉 You have completed this roadmap: " + roadmap.getName());

                messagingTemplate.convertAndSend("/topic/notifications/" + roadmap.getUserId(), msg);
                logger.info("📢 Gửi thông báo hoàn thành roadmap cho user {}: {}", roadmap.getUserId(), msg.getMessage());*/
                notificationController.notifyRoadmapCompleted(roadmap.getUserId() ,roadmap.getName());
            }
        }

        CourseNodeDTO dto = new CourseNodeDTO();
        dto.setId(node.getId());
        dto.setName(node.getName());
        dto.setLink(node.getLink());
        dto.setStatus(node.getStatus());
        dto.setAvgTimeToFinish(node.getAvgTimeToFinish());
        dto.setRoadmapId(node.getRoadmap().getId());
        if (node.getChildIds() != null && !node.getChildIds().isEmpty()) {
            List<String> children = Arrays.stream(node.getChildIds().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
            dto.setChildren(children.toString());
        } else {
            dto.setChildren("");
        }
        return dto;
    }

    public void updatePreferences(String userId, String preference) {
        Optional<UserEntity> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            UserEntity user = optionalUser.get();
            user.setPreference(preference);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found with uid: " + userId);
        }
    }

    private RoadmapEntity mapToEntity(RoadMap dto) {
        RoadmapEntity entity = new RoadmapEntity();
        entity.setId(dto.getRoadmapId());
        entity.setName(dto.getRoadmapName());
        entity.setUserId(dto.getUserId());
        entity.setGoal(dto.getGoal());
        entity.setDue(dto.getDeadline());
        entity.setHpw(dto.getStudyHourPerWeek());
        return entity;
    }

    public CourseNodeDTO toDto(CourseNodeEntity entity) {
        CourseNodeDTO dto = new CourseNodeDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setLink(entity.getLink());
        dto.setStatus(entity.getStatus());
        dto.setRoadmapId(entity.getId());
        dto.setAvgTimeToFinish(entity.getAvgTimeToFinish());

        // Chuyển childIds (chuỗi "c002,c003") thành list children
        if (entity.getChildIds() != null && !entity.getChildIds().isEmpty()) {
            List<String> children = Arrays.stream(entity.getChildIds().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
            dto.setChildren(children.toString());
        } else {
            dto.setChildren("");
        }
        return dto;
    }

    @Transactional
    private void saveRoadmapAndNodesFlat(RMResponse response, String userId) {
        Map<String, String> idMap = new HashMap<>();

        if (response == null || response.getRoadmap() == null) return;

        String roadmapId = response.getRoadmap().getRoadmapId();

        RoadmapEntity roadmapEntity = mapToEntity(response.getRoadmap());
        roadmapEntity.setId(roadmapId);
        roadmapEntity.setUserId(userId);
        roadmapRepository.save(roadmapEntity);

        List<CourseNodeDTO> nodes = response.getRoadmap().getNodes();
        if (nodes == null || nodes.isEmpty()) return;

        for (CourseNodeDTO dto : nodes) {
            CourseNodeEntity entity = new CourseNodeEntity();
            entity.setId(dto.getId());
            entity.setName(dto.getName());
            entity.setLink(dto.getLink());
            entity.setStatus(dto.getStatus());
            entity.setAvgTimeToFinish(dto.getAvgTimeToFinish());
            if (dto.getChildren() == null || dto.getChildren().isEmpty()) {
                entity.setChildIds("");
            } else {
                String cleanedChildren = Arrays.stream(dto.getChildren().split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.joining(","));
                entity.setChildIds(cleanedChildren);
            }
            entity.setRoadmap(roadmapEntity);
            courseNodeRepository.save(entity);
        }
    }

    @Transactional
    public String buildNormalPrompt(String text, String id) {
        RoadmapEntity existing = roadmapRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Roadmap not found"));

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        String training;
        try {
            String roadmapJson = objectMapper.writeValueAsString(existing);
            training = """
            Analyze the request below.
            If the request is to modify a roadmap, here is the current roadmap data in JSON format:

            %s

            You can assist the user in two ways:
                        1. If the user wants to modify the roadmap (change 'due', 'hpw', or any course node that is 'unfinished'), then apply the changes and return the full updated roadmap JSON (preserve all IDs and non-editable fields).
                        2. If the user does NOT request a modification, provide useful advice, learning tips, progress tracking, or encouragement — but strictly based on the current roadmap content.
            Do not answer with "I will wait for a modification" or similar phrases. Always respond with something helpful related to the roadmap.
        
            You are only allowed to edit the following fields:
            - Roadmap: due, hpw (min=1, max=40)
            - CourseNodes (only if status is 'unfinished'): name, link, avgTimeToFinish
            - **Even if the course name is broad or general, you must provide a URL to a course, tutorial, article, or video that helps the user learn that specific topic or a major part of it.
            - **If no exact course exists, you MUST still provide a valid working link to an existing tutorial, documentation, or video that covers the topic. NEVER return "undefined" or fake URLs. Prefer courses from platforms like Coursera, Udemy, edX, Khan Academy or freeCodeCamp.
            - Only return URLs that you know exist and are widely used. If you are not confident about the exact link, do not invent one. Avoid returning links that may result in a 404 page.
            - Youtube video url is not a stable source of learning. Your youtube urls are mostly not found. I want you to suggest keywords and youtube channels instead(Only when you have no other resource than Youtube)
            - All nodes that user requires to change always have their links changed. After changes, courses which are children still have to be children to parent courses. 
            
            Each course node contains: id, name, avgTimeToFinish, link, status, and childIds (list of string ids).
            Only update course nodes that have status = "unfinished".

            Return the full updated roadmap object (as JSON), keeping all IDs and non-editable fields unchanged.
            After updating, suggesting key words to find related videos on youtube.
            After updating, only return to user: "I have updated your roadmap. Feel free to let me know if you need any other changes.";

            Remember: Your response must always stay within the context of the given roadmap.
            If the user doesn't request a change to the roadmap, don't bring it up. Just respond normally and answer their question clearly.
            If the user's message is not related to the roadmap, politely remind them that you can only discuss the roadmap. 
            If the user is simply greeting, respond with a friendly greeting.
            If the user doesn't specify where to change in detail and only use general word like "easier" or "harder", you can consider change their due and hpw accordingly.
        """.formatted(roadmapJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize roadmap to JSON", e);
        }

        List<Content> history = chatHistoryService.getHistory(id);
        ChatResponse chatResponse = promptService.generateOutputWithContext(history, text + "\n" + training);
        chatHistoryService.updateHistory(id, chatResponse.getUpdatedHistory());
        String aiResponse = chatResponse.getAiResponseParts().stream()
                .filter(p -> p.getType() == OutputPartType.TEXT)
                .map(ResponseContent::getValue)
                .collect(Collectors.joining("\n"));


        try {
            RoadmapEntity updated = objectMapper.readValue(cleanAIResponse(aiResponse), RoadmapEntity.class);

            existing.setDue(updated.getDue());
            existing.setHpw(updated.getHpw());
            roadmapRepository.save(existing);

            List<CourseNodeEntity> existingNodes = courseNodeRepository.findByRoadmapId(id);
            Map<String, CourseNodeEntity> nodeMap = existingNodes.stream()
                    .collect(Collectors.toMap(CourseNodeEntity::getId, Function.identity()));

            List<CourseNodeEntity> updatedNodes = updated.getCourseNodes();
            List<CourseNodeEntity> nodesToSave = new ArrayList<>();

            for (CourseNodeEntity updatedNode : updatedNodes) {
                CourseNodeEntity existingNode = nodeMap.get(updatedNode.getId());
                if (existingNode != null && "unfinished".equalsIgnoreCase(existingNode.getStatus())) {
                    existingNode.setName(updatedNode.getName());
                    existingNode.setLink(updatedNode.getLink());
                    existingNode.setAvgTimeToFinish(updatedNode.getAvgTimeToFinish());
                    nodesToSave.add(existingNode);
                }
            }

            courseNodeRepository.saveAll(nodesToSave);

            return "I have updated your roadmap. Feel free to let me know if you need any other changes.";

        } catch (JsonProcessingException e) {
            return cleanAIResponse(aiResponse);
        }
    }

    @Transactional
    public void deleteRoadmapById(String roadmapId) {
        if (!roadmapRepository.existsById(roadmapId)) {
            throw new RuntimeException("Cannot find roadmap with ID: " + roadmapId);
        }
        courseNodeRepository.deleteByRoadmapId(roadmapId);
        roadmapRepository.deleteById(roadmapId);
    }

    private String cleanAIResponse(String aiResponse) {
        return aiResponse
                .replaceAll("(?s)^```json\\s*", "")
                .replaceAll("(?s)```\\s*$", "")
                .trim();
    }

}
