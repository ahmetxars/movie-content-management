package com.ahmet.backend.service;

import com.ahmet.backend.client.OmdbClient;
import com.ahmet.backend.dto.CreateContentRequest;
import com.ahmet.backend.dto.OmdbMovieDto;
import com.ahmet.backend.dto.UpdateContentRequest;
import com.ahmet.backend.entity.ContentEntity;
import com.ahmet.backend.exception.ConcurrentContentUpdateException;
import com.ahmet.backend.exception.ContentNotFoundException;
import com.ahmet.backend.exception.DuplicateContentException;
import com.ahmet.backend.exception.MovieNotFoundException;
import com.ahmet.backend.repository.ContentRepository;

import jakarta.persistence.criteria.Predicate;

import org.springframework.data.domain.*;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
public class ContentService {

    private static final Set<String>
            ALLOWED_SORT_FIELDS =
            Set.of(
                    "title",
                    "year",
                    "rating",
                    "createdAt"
            );


    private final ContentRepository
            contentRepository;

    private final OmdbClient
            omdbClient;


    public ContentService(
            ContentRepository contentRepository,
            OmdbClient omdbClient
    ) {

        this.contentRepository =
                contentRepository;

        this.omdbClient =
                omdbClient;

    }


    public List<ContentEntity> getAllContents() {

        return contentRepository
                .findAll();

    }


    public Page<ContentEntity> searchContents(

            String title,

            String genre,

            Double minRating,

            int page,

            int size,

            String sortBy,

            String sortDir

    ) {

        int safePage =
                Math.max(
                        page,
                        0
                );


        int safeSize =
                Math.min(
                        Math.max(
                                size,
                                1
                        ),
                        50
                );


        String safeSortBy =
                ALLOWED_SORT_FIELDS
                        .contains(sortBy)
                        ? sortBy
                        : "createdAt";


        Sort.Direction direction =
                "asc"
                        .equalsIgnoreCase(
                                sortDir
                        )
                        ? Sort.Direction.ASC
                        : Sort.Direction.DESC;


        Pageable pageable =
                PageRequest.of(

                        safePage,

                        safeSize,

                        Sort.by(
                                direction,
                                safeSortBy
                        )

                );


        return contentRepository.findAll(

                (root, query, criteriaBuilder) -> {

                    List<Predicate> predicates =
                            new ArrayList<>();


                    if (
                            title != null &&
                                    !title.isBlank()
                    ) {

                        predicates.add(

                                criteriaBuilder.like(

                                        criteriaBuilder.lower(
                                                root.get(
                                                        "title"
                                                )
                                        ),

                                        "%" +
                                                title
                                                        .trim()
                                                        .toLowerCase()
                                                + "%"

                                )

                        );

                    }


                    if (
                            genre != null &&
                                    !genre.isBlank()
                    ) {

                        predicates.add(

                                criteriaBuilder.like(

                                        criteriaBuilder.lower(
                                                root.get(
                                                        "genre"
                                                )
                                        ),

                                        "%" +
                                                genre
                                                        .trim()
                                                        .toLowerCase()
                                                + "%"

                                )

                        );

                    }


                    if (
                            minRating != null
                    ) {

                        predicates.add(

                                criteriaBuilder
                                        .greaterThanOrEqualTo(

                                                root.get(
                                                        "rating"
                                                ),

                                                minRating

                                        )

                        );

                    }


                    return criteriaBuilder.and(

                            predicates.toArray(
                                    new Predicate[0]
                            )

                    );

                },

                pageable

        );

    }


    public ContentEntity getContentById(
            Long id
    ) {

        return contentRepository
                .findById(id)
                .orElseThrow(() ->

                        new ContentNotFoundException(
                                "Content not found with id: "
                                        + id
                        )

                );

    }


    public ContentEntity createContent(
            CreateContentRequest request
    ) {

        String title =
                request
                        .getTitle()
                        .trim();


        if (
                contentRepository
                        .existsByTitleIgnoreCaseAndYear(

                                title,

                                request.getYear()

                        )
        ) {

            throw new DuplicateContentException(
                    "This content already exists."
            );

        }


        ContentEntity content =
                ContentEntity.builder()

                        .title(title)

                        .year(
                                request.getYear()
                        )

                        .genre(
                                request.getGenre()
                        )

                        .rating(
                                request.getRating()
                        )

                        .plot(
                                request.getPlot()
                        )

                        .poster(
                                request.getPoster()
                        )

                        .director(
                                request.getDirector()
                        )

                        .build();


        return contentRepository
                .save(content);

    }


    @Transactional
    public ContentEntity updateContent(

            Long id,

            UpdateContentRequest request

    ) {

        ContentEntity existingContent =
                getContentById(id);


        if (
                !Objects.equals(

                        existingContent
                                .getVersion(),

                        request.getVersion()

                )
        ) {

            throw new ConcurrentContentUpdateException(

                    "This movie was changed by another user. "
                            + "Reload the latest version and try again."

            );

        }


        boolean duplicateExists =
                contentRepository
                        .existsByTitleIgnoreCaseAndYearAndIdNot(

                                request
                                        .getTitle()
                                        .trim(),

                                request.getYear(),

                                id

                        );


        if (duplicateExists) {

            throw new DuplicateContentException(
                    "This content already exists."
            );

        }


        existingContent.setTitle(

                request
                        .getTitle()
                        .trim()

        );

        existingContent.setYear(
                request.getYear()
        );

        existingContent.setGenre(
                request.getGenre()
        );

        existingContent.setRating(
                request.getRating()
        );

        existingContent.setPlot(
                request.getPlot()
        );

        existingContent.setPoster(
                request.getPoster()
        );

        existingContent.setDirector(
                request.getDirector()
        );


        try {

            return contentRepository
                    .saveAndFlush(
                            existingContent
                    );

        } catch (
                ObjectOptimisticLockingFailureException exception
        ) {

            throw new ConcurrentContentUpdateException(

                    "This movie was changed by another user. "
                            + "Reload the latest version and try again."

            );

        }

    }


    public void deleteContent(
            Long id
    ) {

        ContentEntity content =
                getContentById(id);

        contentRepository
                .delete(content);

    }


    public OmdbMovieDto searchMovie(
            String title
    ) {

        OmdbMovieDto movie =
                omdbClient
                        .getMovieByTitle(
                                title
                        );


        if (
                movie == null ||
                        "False"
                                .equalsIgnoreCase(
                                        movie.getResponse()
                                )
        ) {

            throw new MovieNotFoundException(

                    "Movie not found: "
                            + title

            );

        }


        return movie;

    }


    public ContentEntity importMovieFromOmdb(
            String title
    ) {

        OmdbMovieDto movie =
                searchMovie(title);


        Integer year =
                parseYear(
                        movie.getYear()
                );


        if (
                contentRepository
                        .existsByTitleIgnoreCaseAndYear(

                                movie.getTitle(),

                                year

                        )
        ) {

            throw new DuplicateContentException(

                    "This movie is already in the library."

            );

        }


        ContentEntity content =
                ContentEntity.builder()

                        .title(
                                movie.getTitle()
                        )

                        .year(year)

                        .genre(
                                movie.getGenre()
                        )

                        .rating(
                                parseRating(
                                        movie.getImdbRating()
                                )
                        )

                        .plot(
                                movie.getPlot()
                        )

                        .poster(
                                movie.getPoster()
                        )

                        .director(
                                movie.getDirector()
                        )

                        .build();


        return contentRepository
                .save(content);

    }


    private Integer parseYear(
            String year
    ) {

        try {

            String firstYear =
                    year
                            .split("–")[0]
                            .split("-")[0];


            return Integer.parseInt(
                    firstYear
            );

        } catch (
                Exception exception
        ) {

            return null;

        }

    }


    private Double parseRating(
            String rating
    ) {

        try {

            return Double.parseDouble(
                    rating
            );

        } catch (
                Exception exception
        ) {

            return null;

        }

    }

}