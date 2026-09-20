package com.example.demo.Repo;
import com.example.demo.Entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PayrollRepo extends JpaRepository<Payroll,Long> {

}