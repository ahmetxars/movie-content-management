package com.ahmet.backend.controller;

import com.ahmet.backend.dto.ActorRequest;
import com.ahmet.backend.entity.ActorEntity;
import com.ahmet.backend.service.ActorService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(
        "/api/contents"
)
public class ActorController {

    private final ActorService
            actorService;


    public ActorController(
            ActorService actorService
    ) {

        this.actorService =
                actorService;
    }


    @GetMapping(
            "/actors"
    )
    public List<ActorEntity>
    getAllActors() {

        return actorService
                .getAllActors();
    }


    @GetMapping(
            "/actors/{id}"
    )
    public ActorEntity
    getActor(
            @PathVariable
            Long id
    ) {

        return actorService
                .getActorById(id);
    }


    @PostMapping(
            "/actors"
    )
    @ResponseStatus(
            HttpStatus.CREATED
    )
    public ActorEntity
    createActor(
            @Valid
            @RequestBody
            ActorRequest request
    ) {

        return actorService
                .createActor(
                        request
                );
    }


    @PutMapping(
            "/actors/{id}"
    )
    public ActorEntity
    updateActor(
            @PathVariable
            Long id,

            @Valid
            @RequestBody
            ActorRequest request
    ) {

        return actorService
                .updateActor(
                        id,
                        request
                );
    }


    @DeleteMapping(
            "/actors/{id}"
    )
    @ResponseStatus(
            HttpStatus.NO_CONTENT
    )
    public void
    deleteActor(
            @PathVariable
            Long id
    ) {

        actorService
                .deleteActor(id);
    }


    @GetMapping(
            "/{contentId}/actors"
    )
    public List<ActorEntity>
    getActorsForContent(
            @PathVariable
            Long contentId
    ) {

        return actorService
                .getActorsForContent(
                        contentId
                );
    }


    @PostMapping(
            "/{contentId}/actors/{actorId}"
    )
    public List<ActorEntity>
    addActorToContent(
            @PathVariable
            Long contentId,

            @PathVariable
            Long actorId
    ) {

        return actorService
                .addActorToContent(
                        contentId,
                        actorId
                );
    }


    @DeleteMapping(
            "/{contentId}/actors/{actorId}"
    )
    public List<ActorEntity>
    removeActorFromContent(
            @PathVariable
            Long contentId,

            @PathVariable
            Long actorId
    ) {

        return actorService
                .removeActorFromContent(
                        contentId,
                        actorId
                );
    }
}