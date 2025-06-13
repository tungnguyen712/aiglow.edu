package com.example.googleprompt.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "roadmaps")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapEntity {
    @Id
    private String id;
    private String name;
    private String goal;
    private String userId;
    @Column(name = "due")
    private LocalDate due;
    private Integer hpw;
    @Column(name = "progress")
    private Float progress;
    @Column(name = "status")
    private String status;
    @OneToMany(mappedBy = "roadmap", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<CourseNodeEntity> courseNodes;
}
