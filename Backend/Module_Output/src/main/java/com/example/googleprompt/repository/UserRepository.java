package com.example.googleprompt.repository;

import com.example.googleprompt.entity.UserEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, String> {
    @EntityGraph(attributePaths = "certs")
    Optional<UserEntity> findById(String id);
}
