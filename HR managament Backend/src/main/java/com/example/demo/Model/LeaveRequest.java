package com.example.demo.Model;

import java.time.LocalDate;

import lombok.Data;

@Data 
public class LeaveRequest {
    private Long leaveRequestId;
    private String leaveType;
    private byte[] images;
    private  LocalDate startDate;
    private  LocalDate endDate;
    private String status;
    private String reason;
    private String departmentName;
    private String employeeName;

}
