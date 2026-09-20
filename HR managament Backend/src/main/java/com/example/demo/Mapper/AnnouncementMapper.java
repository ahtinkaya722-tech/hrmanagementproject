package com.example.demo.Mapper;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.Model.AnnoucementList;

@Mapper 
public interface AnnouncementMapper {
    
    void insertAnnouncement(AnnoucementList a);

}
