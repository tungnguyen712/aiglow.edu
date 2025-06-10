package com.example.googleprompt.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collections;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResponseData {
    private List<ResponseContent> parts;
    public ResponseData(String textOutput) {
        this.parts = List.of(new ResponseContent(OutputPartType.TEXT, textOutput, null));
    }
}
