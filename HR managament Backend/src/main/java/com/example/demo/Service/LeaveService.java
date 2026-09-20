package com.example.demo.Service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;

import javax.sql.DataSource;
import java.util.Base64;
import org.springframework.stereotype.Service;

import com.example.demo.DTO.FormData;
import com.example.demo.Mapper.LeaveMapper;
import com.example.demo.Model.LeaveBalance;
import com.example.demo.Model.LeaveRequest;
import com.example.demo.Model.Leave_TypeModel;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class LeaveService {
    
private final LeaveMapper mapper;
private final DataSource source;


public List<Leave_TypeModel> findAllLeaveTypes(){

return mapper.findAllLeaveTypes();

}

public void addLeaveRequest(FormData data) {

    // 1. Insert leave request
    mapper.insertLeaveRequest(data);


    // 2. Find the leave request ID
    String sql = """
        SELECT id AS leave_request_id
        FROM leave_request
        WHERE employee_id = ?
        AND start_date = ?
        ORDER BY id DESC
        LIMIT 1
        """;


    Long leaveRequestId = null;


    try (
        Connection con = source.getConnection();
        PreparedStatement ps = con.prepareStatement(sql)
    ) {

        ps.setLong(
            1,
            data.getEmployeeId()
        );

        ps.setDate(
            2,
            java.sql.Date.valueOf(data.getStartDate())
        );


        ResultSet result = ps.executeQuery();


        if (result.next()) {

            leaveRequestId =
                result.getLong("leave_request_id");

        }


    } catch (Exception e) {

        e.printStackTrace();

    }

if (
    leaveRequestId != null &&
    data.getImages() != null &&
    !data.getImages().isEmpty()
) {

    System.out.println("Image count: " + data.getImages().size());

    for (String base64Image : data.getImages()) {

        System.out.println("Base64 length: " + base64Image.length());

        String imageData = base64Image;

        if (base64Image.contains(",")) {
            imageData = base64Image.split(",", 2)[1];
        }

        byte[] imageBytes =
                Base64.getDecoder().decode(imageData);

        System.out.println("Decoded bytes: " + imageBytes.length);

        LeaveRequest image = new LeaveRequest();

        image.setLeaveRequestId(leaveRequestId);
        image.setImages(imageBytes);

        mapper.insertLeaveImage(image);

        System.out.println("Image inserted!");
    }
}
}

public LeaveBalance getLeaveBalance(Integer id){

    return mapper.getLeaveBalance(id);
}

public List<LeaveRequest> findLeaveRequestByEmployeeId(Integer id){

    return mapper.findLeaveRequestByEmployeeId(id);
}

public List<LeaveRequest>findAllLeaveRequest(){
   
    return mapper.findAllLeaveRequest();
}


public void ApproveLeaveRequest(Integer leaveRequestId){
  mapper.ApproveLeaveRequest(leaveRequestId);
}

}