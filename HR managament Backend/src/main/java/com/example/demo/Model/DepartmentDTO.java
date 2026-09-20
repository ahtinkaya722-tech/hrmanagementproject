package com.example.demo.Model;

import java.util.List;

import lombok.Data;

@Data
public class DepartmentDTO {
    
    private List<Department> departmentNameAndSalary;

    private double totalNetSalary;
}
