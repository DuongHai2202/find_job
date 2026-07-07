package vn.duonghai.jobportal.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.net.URI;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    ProblemDetail handleBusiness(BusinessException ex, HttpServletRequest request) {
        var problem = ProblemDetail.forStatusAndDetail(ex.getStatus(), ex.getMessage());
        problem.setTitle("Business rule violation");
        problem.setInstance(URI.create(request.getRequestURI()));
        return problem;
    }

    @ExceptionHandler(BadCredentialsException.class)
    ProblemDetail handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        var problem = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, "Email hoac mat khau khong dung");
        problem.setTitle("Authentication failed");
        problem.setInstance(URI.create(request.getRequestURI()));
        return problem;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        fieldError -> fieldError.getDefaultMessage() == null
                                ? "Gia tri khong hop le"
                                : fieldError.getDefaultMessage(),
                        (first, second) -> first
                ));

        var problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Du lieu dau vao khong hop le");
        problem.setTitle("Validation failed");
        problem.setInstance(URI.create(request.getRequestURI()));
        problem.setProperty("errors", errors);
        return problem;
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    ProblemDetail handleUploadTooLarge(MaxUploadSizeExceededException ex, HttpServletRequest request) {
        var problem = ProblemDetail.forStatusAndDetail(HttpStatus.PAYLOAD_TOO_LARGE, "File upload vuot qua gioi han cho phep");
        problem.setTitle("Upload too large");
        problem.setInstance(URI.create(request.getRequestURI()));
        return problem;
    }

    @ExceptionHandler(Exception.class)
    ProblemDetail handleUnexpected(Exception ex, HttpServletRequest request) {
        var problem = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "He thong gap loi khong mong muon");
        problem.setTitle("Internal server error");
        problem.setInstance(URI.create(request.getRequestURI()));
        return problem;
    }
}
