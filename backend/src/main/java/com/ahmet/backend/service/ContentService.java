package com.ahmet.backend.service;

import com.ahmet.backend.client.OmdbClient;
import com.ahmet.backend.dto.OmdbMovieDto;
import com.ahmet.backend.entity.ContentEntity;
import com.ahmet.backend.exception.ContentNotFoundException;
import com.ahmet.backend.exception.MovieNotFoundException;
import com.ahmet.backend.repository.ContentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContentService {

    private final ContentRepository contentRepository;
    private final OmdbClient omdbClient;

    public ContentService(
            ContentRepository contentRepository,
            OmdbClient omdbClient
    ) {
        this.contentRepository = contentRepository;
        this.omdbClient = omdbClient;
    }

    public List<ContentEntity> getAllContents() {
        return contentRepository.findAll();
    }

    public ContentEntity getContentById(Long id) {

        return contentRepository.findById(id)
                .orElseThrow(() ->
                        new ContentNotFoundException(
                                "Content not found with id: " + id
                        )
                );
    }

    public ContentEntity createContent(ContentEntity content) {
        return contentRepository.save(content);
    }

    public ContentEntity updateContent(
            Long id,
            ContentEntity updatedContent
    ) {

        ContentEntity existingContent =
                getContentById(id);

        existingContent.setTitle(
                updatedContent.getTitle()
        );

        existingContent.setYear(
                updatedContent.getYear()
        );

        existingContent.setGenre(
                updatedContent.getGenre()
        );

        existingContent.setRating(
                updatedContent.getRating()
        );

        existingContent.setPlot(
                updatedContent.getPlot()
        );

        existingContent.setPoster(
                updatedContent.getPoster()
        );

        existingContent.setDirector(
                updatedContent.getDirector()
        );

        return contentRepository.save(existingContent);
    }

    public void deleteContent(Long id) {

        ContentEntity content =
                getContentById(id);

        contentRepository.delete(content);
    }

    public OmdbMovieDto searchMovie(String title) {

        OmdbMovieDto movie =
                omdbClient.getMovieByTitle(title);

        if (
                movie == null ||
                        "False".equalsIgnoreCase(movie.getResponse())
        ) {

            throw new MovieNotFoundException(
                    "Movie not found: " + title
            );
        }

        return movie;
    }

    public ContentEntity importMovieFromOmdb(
            String title
    ) {

        OmdbMovieDto movie =
                searchMovie(title);

        ContentEntity content =
                ContentEntity.builder()
                        .title(movie.getTitle())
                        .year(parseYear(movie.getYear()))
                        .genre(movie.getGenre())
                        .rating(parseRating(
                                movie.getImdbRating()
                        ))
                        .plot(movie.getPlot())
                        .poster(movie.getPoster())
                        .director(movie.getDirector())
                        .build();

        return contentRepository.save(content);
    }

    private Integer parseYear(String year) {

        try {

            String firstYear =
                    year.split("–")[0]
                            .split("-")[0];

            return Integer.parseInt(firstYear);

        } catch (Exception e) {

            return null;
        }
    }

    private Double parseRating(String rating) {

        try {
            return Double.parseDouble(rating);
        } catch (Exception e) {
            return null;
        }
    }
}