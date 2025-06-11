package com.example.UserService.user;

import com.example.UserService.payload.LoginRequest;
import com.example.UserService.payload.LoginResponse;

import java.util.List;

public interface IUserService {

    UserApp registerUser(LoginRequest loginRequest);
    LoginResponse login(LoginRequest loginRequest);
    List<?> listUser();
    void deleteUser(Long id);
    UserApp updateUser(Long id, UserApp userApp);
}
