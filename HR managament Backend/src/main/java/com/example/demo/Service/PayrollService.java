package com.example.demo.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Entity.Payroll;
import com.example.demo.Entity.PayrollDeduction;
import com.example.demo.Mapper.PayrollMapper;
import com.example.demo.Model.Employee;
import com.example.demo.Model.PayrollDTO;
import com.example.demo.Model.PayrollTableDTO;
import com.example.demo.Repo.PayrollDeductionRepo;
import com.example.demo.Repo.PayrollRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PayrollService {
    private final PayrollMapper pm;
    private final PayrollRepo pr;
    private final PayrollDeductionRepo pdr;
    private final EmployeeService es;

    public List<PayrollDTO> getPayrollData(){

        return pm.getPayrollData();
    }

    public List<PayrollTableDTO> getPayrollDataTable(){
        return pm.getPayrollTableData();
    }

    public void updatePayrollData(PayrollTableDTO PDTO){
        pm.updatePayrollData(PDTO);
        System.out.println(PDTO.getId());
        pm.updatePayrollDeduction(PDTO);
    }

    public boolean checkData(int month,int year){
            System.out.println(pm.checkData(month, year));
        return   pm.checkData(month, year);
    }

    
    @Transactional
    public String insertPayrollData(int month,int year){
         List<Employee>employees_List= es.getAllEmployees();
        

        for(Employee e:employees_List){
          
            Payroll PDTO= new Payroll();
            PDTO.setEmployeeId(e.getId());
            PDTO.setGrossSalary(e.getSalary());
            PDTO.setMonth(month);
            PDTO.setYear(year);
            PDTO.setStatus("DRAFT");
            PayrollDeduction pd = new PayrollDeduction();
            pd.setInsurance(0);
            pd.setLateDeduction(0);
            pd.setOtherDeduction(0);
            pd.setLeaveDeduction(0);
            pd.setTax(0);
            pd.setPayroll(PDTO);
            PDTO.setDeduction(pd);


            pr.save(PDTO);
            System.out.println("Payroll generated for employee: " + e.getName() + " for month: " + month + " and year: " + year);
        }
       
     
        return"Payroll Generated";

    }

    public String deletePayrollData(int id){
      pm.deletePayrollDeductionData(id);
      pm.deletePayrollData(id);
        return "Deleted Successfully";
    }

    public List<Employee> getPayrollMissingData(int month,int year){
        return pm.getPayrollMissingData(month, year);
    }

    public void insertMissingData(Long employeeId,int month,int year){
        pm.insertMissingData(employeeId, month, year);
        int id = pm.getPayrollId(employeeId, month, year);
        pm.insertPayrollDeductionId(id);
    }
    

}
