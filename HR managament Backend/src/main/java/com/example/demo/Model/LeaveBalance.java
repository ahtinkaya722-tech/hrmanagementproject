package com.example.demo.Model;

import lombok.Data;

@Data 
public class LeaveBalance {
    
    private int totalAvailableDay;
    private int usedLeave;
    private int remainingDay;

}
