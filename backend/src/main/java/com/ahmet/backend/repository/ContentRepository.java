package com.ahmet.backend.repository;

import com.ahmet.backend.entity.ContentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContentRepository
        extends JpaRepository<ContentEntity, Long> {
}