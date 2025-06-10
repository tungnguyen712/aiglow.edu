package com.example.googleprompt.model;

public enum OutputPartType {
    TEXT,       // Văn bản
    IMAGE_URL,  // URL hình ảnh (ví dụ: từ Cloud Storage hoặc Base64)
    FILE_URL,   // URL tệp tin
    LINK,       // Liên kết siêu văn bản
    UNKNOWN     // Kiểu không xác định
}
