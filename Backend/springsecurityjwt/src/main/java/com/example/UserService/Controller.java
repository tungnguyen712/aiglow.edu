package com.example.UserService;

import com.example.UserService.jwt.JwtToken;
import com.example.UserService.payload.LoginRequest;
import com.example.UserService.payload.LoginResponse;
import com.example.UserService.payload.TokenRequest;
import com.example.UserService.user.UserApp;
import com.example.UserService.user.UserDto;
import com.example.UserService.user.UserRepository;
import com.example.UserService.user.UserService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/userservice")
public class Controller {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtToken jwtToken;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public LoginResponse authenticateUser(@RequestBody LoginRequest loginRequest) throws Exception {
        LoginResponse loginResponse = userService.login(loginRequest);
        return loginResponse;
    }

    @PutMapping("/register")
    public UserApp registerUser(@Valid @RequestBody LoginRequest loginRequest) {
        UserApp userApp = userService.registerUser(loginRequest);
        return userApp;
    }

    @PutMapping("/update")
    public UserApp updateUser(@RequestBody UserApp userApp) {
        return userService.updateUser(userApp.getId(), userApp);
    }

    @PostMapping("/info")
    public ResponseEntity<Map<String, Object>> info(@RequestBody TokenRequest tokenRequest) {
        String token = tokenRequest.getToken();
        UserDto tokenData = jwtToken.parseToken(token);
        Map<String, Object> response =new HashMap<>();
        response.put("userId", tokenData.getUserId());
        response.put("username", tokenData.getUsername());
        response.put("issuedAt", tokenData.getIssuedAt());
        response.put("expiresAt", tokenData.getExpiresAt());
        if (response.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or expired token"));
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/validateToken")
    public ResponseEntity<UserDto> signIn(@RequestParam String token) {
        return ResponseEntity.ok(jwtToken.parseToken(token));
    }

}
