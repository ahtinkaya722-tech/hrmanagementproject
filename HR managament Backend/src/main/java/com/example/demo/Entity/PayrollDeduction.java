package com.example.demo.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "payroll_deduction")
public class PayrollDeduction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    private double tax;

    private double insurance;

    @Column(name = "leave_deduction")
    private double leaveDeduction;

    @Column(name = "late_deduction")
    private double lateDeduction;

    @Column(name = "other_deduction")
    private double otherDeduction;


    @OneToOne
    @JoinColumn(name = "payroll_id")
    private Payroll payroll;

}
