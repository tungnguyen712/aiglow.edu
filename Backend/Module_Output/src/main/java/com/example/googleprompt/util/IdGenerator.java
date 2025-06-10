package com.example.googleprompt.util;

import java.util.UUID;

public class IdGenerator {
    public static String generateShortId() {
        return "r" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
    }
}
