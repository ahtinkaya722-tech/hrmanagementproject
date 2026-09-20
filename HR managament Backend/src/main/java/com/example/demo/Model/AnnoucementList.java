package com.example.demo.Model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AnnoucementList {
     private String title;
     private String content;
    private  LocalDate createdTime; 
}
