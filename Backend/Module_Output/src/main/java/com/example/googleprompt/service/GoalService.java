package com.example.googleprompt.service;

import com.example.googleprompt.model.GoalResponse;
import com.example.googleprompt.model.SessionData;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GoalService implements GoalServiceIf {
    private final Map<String, SessionData> sessionStore = new ConcurrentHashMap<>();
    private final PromptServiceIf promptService;

    public GoalService(PromptServiceIf promptService){
        this.promptService = promptService;
    }

    @Override
    public GoalResponse saveGoalAndGenerateSkills(String userId, String goal) {
        String goalId = UUID.randomUUID().toString();

        String prompt = "Given the learning goal: " + goal + ". " +
                "If the goal is not a valid or meaningful learning objective, such as random characters, reply only with: RandomCharGoal. " +
                "Otherwise, list only the top 30 fundamental or prerequisite skills that a learner should know before achieving this goal. " +
                "Provide only the skill names, separated by commas or new lines, with no extra explanation.";

        String aiResponse = promptService.generateTextFromPrompt(prompt);

        List<String> fundamentalSkills = Arrays.stream(aiResponse.split("\\r?\\n"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        sessionStore.put(goalId, new SessionData(goal, fundamentalSkills));

        return new GoalResponse(goalId, goal, fundamentalSkills);
    }

    public Optional<SessionData> getSessionDataByGoalId(String goalId) {
        return Optional.ofNullable(sessionStore.get(goalId));
    }
}
