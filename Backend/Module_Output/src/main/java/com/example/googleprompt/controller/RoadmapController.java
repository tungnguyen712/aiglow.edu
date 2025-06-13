package com.example.googleprompt.controller;

import com.example.googleprompt.entity.RoadmapEntity;
import com.example.googleprompt.model.*;
import com.example.googleprompt.model.dto.*;
import com.example.googleprompt.repository.CourseNodeRepository;
import com.example.googleprompt.repository.RoadmapRepository;
import com.example.googleprompt.service.RoadmapService;
import com.example.googleprompt.service.RoadmapServiceIf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://dxt-bid-masters-career-upskilling-a.vercel.app/"
})
public class RoadmapController {
    private final RoadmapServiceIf roadmapService;
    private final CourseNodeRepository courseNodeRepository;

    public RoadmapController(RoadmapService roadmapService, CourseNodeRepository courseNodeRepository) {
        this.roadmapService = roadmapService;
        this.courseNodeRepository = courseNodeRepository;
    }

    @Autowired
    private RoadmapRepository roadmapRepository;

    @PostMapping("/roadmap/create/manu")
    public RMResponse generateRoadmap(@RequestBody ManuRMRequest request) {
        RMResponse response = roadmapService.generateRoadmap(request);
        List<CourseNodeDTO> nodes = response.getRoadmap().getNodes();
        response.setCourseNodes(nodes);
        System.out.println("Response courseNodes = " + response.getCourseNodes());
        return ResponseEntity.ok(response).getBody();
    }

    @PostMapping("/roadmap/create/auto")
    public RMResponse generateRoadmap(@RequestBody ProfileRMRequest request) {
        return roadmapService.generateRoadmapFromProfile(request);
    }

    @GetMapping("/roadmap/{id}") //roadmap id get roadmap user has just created
    public ResponseEntity<?> getRoadmapDetail(@PathVariable(name="id") String roadmapId) {
        Optional<RMResponse> responseOpt = roadmapService.getRoadmapDetail(roadmapId);

        if (responseOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Roadmap not found"));
        }

        return ResponseEntity.ok(responseOpt.get());
    }

    @GetMapping("/roadmap/user/{userId}") // user id get all roadmap user has
    public ResponseEntity<List<RoadmapEntity>> getRoadmapsByUser(@PathVariable(name="userId") String userId) {
        List<RoadmapEntity> roadmaps = roadmapService.getRoadmapsByUserId(userId);
        if (roadmaps.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(roadmaps);
    }

    @GetMapping("/user/{id}") //user id get personal information
    public ResponseEntity<UserDTO> getUser(@PathVariable(name="id") String id) {
        return roadmapService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/user/{id}/certificates") //user id add new cert that user has
    public ResponseEntity<?> addCertificate(@PathVariable(name="id") String userId, @RequestBody CertificateDTO certRequest) {
        try {
            CertificateAddDTO cert = roadmapService.addCertificateToUser(userId, certRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(cert);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @PostMapping("/nodes/{id}/status") //course node id update course status
    public ResponseEntity<?> updateNodeStatus(@PathVariable(name="id") String nodeId, @RequestBody NodeStatusDTO request) {
        try {
            CourseNodeDTO updatedNode = roadmapService.updateCourseNodeStatus(nodeId, request.getStatus());
            return ResponseEntity.ok(updatedNode);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/chat")
    public ResponseEntity<String> getRoadmapsByUser(@RequestBody NormalChat request) {
        return ResponseEntity.ok(roadmapService.buildNormalPrompt(request.getText(), request.getRoadmap_id()));
    }

    @DeleteMapping("/roadmap/{id}/delete")
    public ResponseEntity<?> deleteRoadmap(@PathVariable(name="id") String roadmapId) {
        try {
            roadmapService.deleteRoadmapById(roadmapId);
            return ResponseEntity.ok(Map.of("message", "Delete roadmap successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/user/preferences")
    public ResponseEntity<String> updatePreferences(@RequestBody UserPreferenceRequest request) {
        roadmapService.updatePreferences(request.getUserId(), request.getPreference());
        return ResponseEntity.ok("Preferences updated successfully");
    }
}
