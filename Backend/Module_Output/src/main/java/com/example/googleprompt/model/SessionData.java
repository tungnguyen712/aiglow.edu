package com.example.googleprompt.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionData {
    private String goal;
    private List<String> fundamentalSkills;
}
