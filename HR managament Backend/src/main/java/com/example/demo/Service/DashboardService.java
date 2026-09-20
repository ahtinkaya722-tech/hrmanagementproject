package com.example.demo.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Mapper.AnnouncementMapper;
import com.example.demo.Mapper.DashboardMapper;
import com.example.demo.Model.AnnoucementList;
import com.example.demo.Model.ChartDTO;
import com.example.demo.Model.DashboardDTO;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardMapper dm;
    private final AnnouncementMapper mapper;

    public DashboardDTO getDashboardData(){
        DashboardDTO dto = new DashboardDTO();
        dto.setTotalEmployee(dm.getTotalEmployee());
        dto.setActiveEmployee(dm.getTotalActivePerson());
        dto.setInactiveEmployee(dm.getTotalInActivePerson());
        dto.setTotalDepartment(dm.getTotalDepartment());
        dto.setTotalPosition(dm.getTotalPosition());
        
        return dto;
    }

    public List<ChartDTO>getChartData(){
       
        return dm.getChartData();
    }

    public List<AnnoucementList>getAnnouncementLists(){
           
        return dm.getAnnouncementLists();
    }

    public void addAnnouncenment(AnnoucementList a){
        mapper.insertAnnouncement(a); 
    }
}
