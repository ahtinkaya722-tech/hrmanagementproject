package com.example.demo.Security;


import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;


import com.example.demo.Mapper.EmployeeMapper;
import com.example.demo.Model.Employee;


import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    
   private final EmployeeMapper emp;


 
    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {


        Employee user = emp.findByUsername(email);
        if(user==null){
            throw new UsernameNotFoundException("User not found");
        }


        return org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(
                    user.getRole()
                )
                .build();

    }

}
