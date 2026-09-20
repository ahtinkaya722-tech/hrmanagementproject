package com.example.demo.Mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;


import com.example.demo.Model.Department;
import com.example.demo.Model.Employee;

@Mapper
public interface DepartmentMapper {
    
    double getTotalDeduction();
    List<Department> departmentNameAndSalary();
    void addDepartment(Department dep);
    List<Department>  getDepartment();
    List<Employee>getEmployeesByDepartmentId(Integer id,Integer month);
    int deletedDepartmentById(Integer id);
}
