package com.example.demo.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.Task;
import com.example.demo.Service.TaskService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
@RequestMapping("/api3/")
@RestController
public class TaskController {
    private final TaskService service;


@PostMapping("/addTask")
public ResponseEntity<String> postMethodName(@RequestBody Task task) {

    String result = service.addTask(task);
    if(result.startsWith("You already have")){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(result);
    }

    if(result.equals("Failed to add task.")){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
    
    return ResponseEntity.ok(result);
}



@DeleteMapping("/deleteTasks/{task_id}")
public ResponseEntity<String> deleteTask(@PathVariable int task_id) {

    String result = service.deleteTask(task_id);


    if(result.startsWith("Task deleted successfully.")){
        return ResponseEntity.ok(result);
    }

    if(result.startsWith("Task Not Found")){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
    }
    
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
}


}
