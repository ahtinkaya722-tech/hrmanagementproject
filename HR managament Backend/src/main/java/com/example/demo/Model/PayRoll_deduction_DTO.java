package com.example.demo.Model;

import lombok.Data;

@Data
public class PayRoll_deduction_DTO {
    
    private double other_deductions;
    private double tax;
    private double insurance;
    private double late_deduction;
    private double leave_deduction;

}
