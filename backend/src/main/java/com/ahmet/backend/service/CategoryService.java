package com.ahmet.backend.service;

import com.ahmet.backend.dto.CategoryRequest;
import com.ahmet.backend.entity.CategoryEntity;
import com.ahmet.backend.entity.ContentEntity;
import com.ahmet.backend.repository.CategoryRepository;
import com.ahmet.backend.repository.ContentRepository;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
public class CategoryService {

    private final CategoryRepository
            categoryRepository;

    private final ContentRepository
            contentRepository;


    public CategoryService(
            CategoryRepository categoryRepository,
            ContentRepository contentRepository
    ) {

        this.categoryRepository =
                categoryRepository;

        this.contentRepository =
                contentRepository;

    }


    public List<CategoryEntity>
    getAllCategories() {

        return categoryRepository
                .findAll(
                        Sort.by(
                                Sort.Direction.ASC,
                                "name"
                        )
                );

    }


    public CategoryEntity
    getCategoryById(
            Long id
    ) {

        return categoryRepository
                .findById(id)
                .orElseThrow(() ->

                        new ResponseStatusException(

                                HttpStatus.NOT_FOUND,

                                "Category not found with id: "
                                        + id

                        )

                );

    }


    public CategoryEntity
    createCategory(
            CategoryRequest request
    ) {

        String name =
                normalizeName(
                        request.getName()
                );


        if (
                categoryRepository
                        .existsByNameIgnoreCase(
                                name
                        )
        ) {

            throw new ResponseStatusException(

                    HttpStatus.CONFLICT,

                    "This category already exists."

            );

        }


        CategoryEntity category =
                CategoryEntity.builder()

                        .name(name)

                        .build();


        return categoryRepository
                .save(
                        category
                );

    }


    public CategoryEntity
    updateCategory(
            Long id,
            CategoryRequest request
    ) {

        CategoryEntity category =
                getCategoryById(id);


        String name =
                normalizeName(
                        request.getName()
                );


        boolean duplicateExists =
                categoryRepository
                        .existsByNameIgnoreCaseAndIdNot(

                                name,

                                id

                        );


        if (duplicateExists) {

            throw new ResponseStatusException(

                    HttpStatus.CONFLICT,

                    "This category already exists."

            );

        }


        category.setName(
                name
        );


        return categoryRepository
                .save(
                        category
                );

    }


    public void deleteCategory(
            Long id
    ) {

        CategoryEntity category =
                getCategoryById(id);


        categoryRepository
                .delete(
                        category
                );

    }


    @Transactional(readOnly = true)
    public List<CategoryEntity>
    getCategoriesForContent(
            Long contentId
    ) {

        ContentEntity content =
                getContent(
                        contentId
                );


        return content
                .getCategories()
                .stream()

                .sorted(
                        Comparator.comparing(
                                CategoryEntity::getName,
                                String.CASE_INSENSITIVE_ORDER
                        )
                )

                .toList();

    }


    @Transactional
    public List<CategoryEntity>
    addCategoryToContent(
            Long contentId,
            Long categoryId
    ) {

        ContentEntity content =
                getContent(
                        contentId
                );

        CategoryEntity category =
                getCategoryById(
                        categoryId
                );


        content
                .getCategories()
                .add(
                        category
                );


        contentRepository
                .save(
                        content
                );


        return content
                .getCategories()
                .stream()

                .sorted(
                        Comparator.comparing(
                                CategoryEntity::getName,
                                String.CASE_INSENSITIVE_ORDER
                        )
                )

                .toList();

    }


    @Transactional
    public List<CategoryEntity>
    removeCategoryFromContent(
            Long contentId,
            Long categoryId
    ) {

        ContentEntity content =
                getContent(
                        contentId
                );


        content
                .getCategories()
                .removeIf(

                        category ->

                                Objects.equals(

                                        category.getId(),

                                        categoryId

                                )

                );


        contentRepository
                .save(
                        content
                );


        return content
                .getCategories()
                .stream()

                .sorted(
                        Comparator.comparing(
                                CategoryEntity::getName,
                                String.CASE_INSENSITIVE_ORDER
                        )
                )

                .toList();

    }


    private ContentEntity
    getContent(
            Long contentId
    ) {

        return contentRepository
                .findById(
                        contentId
                )
                .orElseThrow(() ->

                        new ResponseStatusException(

                                HttpStatus.NOT_FOUND,

                                "Content not found with id: "
                                        + contentId

                        )

                );

    }


    private String normalizeName(
            String name
    ) {

        return name
                .trim()
                .replaceAll(
                        "\\s+",
                        " "
                );

    }

}