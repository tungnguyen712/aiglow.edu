package com.example.UserService.jwt;

import com.example.UserService.exception.AppException;
import com.example.UserService.exception.ErrorCode;
import com.example.UserService.payload.AuthenticationResponse;
import com.example.UserService.payload.LoginRequest;
import com.example.UserService.user.*;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import io.jsonwebtoken.*;
import io.jsonwebtoken.impl.TextCodec;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.temporal.ChronoUnit;
import java.util.*;


@Component
@Slf4j
public class JwtToken {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InvalidatedTokenRepository invalidatedTokenRepository;
    private final String SECRET_KEY = "DSH2T_DSH2T_DSH2T_DSH2T_DSH2T_DSH2T_DSH2T_DSH2T_DSH2T_DSH2T";
    private final long EXPIRATION_TIME = 604800000L;

    protected long REFRESHABLE_DURATION = 604800000L;
    public String generateToken(LoginRequest loginRequest){
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);
        UserApp userApp = userRepository.findByEmail(loginRequest.getEmail());
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(userApp.getEmail())
                .issueTime(now)
                .expirationTime(expiryDate)
                .claim("userId", userApp.getId())
                .claim("scope",buildScope(userApp))
                .jwtID(UUID.randomUUID().toString())
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader,payload);
        var key = TextCodec.BASE64.decode(SECRET_KEY);
        var paddedKey = key.length < 128 ? Arrays.copyOf(key, 128) : key;
        try {
            jwsObject.sign(new MACSigner(paddedKey));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create jwt");
            throw new RuntimeException(e);
        }
    }

    public String buildScope(UserApp userApp){
        StringJoiner stringJoiner = new StringJoiner(" ");
        if(!CollectionUtils.isEmpty(userApp.getRoles()))
            userApp.getRoles().forEach(stringJoiner::add);
        return stringJoiner.toString();
    }

    public String getEmailFromJWT(String token){
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String authToken) throws JOSEException, ParseException {
        var key = TextCodec.BASE64.decode(SECRET_KEY);
        var paddedKey = key.length < 128 ? Arrays.copyOf(key, 128) : key;
        JWSVerifier verifier = new MACVerifier(paddedKey);

        SignedJWT signedJWT = SignedJWT.parse(authToken);

        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        return signedJWT.verify(verifier) && expiryTime.after(new Date());
    }

    public AuthenticationResponse refreshToken(String tokenRequest) throws ParseException, JOSEException {
        var signedJWT = verifyToken(tokenRequest, true);

        var jit = signedJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken =
                InvalidatedToken.builder().id(jit).expiryTime(expiryTime).build();

        invalidatedTokenRepository.save(invalidatedToken);

        var username = signedJWT.getJWTClaimsSet().getSubject();

        var user =
                userRepository.findByEmail(username);
        LoginRequest userLogin = new LoginRequest();
        userLogin.setEmail(user.getEmail());
        userLogin.setPassword(user.getPassword());
        var token = generateToken(userLogin);

        return AuthenticationResponse.builder().token(token).build();
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        var key = TextCodec.BASE64.decode(SECRET_KEY);
        var paddedKey = key.length < 128 ? Arrays.copyOf(key, 128) : key;
        JWSVerifier verifier = new MACVerifier(paddedKey);

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);
        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }

    public UserDto parseToken(String token) {
        UserDto userDto = new UserDto();
        try {
            var key = TextCodec.BASE64.decode(SECRET_KEY);
            var paddedKey = key.length < 128 ? Arrays.copyOf(key, 128) : key;
            SignedJWT signedJWT = SignedJWT.parse(token);

            if (signedJWT.verify(new MACVerifier(paddedKey))) {
                JWTClaimsSet claimsSet = signedJWT.getJWTClaimsSet();

//                claimsMap.put("username", claimsSet.getSubject());
//                claimsMap.put("roles", claimsSet.getStringClaim("scope"));
//                claimsMap.put("userId", claimsSet.getClaim("userId"));
//                claimsMap.put("issuedAt", claimsSet.getIssueTime());
//                claimsMap.put("expiresAt", claimsSet.getExpirationTime());
                userDto.setUserId((Long) claimsSet.getClaim("userId"));
                userDto.setUsername(claimsSet.getSubject());
                userDto.setRoles(claimsSet.getStringClaim("scope"));
                userDto.setIssuedAt(claimsSet.getIssueTime().toString());
                userDto.setExpiresAt(claimsSet.getExpirationTime().toString());
            }
        } catch (Exception e) {
            log.error("Error parsing token: {}", e.getMessage());
        }
        return userDto;
    }
}
