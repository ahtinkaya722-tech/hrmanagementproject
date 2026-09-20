package com.example.demo.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="payroll")
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "gross_salary")
    private double grossSalary;

    private String status;
    private int month;

  
    private int year;

    @OneToOne(mappedBy = "payroll", cascade = CascadeType.ALL)
    private PayrollDeduction deduction;

}
