package com.example.demo.Mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.DTO.FormData;
import com.example.demo.DTO.LeaveImageDTO;
import com.example.demo.Model.LeaveBalance;
import com.example.demo.Model.LeaveRequest;
import com.example.demo.Model.Leave_TypeModel;

@Mapper
public interface LeaveMapper {
    List<Leave_TypeModel> findAllLeaveTypes();
    void insertLeaveRequest(FormData data);
    void insertLeaveMedicalImage(LeaveImageDTO data);
    LeaveBalance getLeaveBalance(Integer employeeId); 
    void insertLeaveImage(LeaveRequest image);
    List<LeaveRequest>findLeaveRequestByEmployeeId(Integer id);
    List<LeaveRequest>findAllLeaveRequest();
    void ApproveLeaveRequest(Integer leaveRequestId);

}
