package com.ahmet.backend.repository;

import com.ahmet.backend.entity.ActorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActorRepository
        extends JpaRepository<
        ActorEntity,
        Long
        > {
}