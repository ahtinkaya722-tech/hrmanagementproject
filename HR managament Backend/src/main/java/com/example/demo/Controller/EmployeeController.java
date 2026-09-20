package com.example.demo.Controller;


import java.sql.SQLException;
import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.AnnoucementList;
import com.example.demo.Model.ChartDTO;
import com.example.demo.Model.DashboardDTO;
import com.example.demo.Model.Department;
import com.example.demo.Model.Employee;
import com.example.demo.Model.MemberTask;
import com.example.demo.Model.NewAccount;
import com.example.demo.Model.Position;
import com.example.demo.Model.Task;
import com.example.demo.Model.User;
import com.example.demo.Service.DashboardService;
import com.example.demo.Service.EmployeeService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@CrossOrigin(origins="http://localhost:5173")
@RequiredArgsConstructor
@RequestMapping("/api")
@RestController
public class EmployeeController {
    
private final DashboardService ds;
private final EmployeeService service;

@GetMapping("/findAllEmployees")
public List<Employee> findAllEmployees() {
    
    return service.getAllEmployees();
}

@GetMapping("/findEmployeesForPosition")
public List<Employee> findEmployeesForPosition() {
   
    return service.getEmployeesForPosition() ;
}
@GetMapping("/membersForTask")
public List<MemberTask> membersForTask() {
  
    return service.membersForTask() ;
}
@GetMapping("/getTasksForUser")
public List<Task> getTasksForTask(@RequestParam int userId) {
   
    return service.getTasksForUser(userId);
}



@GetMapping("/membersTask")
public List<Task> membersTask() {

    return service.allmemberTasks() ;
}

@PatchMapping("/updateUserInfo")
public User updateUser(@RequestBody User user) throws SQLException{
    service.updateUserProfile(user);
    
    return service.findUserByEmail(user.getUsername());
}

@PatchMapping("/updateUserStatus")
public void updateUserStatus(@RequestBody User user) {
    
   service.updateUserStatus(user);
    
}

@GetMapping("/findAllAnnouncementLists")
public List<AnnoucementList> findAllLists() {

    return ds.getAnnouncementLists();
}

@GetMapping("/Dashboards")
public DashboardDTO findDashboardData() {
    
   
    return ds.getDashboardData();
}

@GetMapping("/charts")
public List<ChartDTO> findChart() {
    

    return ds.getChartData();
}

@GetMapping("/findAllEmployees2")
public List<Employee> getAllEmployees() {
    
    return service.getAllEmployeesForEmployeePages();
}


@GetMapping("/findDepartments")
public List<Department> getDepartments() {
      
    return service.getDepartments();
}
@GetMapping("/findPositions")
public List<Position> getPositions() {
      
    return service.getPositions();
}

@PostMapping("/addEmployee") 
public ResponseEntity<String> AddEmployee(@RequestBody Employee emp) {
     service.createEmployee(emp);
  
     return ResponseEntity.status(201).body("Employee added");
}

@PostMapping("/createAccount")
public ResponseEntity<String> AccAccount(@RequestBody NewAccount emp) {
   
    try {
        service.insertAcc(emp);
        return ResponseEntity.ok("Account Created");
    } catch (Exception e) {
         return ResponseEntity
        .badRequest()
        .body(e.getMessage());
    }
  
}


@DeleteMapping("/deleteEmployeesById")
public ResponseEntity<String> DeleteEmployeesById(@RequestBody List<Long>ids) {

      try {
        service.deleteEmployeeByIds(ids);
        return ResponseEntity.ok("Employees deleted successfully");
    } catch (Exception e) {
        return ResponseEntity.status(500)
                .body("Delete failed: " + e.getMessage());
    }
   

}

@PutMapping("/updateEmployee")
public   ResponseEntity<String>  updateEmployee(@RequestBody Employee emp) {
     try {
       service.updateEmployee(emp);
    return ResponseEntity.ok("Employees Updated successfully");
    } catch (Exception e) {
        return ResponseEntity.status(500)
                .body("Updated failed: " + e.getMessage());
    }
   
    
    
}

}