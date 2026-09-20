package com.example.demo.Model;

import lombok.Data;

@Data
public class PayrollDTO {
  private  int totalEmployees;
    private double totalNetSalary;
    private double totalDeduction;
    private double totalGross;
    private double pending;
    private int month;
    private int year;

}
