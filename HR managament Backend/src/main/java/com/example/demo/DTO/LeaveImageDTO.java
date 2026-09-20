package com.example.demo.DTO;

import lombok.Data;

@Data
public class LeaveImageDTO {
    
    private Long id;
    private Long leaveRequestId;
    private byte[]images; 
    
}
