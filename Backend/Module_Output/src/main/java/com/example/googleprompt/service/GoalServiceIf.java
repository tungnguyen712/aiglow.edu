package com.example.googleprompt.service;

import com.example.googleprompt.model.GoalResponse;
import com.example.googleprompt.model.SessionData;

import java.util.List;
import java.util.Optional;

public interface GoalServiceIf {
    GoalResponse saveGoalAndGenerateSkills(String userId, String goal);
    Optional<SessionData> getSessionDataByGoalId(String goalId);
}
