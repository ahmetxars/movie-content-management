package com.ahmet.backend.exception;

public class EmailAlreadyExistsException
        extends RuntimeException {

    public EmailAlreadyExistsException(
            String message
    ) {
        super(message);
    }
}