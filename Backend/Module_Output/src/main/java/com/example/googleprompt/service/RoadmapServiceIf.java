package com.example.googleprompt.service;

import com.example.googleprompt.entity.CertificateEntity;
import com.example.googleprompt.entity.RoadmapEntity;
import com.example.googleprompt.model.ManuRMRequest;
import com.example.googleprompt.model.ProfileRMRequest;
import com.example.googleprompt.model.RMResponse;
import com.example.googleprompt.model.dto.*;

import java.util.List;
import java.util.Optional;

public interface RoadmapServiceIf {
    RMResponse generateRoadmap(ManuRMRequest request);
    RMResponse generateRoadmapFromProfile(ProfileRMRequest request);
    Optional<RMResponse> getRoadmapDetail(String roadmapId);
    List<RoadmapEntity> getRoadmapsByUserId(String userId);
    Optional<UserDTO> getUserById(String id);
    CertificateAddDTO addCertificateToUser(String userId, CertificateDTO certRequest);
    CourseNodeDTO updateCourseNodeStatus(String nodeId, String newStatus);
    String buildNormalPrompt(String text, String id);
    void deleteRoadmapById(String roadmapId);
    void updatePreferences(String userId, String preference);
}
