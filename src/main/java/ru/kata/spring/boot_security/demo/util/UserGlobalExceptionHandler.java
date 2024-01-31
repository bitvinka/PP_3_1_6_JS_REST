package ru.kata.spring.boot_security.demo.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class UserGlobalExceptionHandler {
    @ExceptionHandler
    private ResponseEntity<UserErrorResponse> handleException(UserNotFoundException e) {
        UserErrorResponse errorResponse = new UserErrorResponse("Человек с таким id не найден", System.currentTimeMillis());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND); //NOT_FOUND - 404 статус
    }

    @ExceptionHandler
    private ResponseEntity<UserErrorResponse> handleException(Exception e) {
        UserErrorResponse errorResponse = new UserErrorResponse(e.getMessage(), System.currentTimeMillis());

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
}
