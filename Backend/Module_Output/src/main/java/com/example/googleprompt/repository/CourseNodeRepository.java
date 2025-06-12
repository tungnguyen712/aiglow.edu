package com.example.googleprompt.repository;

import com.example.googleprompt.entity.CourseNodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseNodeRepository extends JpaRepository<CourseNodeEntity, String> {
    List<CourseNodeEntity> findByRoadmapId(String roadmapId);
    void deleteByRoadmapId(String roadmapId);
}
