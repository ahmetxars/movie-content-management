package com.ahmet.backend.controller;

import com.ahmet.backend.dto.OmdbMovieDto;
import com.ahmet.backend.entity.ContentEntity;
import com.ahmet.backend.service.ContentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contents")
public class ContentController {

    private final ContentService contentService;

    public ContentController(
            ContentService contentService
    ) {
        this.contentService = contentService;
    }

    @GetMapping
    public List<ContentEntity> getAllContents() {
        return contentService.getAllContents();
    }

    @GetMapping("/{id}")
    public ContentEntity getContentById(
            @PathVariable Long id
    ) {
        return contentService.getContentById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContentEntity createContent(
            @RequestBody ContentEntity content
    ) {
        return contentService.createContent(content);
    }

    @PutMapping("/{id}")
    public ContentEntity updateContent(
            @PathVariable Long id,
            @RequestBody ContentEntity content
    ) {

        return contentService.updateContent(
                id,
                content
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteContent(
            @PathVariable Long id
    ) {

        contentService.deleteContent(id);
    }

    @GetMapping("/search")
    public OmdbMovieDto searchMovie(
            @RequestParam(name = "title")
            String title
    ) {

        return contentService.searchMovie(title);
    }

    @PostMapping("/import")
    @ResponseStatus(HttpStatus.CREATED)
    public ContentEntity importMovie(
            @RequestParam(name = "title")
            String title
    ) {

        return contentService
                .importMovieFromOmdb(title);
    }
}