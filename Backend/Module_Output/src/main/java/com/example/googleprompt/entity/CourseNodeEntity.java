package com.example.googleprompt.entity;

import com.example.googleprompt.util.StringListConverter;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="course_nodes")
public class CourseNodeEntity {
    @Id
    private String id;
    private String name;
    private String link;
    @Column(name = "status")
    private String status;  // Ví dụ: "finished" hoặc "unfinished"
    private Integer avgTimeToFinish;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roadmap_id")
    @JsonBackReference
    private RoadmapEntity roadmap;

    @Column(name = "child_ids")
    private String childIds;

}
