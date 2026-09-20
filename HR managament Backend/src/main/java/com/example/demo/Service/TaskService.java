package com.example.demo.Service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.example.demo.Model.Task;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class TaskService {

    private final DataSource data;

       public String checktask(Task task){
        
        String sql = """
            SELECT COUNT(*)
            FROM userTask
            WHERE user_id = ?
              AND dueDate = ?
              AND report_type = ?
            """;


            try(Connection con = data.getConnection();
        PreparedStatement ps = con.prepareStatement(sql)){

            ps.setInt(1,task.getUserId());
            ps.setDate(2, java.sql.Date.valueOf(task.getDueDate()));
            ps.setString(3,task.getReport_type());
           ResultSet rs =  ps.executeQuery();
           if(rs.next()&&rs.getInt(1)>0){
                  return "You already have a " 
                        + task.getReport_type()
                        + " report for this day.";
           }
 
            }catch (SQLException e) {
            e.printStackTrace();
            return "Database error";
        }
             return null;

    }
    public String addTask(Task task){
      String checkTask= checktask(task);
   
   
      if(checkTask!=null){
        return checkTask;
    }
      
    String sql= "insert into userTask(description,dueDate,timeRange,user_id,report_type,update_at)values(?,?,?,?,?,NOW())";

    try( Connection con = data.getConnection();
        PreparedStatement ps = con.prepareStatement(sql)){
        ps.setString(1, task.getDescription());
        ps.setDate(2, java.sql.Date.valueOf(task.getDueDate()) );
        ps.setString(3, task.getTimeRange());
        ps.setInt(4,task.getUserId());
        ps.setString(5, task.getReport_type());
        ps.executeUpdate();
        
            return "Task added successfully.";
        

    } catch (SQLException e) {
    e.printStackTrace();
    return "Failed to add task.";
    }


    }

    public String deleteTask(int task_id){

        String sql= "delete from userTask where id =?";
         try( Connection con = data.getConnection();
        PreparedStatement ps = con.prepareStatement(sql)){
     
        ps.setInt(1,task_id);
    
     int rows = ps.executeUpdate();

        if (rows > 0) {
            return "Task deleted successfully.";
        }
        return "Task Not Found";
    } catch (SQLException e) {
    e.printStackTrace();
    return "Failed to delete task.";
    }

    
  
}
}
