package com.example.UserService.user;

import com.example.UserService.enums.Role;
import com.example.UserService.exception.AppException;
import com.example.UserService.exception.ErrorCode;
import com.example.UserService.jwt.JwtToken;
import com.example.UserService.payload.AuthenticationResponse;
import com.example.UserService.payload.LoginRequest;
import com.example.UserService.payload.LoginResponse;
import com.mysql.cj.util.StringUtils;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;


@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtToken jwtToken;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserApp registerUser(LoginRequest loginRequest) {
        System.getLogger("Start register user.");
        if(StringUtils.isNullOrEmpty(loginRequest.getEmail())
                && StringUtils.isNullOrEmpty(loginRequest.getPassword()))
            {throw new AppException(ErrorCode.INVALID_USER);}
        if (userRepository.existsByEmail(loginRequest.getEmail()))
            throw new AppException(ErrorCode.USER_EXISTED);

        HashSet<String> roles = new HashSet<>();
        roles.add(Role.USER.name());

        UserApp userApp = new UserApp();
        userApp.setEmail(loginRequest.getEmail());
        String encodedPassword = passwordEncoder.encode(loginRequest.getPassword());
        userApp.setPassword(encodedPassword);
        userApp.setRoles(roles);
        return userRepository.save(userApp);
    }
    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        try {
            UserApp userApp = userRepository.findByEmail(loginRequest.getEmail());
            if (userApp == null || !passwordEncoder.matches(loginRequest.getPassword(), userApp.getPassword())) {
                throw new AppException(ErrorCode.USER_NOT_FOUND);
            }
            String accessToken = jwtToken.generateToken(loginRequest);
            AuthenticationResponse refreshResponse = jwtToken.refreshToken(accessToken);
            String refreshToken = refreshResponse.getToken();
            return new LoginResponse(accessToken, refreshToken);
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_USER);
        }
    }


    @Override
    public List<?> listUser() {
        return userRepository.findAll();
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserApp updateUser(Long id, UserApp user) {
        UserApp userApp = userRepository.findById(id).orElseThrow(
                () -> new UsernameNotFoundException("User Not Found")
        );
        if (userRepository.existsByEmail(user.getEmail()))
            throw new AppException(ErrorCode.USER_EXISTED);

        userApp.setEmail(user.getEmail());
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        userApp.setPassword(encodedPassword);
        userApp.setRoles(user.getRoles());

        return userRepository.save(userApp);
    }


}
