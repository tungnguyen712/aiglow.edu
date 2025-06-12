package com.example.googleprompt.controller;

import com.example.googleprompt.model.dto.NotificationMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationController {
    private final SimpMessagingTemplate messagingTemplate;

    public void notifyCertAdded(String userId, String certName) {
        NotificationMessage msg = new NotificationMessage(
                "New certification named: " + certName + " added", "CERT_ADDED", userId);
        messagingTemplate.convertAndSend("/topic/notifications/" + userId, msg);
    }

    public void notifyRoadmapCompleted(String userId, String roadmapName) {
        NotificationMessage msg = new NotificationMessage(
                "You have completed roadmap named: " + roadmapName, "ROADMAP_COMPLETED", userId);
        messagingTemplate.convertAndSend("/topic/notifications/" + userId, msg);
    }
}
