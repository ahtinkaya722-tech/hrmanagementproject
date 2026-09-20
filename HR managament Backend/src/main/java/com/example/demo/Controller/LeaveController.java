package com.example.demo.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DTO.FormData;
import com.example.demo.Model.LeaveBalance;
import com.example.demo.Model.LeaveRequest;
import com.example.demo.Model.Leave_TypeModel;
import com.example.demo.Service.LeaveService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;



@CrossOrigin(origins="http://localhost:5173")
@RequiredArgsConstructor
@RequestMapping("/api3")
@RestController
public class LeaveController {
    
  private final LeaveService service;

    @GetMapping("/requestLeaveType")
      public List<Leave_TypeModel> getrequestLeaveType() {
        return service.findAllLeaveTypes();
    }


    @PostMapping("/addLeaveForm")
    public ResponseEntity<String> addLeaveForm(@RequestBody FormData data) {
      
        service.addLeaveRequest(data);
        return ResponseEntity.status(HttpStatus.CREATED).body("Leave request submitted successfully");
    }

    @GetMapping("/leaveBalance")
    public ResponseEntity<LeaveBalance> getLeaveBalance(@RequestParam int employeeId) {

        return  ResponseEntity.ok(service.getLeaveBalance(employeeId)) ;
    }
    


    @GetMapping("/findLeaveRequestByEmployeeId")
    public List<LeaveRequest> getLeaveRequestByEmployeeId(@RequestParam Integer employeeId) {
   
        return service.findLeaveRequestByEmployeeId(employeeId);
    }
    
     @GetMapping("/findAllLeaveRequest")
    public List<LeaveRequest> getALlLeaveRequest() {
      
        return service.findAllLeaveRequest();
    }

    @PutMapping("/ApproveLeaveRequest")
    public void ApproveLeaveRequest(@RequestParam Integer leaveRequestId) {
        service.ApproveLeaveRequest(leaveRequestId); 
      
    }
}
