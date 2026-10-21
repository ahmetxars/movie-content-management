package com.ahmet.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(
            ContentNotFoundException.class
    )
    public ResponseEntity<Map<String, Object>>
    handleContentNotFound(
            ContentNotFoundException exception
    ) {

        return createResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage()
        );
    }
    @ExceptionHandler(
            EmailAlreadyExistsException.class
    )
    public ResponseEntity<Map<String, Object>>
    handleEmailAlreadyExists(
            EmailAlreadyExistsException exception
    ) {

        return createResponse(
                HttpStatus.CONFLICT,
                exception.getMessage()
        );
    }


    @ExceptionHandler(
            InvalidCredentialsException.class
    )
    public ResponseEntity<Map<String, Object>>
    handleInvalidCredentials(
            InvalidCredentialsException exception
    ) {

        return createResponse(
                HttpStatus.UNAUTHORIZED,
                exception.getMessage()
        );
    }

    @ExceptionHandler(
            ConcurrentContentUpdateException.class
    )
    public ResponseEntity<Map<String, Object>>
    handleConcurrentContentUpdate(
            ConcurrentContentUpdateException exception
    ) {

        return createResponse(
                HttpStatus.CONFLICT,
                exception.getMessage()
        );

    }

    @ExceptionHandler(
            MovieNotFoundException.class
    )
    public ResponseEntity<Map<String, Object>>
    handleMovieNotFound(
            MovieNotFoundException exception
    ) {

        return createResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage()
        );
    }


    @ExceptionHandler(
            DuplicateContentException.class
    )
    public ResponseEntity<Map<String, Object>>
    handleDuplicateContent(
            DuplicateContentException exception
    ) {

        return createResponse(
                HttpStatus.CONFLICT,
                exception.getMessage()
        );
    }


    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )
    public ResponseEntity<Map<String, Object>>
    handleValidationException(
            MethodArgumentNotValidException exception
    ) {

        Map<String, String> validationErrors =
                new LinkedHashMap<>();


        exception
                .getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        validationErrors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );


        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "timestamp",
                LocalDateTime.now()
        );

        response.put(
                "status",
                HttpStatus.BAD_REQUEST.value()
        );

        response.put(
                "error",
                HttpStatus.BAD_REQUEST
                        .getReasonPhrase()
        );

        response.put(
                "message",
                "Validation failed"
        );

        response.put(
                "errors",
                validationErrors
        );


        return ResponseEntity
                .badRequest()
                .body(response);
    }


    private ResponseEntity<Map<String, Object>>
    createResponse(
            HttpStatus status,
            String message
    ) {

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "timestamp",
                LocalDateTime.now()
        );

        response.put(
                "status",
                status.value()
        );

        response.put(
                "error",
                status.getReasonPhrase()
        );

        response.put(
                "message",
                message
        );


        return ResponseEntity
                .status(status)
                .body(response);
    }
}