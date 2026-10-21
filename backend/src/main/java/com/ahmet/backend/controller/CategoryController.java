package com.ahmet.backend.controller;

import com.ahmet.backend.dto.CategoryRequest;
import com.ahmet.backend.entity.CategoryEntity;
import com.ahmet.backend.service.CategoryService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/*
 * We intentionally keep these endpoints below
 * /api/contents/**.
 *
 * Existing Spring Security rules already protect
 * POST / PUT / DELETE operations in that area
 * for ADMIN users.
 */
@RestController
@RequestMapping("/api/contents")
public class CategoryController {

    private final CategoryService
            categoryService;


    public CategoryController(
            CategoryService categoryService
    ) {

        this.categoryService =
                categoryService;

    }


    @GetMapping("/categories")
    public List<CategoryEntity>
    getCategories() {

        return categoryService
                .getAllCategories();

    }


    @GetMapping("/categories/{id}")
    public CategoryEntity
    getCategory(
            @PathVariable
            Long id
    ) {

        return categoryService
                .getCategoryById(
                        id
                );

    }


    @PostMapping("/categories")
    @ResponseStatus(
            HttpStatus.CREATED
    )
    public CategoryEntity
    createCategory(

            @Valid
            @RequestBody
            CategoryRequest request

    ) {

        return categoryService
                .createCategory(
                        request
                );

    }


    @PutMapping("/categories/{id}")
    public CategoryEntity
    updateCategory(

            @PathVariable
            Long id,

            @Valid
            @RequestBody
            CategoryRequest request

    ) {

        return categoryService
                .updateCategory(
                        id,
                        request
                );

    }


    @DeleteMapping("/categories/{id}")
    @ResponseStatus(
            HttpStatus.NO_CONTENT
    )
    public void deleteCategory(
            @PathVariable
            Long id
    ) {

        categoryService
                .deleteCategory(
                        id
                );

    }


    @GetMapping("/{contentId}/categories")
    public List<CategoryEntity>
    getContentCategories(

            @PathVariable
            Long contentId

    ) {

        return categoryService
                .getCategoriesForContent(
                        contentId
                );

    }


    @PostMapping(
            "/{contentId}/categories/{categoryId}"
    )
    public List<CategoryEntity>
    addCategoryToContent(

            @PathVariable
            Long contentId,

            @PathVariable
            Long categoryId

    ) {

        return categoryService
                .addCategoryToContent(

                        contentId,

                        categoryId

                );

    }


    @DeleteMapping(
            "/{contentId}/categories/{categoryId}"
    )
    public List<CategoryEntity>
    removeCategoryFromContent(

            @PathVariable
            Long contentId,

            @PathVariable
            Long categoryId

    ) {

        return categoryService
                .removeCategoryFromContent(

                        contentId,

                        categoryId

                );

    }

}