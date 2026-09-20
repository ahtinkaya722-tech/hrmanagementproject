package com.example.demo.Model;

import lombok.Data;

@Data
public class DashboardDTO {
    
    private int totalEmployee;
    private int activeEmployee;
    private int inactiveEmployee;
    private int totalDepartment;
    private int totalPosition;
}
