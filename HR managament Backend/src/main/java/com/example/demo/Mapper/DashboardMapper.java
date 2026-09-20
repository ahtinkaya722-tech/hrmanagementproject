package com.example.demo.Mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.Model.AnnoucementList;
import com.example.demo.Model.ChartDTO;


@Mapper
public interface DashboardMapper {
    
    int getTotalEmployee();
    int getTotalPosition();
    int getTotalDepartment();
    int getTotalActivePerson();
    int getTotalInActivePerson();
    List<ChartDTO>getChartData();
    List<AnnoucementList>getAnnouncementLists();
  
}
