package com.example.demo.Model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class User {

    private String username;
    private String password;
    private String nickname;
    private byte[] image;
    private int employeeId;
    private int userId;
    private LocalDateTime updateTime;
    private String role;
    private String status;
}