package com.example.demo;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.demo.Mapper.PayrollMapper;
import com.example.demo.Model.Employee;
import com.example.demo.Service.PayrollService;

@SpringBootTest
public class PayrollServiceTest {

    @Autowired
    private PayrollService ps;
    @Autowired
    private PayrollMapper pm;

    @Test
    void InsertMissingData(){
        List<Employee>employeeList=ps.getPayrollMissingData(7, 2026);
        System.out.println(employeeList);
        for(Employee e:employeeList){
        pm.insertMissingData(e.getId(), 7, 2026);

        int id = pm.getPayrollId(e.getId(), 7, 2026);
         if(id > 0) {
        System.out.println("Insert Successful");
        System.out.println("Payroll ID: " + id);
        pm.insertPayrollDeductionId(id);

    } else {
        System.out.println("Insert Failed");
    }            


         
}

         
       // int id = pm.getPayrollId(null, 0, 0)
    }
    
}
