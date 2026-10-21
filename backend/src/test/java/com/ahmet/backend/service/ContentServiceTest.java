package com.ahmet.backend.service;

import com.ahmet.backend.client.OmdbClient;
import com.ahmet.backend.dto.CreateContentRequest;
import com.ahmet.backend.dto.OmdbMovieDto;
import com.ahmet.backend.dto.UpdateContentRequest;
import com.ahmet.backend.entity.ContentEntity;
import com.ahmet.backend.repository.ContentRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


class ContentServiceTest {

    @Mock
    private ContentRepository
            contentRepository;


    @Mock
    private OmdbClient
            omdbClient;


    private ContentService
            contentService;


    @BeforeEach
    void setUp() {

        MockitoAnnotations
                .openMocks(this);


        contentService =
                new ContentService(
                        contentRepository,
                        omdbClient
                );

    }


    @Test
    void shouldCreateContent() {

        CreateContentRequest request =
                new CreateContentRequest();


        request.setTitle(
                "Interstellar"
        );

        request.setYear(
                2014
        );

        request.setGenre(
                "Sci-Fi"
        );

        request.setRating(
                8.7
        );


        when(
                contentRepository
                        .existsByTitleIgnoreCaseAndYear(
                                "Interstellar",
                                2014
                        )
        )
                .thenReturn(
                        false
                );


        when(
                contentRepository
                        .save(
                                any(
                                        ContentEntity.class
                                )
                        )
        )
                .thenAnswer(
                        invocation ->
                                invocation
                                        .getArgument(0)
                );


        ContentEntity created =
                contentService
                        .createContent(
                                request
                        );


        assertEquals(
                "Interstellar",
                created.getTitle()
        );


        verify(
                contentRepository,
                times(1)
        )
                .save(
                        any(
                                ContentEntity.class
                        )
                );

    }


    @Test
    void shouldUpdateContent() {

        ContentEntity existing =
                ContentEntity
                        .builder()

                        .id(1L)

                        .title(
                                "Old title"
                        )

                        .year(
                                2014
                        )

                        .version(
                                0L
                        )

                        .build();


        UpdateContentRequest request =
                new UpdateContentRequest();


        request.setTitle(
                "New title"
        );

        request.setYear(
                2014
        );

        request.setVersion(
                0L
        );


        when(
                contentRepository
                        .findById(
                                1L
                        )
        )
                .thenReturn(
                        Optional.of(
                                existing
                        )
                );


        when(
                contentRepository
                        .existsByTitleIgnoreCaseAndYearAndIdNot(
                                "New title",
                                2014,
                                1L
                        )
        )
                .thenReturn(
                        false
                );


        when(
                contentRepository
                        .saveAndFlush(
                                any(
                                        ContentEntity.class
                                )
                        )
        )
                .thenAnswer(
                        invocation ->
                                invocation
                                        .getArgument(0)
                );


        ContentEntity updated =
                contentService
                        .updateContent(
                                1L,
                                request
                        );


        assertEquals(
                "New title",
                updated.getTitle()
        );

    }


    @Test
    void shouldDeleteContent() {

        ContentEntity existing =
                ContentEntity
                        .builder()
                        .id(1L)
                        .title(
                                "Interstellar"
                        )
                        .build();


        when(
                contentRepository
                        .findById(
                                1L
                        )
        )
                .thenReturn(
                        Optional.of(
                                existing
                        )
                );


        contentService
                .deleteContent(
                        1L
                );


        verify(
                contentRepository
        )
                .delete(
                        existing
                );

    }


    @Test
    void shouldSearchMovie() {

        OmdbMovieDto movie =
                new OmdbMovieDto();


        movie.setTitle(
                "Interstellar"
        );

        movie.setResponse(
                "True"
        );


        when(
                omdbClient
                        .getMovieByTitle(
                                "Interstellar"
                        )
        )
                .thenReturn(
                        movie
                );


        OmdbMovieDto result =
                contentService
                        .searchMovie(
                                "Interstellar"
                        );


        assertEquals(
                "Interstellar",
                result.getTitle()
        );

    }

}
