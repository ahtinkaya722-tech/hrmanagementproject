package com.example.demo.Controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Payroll;
import com.example.demo.Mapper.EmployeeMapper;
import com.example.demo.Model.Employee;
import com.example.demo.Model.PayrollDTO;
import com.example.demo.Model.PayrollTableDTO;
import com.example.demo.Repo.PayrollRepo;
import com.example.demo.Service.EmployeeService;
import com.example.demo.Service.PayrollService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;




@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api1")
@RequiredArgsConstructor
@RestController
public class PayrollController {
    
    private final PayrollService ps;
  

    @GetMapping("/payrollData")
    public List<PayrollDTO> getPayrollData() {
         List<PayrollDTO> PDTO = ps.getPayrollData();
         
       
        return  PDTO;
    }
       @GetMapping("/payrollTableData")
    public  List<PayrollTableDTO> getPayrollTableData() {
        List<PayrollTableDTO>PDTO_List= new ArrayList<>();
       PDTO_List = ps.getPayrollDataTable();
         
     
        return  PDTO_List;
    }
      @GetMapping("/checkPayroll")
    public  boolean checkPayroll(@RequestParam int month,@RequestParam int year) {
        
        return ps.checkData(month, year);
    }

    @GetMapping("/payrollMissingData")
    public List<Employee> getPayrollMissingData(@RequestParam int month,@RequestParam int year) {
        List<Employee> missingData = ps.getPayrollMissingData(month, year);
        return missingData; 
    }



    @PostMapping("/payroll_generate")
     public String payroll_generate(@RequestParam int month,@RequestParam int year) {
        String result = ps.insertPayrollData(month, year);
        System.out.println(result);

       return result;
    }
    
    

    @PostMapping("/payroll_addMissingData")
     public String payroll_generate(@RequestBody List<Employee> missingData,@RequestParam int month,@RequestParam int year) {
        
        for(Employee e:missingData){
            System.out.println(e.getId());
            ps.insertMissingData(e.getId(), month, year);    
            
        }

       return "Missing Data Added Successfully";
    }
    
    
    
    @GetMapping("/getPDF_Data")
    public String getPDF_Data() {
        return new String();
    }
    
    @PutMapping("/updatePayrollData")
    public String putMethodName(@RequestBody PayrollTableDTO PTDO) {
        
        ps.updatePayrollData(PTDO);
        return "Updata Successfully";
    }

    @DeleteMapping("/deletePayrollData/{id}")
    public String deletePayrollData(@PathVariable int id) {
        ps.deletePayrollData(id);
        return "Delete Successfully";
    }

}
