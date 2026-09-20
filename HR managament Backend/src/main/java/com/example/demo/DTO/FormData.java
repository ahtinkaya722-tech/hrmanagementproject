package com.example.demo.DTO;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class FormData {

    private Long id;
    private Long employeeId;
    private Long leaveTypeId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private List<String> images;

    // getters and setters
}
