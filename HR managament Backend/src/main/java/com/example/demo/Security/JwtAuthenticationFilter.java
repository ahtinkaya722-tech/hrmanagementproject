package com.example.demo.Security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; 
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{
    
    private final JwtService jwtService;
    private final CustomUserDetailService cuds;


@Override
protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain)
        throws ServletException, IOException {

    String authHeader = request.getHeader("Authorization");

   // System.out.println("====================================");
//System.out.println("REQUEST URL = " + request.getRequestURI());
 //   System.out.println("AUTH HEADER = " + authHeader);

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        System.out.println("NO VALID BEARER HEADER");
        filterChain.doFilter(request, response);
        return;
    }

    String token = authHeader.substring(7).trim();

    if (!hasValidCompactJwtShape(token)) {
        SecurityContextHolder.clearContext();
        filterChain.doFilter(request, response);
        return;
    }

//System.out.println("EXTRACTED TOKEN = " + token);
   // System.out.println(
   //     "DOT COUNT = " + token.chars().filter(c -> c == '.').count()
  //  );

    try {

        String username = jwtService.extractUsername(token);


        UserDetails userDetails =
                cuds.loadUserByUsername(username);

        if (jwtService.validToken(token, userDetails)) {

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

           // System.out.println("JWT VALID");
        } else {
          //  System.out.println("JWT INVALID");
        }

    } catch (JwtException | IllegalArgumentException e) {
        SecurityContextHolder.clearContext();

    }

    filterChain.doFilter(request, response);
}

private boolean hasValidCompactJwtShape(String token) {
    if (token == null || token.isBlank()) {
        return false;
    }

    long dotCount = token.chars().filter(c -> c == '.').count();
    return dotCount == 2 || dotCount == 4;
}
}
