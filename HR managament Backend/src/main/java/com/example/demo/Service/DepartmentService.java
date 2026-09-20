package com.example.demo.Service;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
 

import com.example.demo.Mapper.DepartmentMapper;
import com.example.demo.Model.Department;
import com.example.demo.Model.DepartmentDTO;
import com.example.demo.Model.Employee;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    
    private final DepartmentMapper dm;

    public DepartmentDTO getDepartmentData(){
        DepartmentDTO ddto= new DepartmentDTO();
        ddto.setTotalNetSalary(dm.getTotalDeduction());
        ddto.setDepartmentNameAndSalary(dm.departmentNameAndSalary());
   
        return ddto;
    }

    public ResponseEntity<String> addDepartment(Department dep){
        List<Department> Department_List = dm.getDepartment();
        String input= dep.getName().replaceAll("\\s", "").toLowerCase();
        for(Department d: Department_List){
            
            String exit=d.getName().replaceAll("\\s", "").toLowerCase();
            if(input.equals(exit)){
                 return ResponseEntity.badRequest().body("Request Name already Exit");
            }

        }

        dm.addDepartment(dep);
        return ResponseEntity.ok().body("Department Added Successfully...");
    }

    public List<Department> getDepartment(){
   
return  dm.getDepartment();
    }
    public List<Employee>getEmployeesByDapartmentById(Integer id,Integer month){
        
        return dm.getEmployeesByDepartmentId(id,month);
    }

    public boolean deletedDepartmentById(Integer id){
         int rows = dm.deletedDepartmentById(id);
         return rows > 0;
    }

}
