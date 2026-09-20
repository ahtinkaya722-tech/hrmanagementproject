package com.example.demo.Mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.Model.Employee;
import com.example.demo.Model.PayrollDTO;
import com.example.demo.Model.PayrollTableDTO;

@Mapper
public interface PayrollMapper {
    
 List<PayrollDTO> getPayrollData();

List<PayrollTableDTO> getPayrollTableData();

void updatePayrollData(PayrollTableDTO PDTO);
void updatePayrollDeduction(PayrollTableDTO PDTO);
void insertPayrollDeductionId(int id);
boolean checkData(int month,int year);
void deletePayrollDeductionData(int id);
void deletePayrollData(int id);
List<Employee>getPayrollMissingData(int month,int year);
void insertMissingData(Long employeeId,int month,int year);
int getPayrollId(Long employeeId,int month,int year);

}
