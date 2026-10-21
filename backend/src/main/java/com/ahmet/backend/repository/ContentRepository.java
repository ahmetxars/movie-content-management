package com.ahmet.backend.repository;

import com.ahmet.backend.entity.ContentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ContentRepository
        extends
        JpaRepository<ContentEntity, Long>,
        JpaSpecificationExecutor<ContentEntity> {

    boolean existsByTitleIgnoreCaseAndYear(
            String title,
            Integer year
    );


    boolean existsByTitleIgnoreCaseAndYearAndIdNot(
            String title,
            Integer year,
            Long id
    );

}