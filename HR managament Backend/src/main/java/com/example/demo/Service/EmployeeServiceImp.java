package com.example.demo.Service;

import java.lang.reflect.Array;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.example.demo.Mapper.EmployeeMapper;
import com.example.demo.Model.Department;
import com.example.demo.Model.Employee;
import com.example.demo.Model.MemberTask;
import com.example.demo.Model.NewAccount;
import com.example.demo.Model.Position;
import com.example.demo.Model.Task;
import com.example.demo.Model.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImp implements EmployeeService {
  
        private final DataSource data;
        private final EmployeeMapper employeeMapper;

        @Override
        public void createEmployee(Employee employee) {
            employeeMapper.insert(employee);
        }

        @Override
        public Employee FindById(Long id) {
            return employeeMapper.findById(id);
        }

        @Override
        public void deleteEmployeeByIds(List<Long> ids) {
           employeeMapper.deleteEmployeeByIds(ids);
            
        }



        @Override
        public List<MemberTask> membersForTask() {
           return employeeMapper.membersForTask();
        }

        

        @Override
public List<Task> allmemberTasks() {

    String sql = """
        SELECT 
            ut.id AS taskId,
            ut.user_id AS userId,
            ut.description AS Description,
            ut.report_type AS report_type,
            ut.dueDate AS DueDate,
            ut.timeRange AS TimeRange
        FROM userTask ut
        JOIN user u ON u.id = ut.user_id
        """;

    List<Task> tasks = new ArrayList<>();

    try (
        Connection con = data.getConnection();
        PreparedStatement ps = con.prepareStatement(sql)
    ) {

        ResultSet rs = ps.executeQuery();

        while (rs.next()) {

            Task mb = new Task();

            mb.setTaskId(rs.getInt("taskId"));
            mb.setUserId(rs.getInt("userId"));
            mb.setDescription(rs.getString("Description"));
            mb.setTimeRange(rs.getString("TimeRange"));
            mb.setDueDate(rs.getDate("DueDate").toLocalDate());
            mb.setReport_type(rs.getString("report_type"));

            tasks.add(mb);
        }

    } catch (SQLException e) {
        e.printStackTrace();
    }

    return tasks;
}

        @Override
        public void insertAcc(NewAccount acc) {
                employeeMapper.insertAccount(acc);
        }

        @Override
        public List<Employee> getEmployeesForPosition() {
           
            return employeeMapper.getEmployeesForPosition();
        }

        @Override
        public List<Employee> getAllEmployeesForEmployeePages() {
            
            return employeeMapper.findAllEmployees();
        }

    
                @Override
            public List<Task> getTasksForUser(int userId) {
                String sql = "Select * from userTask where user_id=?";
                List<Task> tasks=new ArrayList<>();
                    try(   Connection con = data.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)){
                    ps.setInt(1,userId );
                    ResultSet rs= ps.executeQuery();
                    while(rs.next()){
                        Task mb= new Task();
                        mb.setTaskId(rs.getInt("id"));
                        mb.setUserId((rs.getInt("user_id")));
                        mb.setDescription(rs.getString("Description"));
                        mb.setTimeRange(rs.getString("timeRange"));
                        mb.setDueDate(rs.getDate("DueDate").toLocalDate());
                        mb.setReport_type(rs.getString("report_type"));
                        tasks.add(mb);
                   
                    }
                    System.out.println(tasks);
                    return tasks;
                    } catch (SQLException e) {
                    e.printStackTrace();
                    }


                    return tasks;
                }

          

@Override
                public void updateUserStatus(User user) {
                  String sql= "UPDATE employee SET status = ? WHERE id =? ";
                    
                 try (
        Connection con = data.getConnection();
        PreparedStatement ps = con.prepareStatement(sql)
                     ) {

       
        
        ps.setString(1,user.getStatus());
        ps.setInt(2, user.getUserId());

        int rows = ps.executeUpdate();

        System.out.println("Updated rows: " + rows);

    } catch (SQLException e) {
        e.printStackTrace();
    }

                    
                }

@Override
public void updateUserProfile(User user) {

    String sql = "UPDATE user SET nickname=?, image=?, update_at=NOW() WHERE id=?";
 
    try (
        Connection con = data.getConnection();
        PreparedStatement ps = con.prepareStatement(sql)
    ) {

        ps.setString(1, user.getNickname());
        ps.setBytes(2, user.getImage());
        ps.setInt(3, user.getUserId());

        int rows = ps.executeUpdate();

        System.out.println("Updated rows: " + rows);

    } catch (SQLException e) {
        e.printStackTrace();
    }
}

        @Override
        public User findUserByEmail(String username) throws SQLException {
            
                String sql = """
        SELECT
            u.id,
            u.username,
            u.password,
            u.role AS role,
            u.employee_id,
            u.nickname,
            u.image,
            e.status,
            u.update_at
        FROM user u
        LEFT JOIN employee e
            ON e.id = u.employee_id
        WHERE u.username = ?
        """;

       
    try (
        Connection con = data.getConnection();
        PreparedStatement ps = con.prepareStatement(sql)
    ) {

        ps.setString(1, username);

        try (ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {

                Timestamp timestamp =
                        rs.getTimestamp("update_at");

                LocalDateTime updateAt =
                        timestamp != null
                                ? timestamp.toLocalDateTime()
                                : null;
                        
                return new User(
                        rs.getString("username"),
                        rs.getString("password"),
                        rs.getString("nickname"),
                        rs.getBytes("image"),
                        rs.getInt("employee_id"),
                        
                        rs.getInt("id"),
                        updateAt,
                        rs.getString("role"),
                        rs.getString("status")
                );
            }
        }
    }
          
            return null;
        }

        @Override
        public List<Department> getDepartments() {
           
            return employeeMapper.getDepartments();
        }



        @Override
        public List<Position> getPositions() {
           
            return employeeMapper.getPositions();
        }



        @Override
        public void deleteEmployee(Long id) {
         
            
        }

        @Override
        public List<Employee> getAllEmployees() {
            return employeeMapper.findAll();
        }

        @Override
        public Employee getEmployeeById(Long id) {
            return employeeMapper.findById(id);
        }

        @Override
        public void updateEmployee(Employee employee) {
            employeeMapper.update(employee);
            
        }

    
}
