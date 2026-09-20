package com.example.demo.Service;

import java.sql.SQLException;
import java.util.List;


import com.example.demo.Model.Department;
import com.example.demo.Model.Employee;
import com.example.demo.Model.MemberTask;
import com.example.demo.Model.NewAccount;
import com.example.demo.Model.Position;
import com.example.demo.Model.Task;
import com.example.demo.Model.User;


public interface EmployeeService {

    
     List<Employee> getAllEmployees();

    Employee getEmployeeById(Long id);
    
    void createEmployee(Employee employee);

    void updateEmployee(Employee employee);
void deleteEmployeeByIds(List<Long>ids);
    void deleteEmployee(Long id);
    List<Employee>getAllEmployeesForEmployeePages();
    List<Position>getPositions();
    List<Department>getDepartments();
    Employee FindById(Long id);
    List<Employee>getEmployeesForPosition();
    void insertAcc(NewAccount acc);
     List<MemberTask>membersForTask();
    List<Task> allmemberTasks();
    User findUserByEmail(String username)throws SQLException;
    void updateUserProfile(User user)throws SQLException;
    List<Task>getTasksForUser(int userId);
    void updateUserStatus(User user);

}   
