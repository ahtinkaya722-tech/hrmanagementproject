package com.example.demo.Model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Task {

    private String TimeRange;
    private int taskId;
    private int userId;
    private String Description;
    private LocalDate DueDate;
    private String report_type;
    private LocalDateTime update_at;

}
