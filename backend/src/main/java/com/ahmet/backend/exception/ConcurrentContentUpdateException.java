package com.ahmet.backend.exception;

public class ConcurrentContentUpdateException
        extends RuntimeException {

    public ConcurrentContentUpdateException(
            String message
    ) {
        super(message);
    }

}