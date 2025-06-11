package com.example.googleprompt.controller;

import com.example.googleprompt.model.GoalRequest;
import com.example.googleprompt.model.GoalResponse;
import com.example.googleprompt.service.GoalService;
import com.example.googleprompt.service.GoalServiceIf;
import com.example.googleprompt.service.PromptService;
import com.example.googleprompt.service.PromptServiceIf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://dxt-bid-masters-career-upskilling-a.vercel.app/"
})
public class GoalController {
    private GoalServiceIf goalService;
    private PromptServiceIf promptService;

    public GoalController(GoalService goalService, PromptService promptService) {
        this.goalService = goalService;
        this.promptService = promptService;
    }

    @PostMapping("/goal")
    public ResponseEntity<GoalResponse> postGoal(@RequestBody GoalRequest request) {
        GoalResponse response = goalService.saveGoalAndGenerateSkills(request.getUserId(), request.getGoal());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/skills")
    public ResponseEntity<?> getSkills(@RequestParam(name = "goalId") String goalId) {
        return goalService.getSessionDataByGoalId(goalId)
                .map(sessionData -> ResponseEntity.ok(sessionData.getFundamentalSkills()))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Collections.singletonList("GoalId doesn't exist!")));
    }
}
