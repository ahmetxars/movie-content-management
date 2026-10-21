package com.ahmet.backend.controller;

import com.ahmet.backend.dto.CreateContentRequest;
import com.ahmet.backend.dto.OmdbMovieDto;
import com.ahmet.backend.dto.PageResponse;
import com.ahmet.backend.dto.UpdateContentRequest;
import com.ahmet.backend.entity.ContentEntity;
import com.ahmet.backend.service.ContentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contents")
public class ContentController {

    private final ContentService
            contentService;


    public ContentController(
            ContentService contentService
    ) {

        this.contentService =
                contentService;

    }


    @GetMapping
    public List<ContentEntity>
    getAllContents() {

        return contentService
                .getAllContents();

    }


    @GetMapping("/page")
    public PageResponse<ContentEntity>
    getContentsPage(

            @RequestParam(
                    defaultValue = ""
            )
            String title,

            @RequestParam(
                    defaultValue = ""
            )
            String genre,

            @RequestParam(
                    required = false
            )
            Double minRating,

            @RequestParam(
                    defaultValue = "0"
            )
            int page,

            @RequestParam(
                    defaultValue = "6"
            )
            int size,

            @RequestParam(
                    defaultValue = "createdAt"
            )
            String sortBy,

            @RequestParam(
                    defaultValue = "desc"
            )
            String sortDir

    ) {

        return PageResponse.from(

                contentService.searchContents(

                        title,

                        genre,

                        minRating,

                        page,

                        size,

                        sortBy,

                        sortDir

                )

        );

    }


    @GetMapping("/{id}")
    public ContentEntity
    getContentById(
            @PathVariable
            Long id
    ) {

        return contentService
                .getContentById(id);

    }


    @PostMapping
    @ResponseStatus(
            HttpStatus.CREATED
    )
    public ContentEntity
    createContent(

            @Valid
            @RequestBody
            CreateContentRequest request

    ) {

        return contentService
                .createContent(request);

    }


    @PutMapping("/{id}")
    public ContentEntity
    updateContent(

            @PathVariable
            Long id,

            @Valid
            @RequestBody
            UpdateContentRequest request

    ) {

        return contentService
                .updateContent(
                        id,
                        request
                );

    }


    @DeleteMapping("/{id}")
    @ResponseStatus(
            HttpStatus.NO_CONTENT
    )
    public void deleteContent(
            @PathVariable
            Long id
    ) {

        contentService
                .deleteContent(id);

    }


    @GetMapping("/search")
    public OmdbMovieDto searchMovie(

            @RequestParam(
                    name = "title"
            )
            String title

    ) {

        return contentService
                .searchMovie(title);

    }


    @PostMapping("/import")
    @ResponseStatus(
            HttpStatus.CREATED
    )
    public ContentEntity importMovie(

            @RequestParam(
                    name = "title"
            )
            String title

    ) {

        return contentService
                .importMovieFromOmdb(
                        title
                );

    }

}