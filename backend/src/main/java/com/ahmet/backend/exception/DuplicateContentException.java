package com.ahmet.backend.exception;

public class DuplicateContentException
        extends RuntimeException {

    public DuplicateContentException(
            String message
    ) {
        super(message);
    }
}