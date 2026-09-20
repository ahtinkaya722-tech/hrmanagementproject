package com.example.demo.Config;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.example.demo.Security.CustomUserDetailService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CoustomerAuthProvider 
        implements AuthenticationProvider {

    private final CustomUserDetailService userDetailsService;

    @Override
    public Authentication authenticate(
            Authentication authentication)
            throws AuthenticationException {

        String username = authentication.getName();

        String password =
                authentication.getCredentials().toString();

        UserDetails user =
                userDetailsService.loadUserByUsername(username);

        // Plain text password comparison
        if (!user.getPassword().equals(password)) {

            throw new BadCredentialsException(
                    "Invalid username or password"
            );
        }

        return new UsernamePasswordAuthenticationToken(
                user,
                null,
                user.getAuthorities()
        );
    }

    @Override
    public boolean supports(
            Class<?> authentication) {

        return UsernamePasswordAuthenticationToken.class
                .isAssignableFrom(authentication);
    }
}