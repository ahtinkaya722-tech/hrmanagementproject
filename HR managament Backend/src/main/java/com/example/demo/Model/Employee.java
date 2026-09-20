package com.example.demo.Model;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

import lombok.Data;

@Data
@JacksonXmlRootElement
public class Employee {
    private Long id;
    private String name;
    private String username;
    private String password;
    private String email;
    private String acc;
    private String role;
    private String phone;
    private String departmentName;
    private String positionTitle;
    private Long departmentId;
    private Long positionId;
    private String status;
    private double salary;
    private double total_department_salary;
    private int month;
      
}
