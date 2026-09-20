package com.example.demo.Model;

import java.util.List;

import lombok.Data;

@Data 
public class Leave_TypeModel {
    
    private long id;
    private String leaveTypeName;
    private int totalDays;
    private List<String>images;

}
