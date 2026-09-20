package com.example.demo.Mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.Model.Department;
import com.example.demo.Model.Employee;
import com.example.demo.Model.MemberTask;
import com.example.demo.Model.NewAccount;
import com.example.demo.Model.Position;
import com.example.demo.Model.Task;

@Mapper
public interface EmployeeMapper {

    List<Employee> findAll();

    Employee findById(Long id);
    
      void insert(Employee employee);

    void update(Employee employee);
    void deleteEmployeeByIds(List<Long>ids);
    void delete(Long id);
    
    List<Employee> findAllEmployees();
        List<Position>getPositions();
    List<Department>getDepartments();
      List<Employee>getEmployeesForPosition();
      void insertAccount(NewAccount acc);
      Employee exitUsername(String username);
      Employee findByUsername(String username);
      Employee findByEmployeeId(Integer employeeId);
     List<MemberTask>membersForTask();
     List<Task> allmemberTasks();

}
