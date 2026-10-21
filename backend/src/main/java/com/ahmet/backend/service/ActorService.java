package com.ahmet.backend.service;

import com.ahmet.backend.dto.ActorRequest;
import com.ahmet.backend.entity.ActorEntity;
import com.ahmet.backend.entity.ContentEntity;
import com.ahmet.backend.repository.ActorRepository;
import com.ahmet.backend.repository.ContentRepository;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
public class ActorService {

    private final ActorRepository
            actorRepository;

    private final ContentRepository
            contentRepository;


    public ActorService(
            ActorRepository actorRepository,
            ContentRepository contentRepository
    ) {

        this.actorRepository =
                actorRepository;

        this.contentRepository =
                contentRepository;
    }


    @Transactional(readOnly = true)
    public List<ActorEntity>
    getAllActors() {

        return actorRepository.findAll(
                Sort.by(
                        Sort.Direction.ASC,
                        "name"
                )
        );
    }


    @Transactional(readOnly = true)
    public ActorEntity
    getActorById(
            Long id
    ) {

        return actorRepository
                .findById(id)
                .orElseThrow(
                        () ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Actor not found."
                                )
                );
    }


    @Transactional
    public ActorEntity
    createActor(
            ActorRequest request
    ) {

        ActorEntity actor =
                ActorEntity.builder()

                        .name(
                                normalizeName(
                                        request.getName()
                                )
                        )

                        .birthDate(
                                request.getBirthDate()
                        )

                        .biography(
                                trimOrNull(
                                        request.getBiography()
                                )
                        )

                        .photo(
                                trimOrNull(
                                        request.getPhoto()
                                )
                        )

                        .build();


        return actorRepository
                .save(actor);
    }


    @Transactional
    public ActorEntity
    updateActor(
            Long id,
            ActorRequest request
    ) {

        ActorEntity actor =
                getActorById(id);


        actor.setName(
                normalizeName(
                        request.getName()
                )
        );

        actor.setBirthDate(
                request.getBirthDate()
        );

        actor.setBiography(
                trimOrNull(
                        request.getBiography()
                )
        );

        actor.setPhoto(
                trimOrNull(
                        request.getPhoto()
                )
        );


        return actorRepository
                .save(actor);
    }


    @Transactional
    public void deleteActor(
            Long id
    ) {

        ActorEntity actor =
                getActorById(id);

        actorRepository
                .delete(actor);
    }


    @Transactional(readOnly = true)
    public List<ActorEntity>
    getActorsForContent(
            Long contentId
    ) {

        ContentEntity content =
                getContent(
                        contentId
                );


        return content
                .getActors()
                .stream()
                .sorted(
                        Comparator.comparing(
                                ActorEntity::getName,
                                String.CASE_INSENSITIVE_ORDER
                        )
                )
                .toList();
    }


    @Transactional
    public List<ActorEntity>
    addActorToContent(
            Long contentId,
            Long actorId
    ) {

        ContentEntity content =
                getContent(
                        contentId
                );

        ActorEntity actor =
                getActorById(
                        actorId
                );


        content
                .getActors()
                .add(actor);


        contentRepository
                .save(content);


        return content
                .getActors()
                .stream()
                .sorted(
                        Comparator.comparing(
                                ActorEntity::getName,
                                String.CASE_INSENSITIVE_ORDER
                        )
                )
                .toList();
    }


    @Transactional
    public List<ActorEntity>
    removeActorFromContent(
            Long contentId,
            Long actorId
    ) {

        ContentEntity content =
                getContent(
                        contentId
                );

        ActorEntity actor =
                getActorById(
                        actorId
                );


        content
                .getActors()
                .remove(actor);


        contentRepository
                .save(content);


        return content
                .getActors()
                .stream()
                .sorted(
                        Comparator.comparing(
                                ActorEntity::getName,
                                String.CASE_INSENSITIVE_ORDER
                        )
                )
                .toList();
    }


    private ContentEntity
    getContent(
            Long id
    ) {

        return contentRepository
                .findById(id)
                .orElseThrow(
                        () ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Content not found."
                                )
                );
    }


    private String
    normalizeName(
            String value
    ) {

        return value
                .trim()
                .replaceAll(
                        "\\s+",
                        " "
                );
    }


    private String
    trimOrNull(
            String value
    ) {

        if (
                value == null ||
                        value.isBlank()
        ) {

            return null;
        }

        return value.trim();
    }
}
