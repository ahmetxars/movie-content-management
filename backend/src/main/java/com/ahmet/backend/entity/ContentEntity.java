package com.ahmet.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "contents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentEntity {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(nullable = false)
    private String title;

    private Integer year;

    private String genre;

    private Double rating;

    @Column(length = 2000)
    private String plot;

    @Column(length = 1000)
    private String poster;

    private String director;

    @Enumerated(
            EnumType.STRING
    )
    @Column(
            name = "content_type",
            nullable = false,
            length = 20
    )
    @Builder.Default
    private ContentType type =
            ContentType.MOVIE;

    @Version
    @Column(nullable = false)
    private Long version;

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;


    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "content_categories",

            joinColumns =
            @JoinColumn(
                    name = "content_id"
            ),

            inverseJoinColumns =
            @JoinColumn(
                    name = "category_id"
            )
    )
    @Builder.Default
    private Set<CategoryEntity>
            categories =
            new LinkedHashSet<>();


    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "content_actors",

            joinColumns =
            @JoinColumn(
                    name = "content_id"
            ),

            inverseJoinColumns =
            @JoinColumn(
                    name = "actor_id"
            )
    )
    @Builder.Default
    private Set<ActorEntity>
            actors =
            new LinkedHashSet<>();


    @PrePersist
    public void prePersist() {

        createdAt =
                LocalDateTime.now();

        if (type == null) {

            type =
                    ContentType.MOVIE;
        }
    }
}