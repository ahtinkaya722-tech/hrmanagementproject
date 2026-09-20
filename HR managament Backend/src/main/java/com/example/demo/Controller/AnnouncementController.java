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
import com.example.demo.Model.AnnoucementList;
import com.example.demo.Model.LeaveBalance;
import com.example.demo.Model.LeaveRequest;
import com.example.demo.Model.Leave_TypeModel;
import com.example.demo.Service.DashboardService;
import com.example.demo.Service.LeaveService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;



@CrossOrigin(origins="http://localhost:5173")
@RequiredArgsConstructor
@RequestMapping("/api4")
@RestController
public class AnnouncementController {
    
  private final DashboardService service;


 @PostMapping("/addAnnouncement")
 public void addAnnouncement(@RequestBody AnnoucementList a){
     
     
     service.addAnnouncenment(a);
 }
 
}
