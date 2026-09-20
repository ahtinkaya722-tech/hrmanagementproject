package com.example.demo.response;

import java.util.List;

import com.example.demo.Model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
public class LoginResponse {
      private String token;


    private User user;
    private List<String> roles;


}
