package com.example.demo.Config;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class Resttemplate {
    public static void main(String[] args) {
        System.out.println("Hello World");
        String url = "http://localhost:8080/employee/single?id={id}";
        HttpHeaders headers = new HttpHeaders();
        headers.add("accept",MediaType.APPLICATION_XML_VALUE);
        ResponseEntity<String>response=new RestTemplate().exchange(url, HttpMethod.GET, new HttpEntity<>(headers), String.class,2);
        System.out.println(response.getBody());

    }
}
