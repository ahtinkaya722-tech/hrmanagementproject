package com.example.demo.Controller;




import java.sql.SQLException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.example.demo.DTO.Login;
import com.example.demo.Model.User;
import com.example.demo.Security.JwtService;
import com.example.demo.Service.EmployeeService;
import com.example.demo.response.LoginResponse;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {


    private final AuthenticationManager authenticationManager;


    private final JwtService jwtService;

    private final EmployeeService service;




//     @PostMapping("/register")
//     public String register(
//             @RequestBody Register request
//     ){
//         return authService.register(request);
//     }



    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody Login request
    )throws SQLException{

        System.out.println("log");
       Authentication auth= authenticationManager.authenticate(

            new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
            )

        );

        UserDetails userDetails =(UserDetails) auth.getPrincipal();
        List<String>roles=userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();

        String  token = jwtService.generateToken(auth);
        User user= service.findUserByEmail(userDetails.getUsername());
            System.out.println(user);
          LoginResponse response =
            new LoginResponse(
                    token,
                    user,
                    roles
            );
            
        
        return  ResponseEntity.ok(response);

    }

}
