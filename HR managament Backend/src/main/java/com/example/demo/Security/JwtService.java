package com.example.demo.Security;



import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
       
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey geSingInSecretKey(){
       return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(Authentication auth){
        return Jwts.builder().subject(auth.getName()).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+expiration)).signWith(geSingInSecretKey()).compact();
    }

    public String extractUsername(String token){
        return Jwts.parser().verifyWith(geSingInSecretKey()).build().parseSignedClaims(token).getPayload().getSubject();
    }

    private Boolean isTokenExpired(String token){
        Date expirationData= Jwts.parser().verifyWith(geSingInSecretKey()).build().parseSignedClaims(token).getPayload().getExpiration();
        return expirationData.before(new Date());
    }

   

    public boolean validToken(String token,UserDetails userDetails){

        String username = extractUsername(token);
        return username.equals(userDetails.getUsername())&&!isTokenExpired(token);

    }
}