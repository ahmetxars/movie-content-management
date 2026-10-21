package com.ahmet.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "actors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActorEntity {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @Column(
            nullable = false,
            length = 150
    )
    private String name;

    @Column(
            name = "birth_date"
    )
    private LocalDate birthDate;

    @Column(
            length = 3000
    )
    private String biography;

    @Column(
            length = 1000
    )
    private String photo;
}