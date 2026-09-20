package com.example.demo.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomePageController {
  
@GetMapping("/homepage")
public String getHome(){
return "HomePage";
}

}
