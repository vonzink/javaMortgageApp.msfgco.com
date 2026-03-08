package com.msfg.mortgage.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resource, Object id) {
        super(resource + " not found with identifier: " + id);
    }
}
