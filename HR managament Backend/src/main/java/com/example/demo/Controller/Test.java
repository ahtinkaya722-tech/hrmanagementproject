package com.example.demo.Controller;


import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.annotation.RequestScope;

import com.example.demo.Mapper.EmployeeMapper;
import com.example.demo.Model.Employee;
import com.example.demo.Service.EmployeeService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class Test {
    
    @GetMapping("/private")
    public String showTesting(){
        return"You see this because you are authorized";
    }
    

}