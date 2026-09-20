package com.example.demo.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.Department;
import com.example.demo.Model.DepartmentDTO;
import com.example.demo.Model.Employee;
import com.example.demo.Service.DepartmentService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;





@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api2")
public class DepartmentController {

  private final  DepartmentService ds;

    @GetMapping("/AllDepartmentsData")
    public DepartmentDTO getMethodName() {
        return ds.getDepartmentData();
    }

@PostMapping("/addDepartment")
public ResponseEntity<String> postMethodName(@RequestBody Department dep) {
    
    return   ds.addDepartment(dep);
}

@GetMapping("/getDepartment")
public List< Department> getDepartment() {
    
    return ds.getDepartment();
}

@GetMapping("/departmentById")
public List< Employee> getDepartmentById(@RequestParam Integer id,@RequestParam Integer month) {


    return ds.getEmployeesByDapartmentById(id,month);
}

@DeleteMapping("/deleteDepartmentById")
public ResponseEntity<?> postMethodName(@RequestParam Integer id) {
    boolean deleted = ds.deletedDepartmentById(id);
    if(deleted){
          return ResponseEntity.ok(
            Map.of(
                "success", true,
                "message", "Department deleted successfully"
            )
        );
    }

      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
        Map.of(
            "success", false,
            "message", "Department not found"
        )
    );
}

    
}
