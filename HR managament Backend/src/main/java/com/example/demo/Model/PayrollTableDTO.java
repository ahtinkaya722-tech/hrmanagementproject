package com.example.demo.Model;

import java.time.LocalDate;

import lombok.Data;

@Data
public class PayrollTableDTO {
   private String employeeName;
   private String departmentName;
   private String positionName;
   private double grossSalary;
   private double deductionAmount;
   private double netSalary;
   private String status;
   private LocalDate paymentDate;
    private double otherDeductions;
    private double tax;
    private double insurance;
    private double lateDeduction;
    private double leaveDeduction;
    private int month;
    private int year;
    private int id;

}
