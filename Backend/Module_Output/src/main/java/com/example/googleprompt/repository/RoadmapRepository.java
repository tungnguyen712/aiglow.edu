package com.example.googleprompt.repository;

import com.example.googleprompt.entity.RoadmapEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapRepository extends JpaRepository<RoadmapEntity, String> {
    @Query("SELECT r FROM RoadmapEntity r WHERE r.userId = :userId")
    List<RoadmapEntity> getAllByUserId(@Param("userId") String userId);

    @Query("SELECT r from RoadmapEntity r where r.id = :id")
    RoadmapEntity getById(@Param("id") String id);
}
