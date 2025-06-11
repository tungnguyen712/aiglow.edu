package com.example.UserService.exception;

public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error"),
    INVALID_KEY(1001, "Uncategorized error"),
    USER_EXISTED(1002, "User existed"),
    INVALID_USER(1003, "Invalid email or password"),
    INVALID_PASSWORD(1005, "Password must be at least 8 characters"),
    USER_NOT_EXISTED(1006, "User not existed"),
    UNAUTHENTICATED(1007, "Unauthenticated"),
    USER_NOT_FOUND(1008, "Email or password does not correct"),
    ;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
    ErrorCode(String message) {this.message = message;}

    private int code;
    private String message;

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }


}
