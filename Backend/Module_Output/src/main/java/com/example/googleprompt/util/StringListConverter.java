package com.example.googleprompt.util;

import jakarta.persistence.AttributeConverter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class StringListConverter implements AttributeConverter<List<String>, String> {
    @Override
    public String convertToDatabaseColumn(List<String> list) {
        return list != null ? String.join(",", list) : "";
    }

    @Override
    public List<String> convertToEntityAttribute(String joined) {
        return (joined != null && !joined.isEmpty())
                ? Arrays.asList(joined.split(","))
                : new ArrayList<>();
    }
}
