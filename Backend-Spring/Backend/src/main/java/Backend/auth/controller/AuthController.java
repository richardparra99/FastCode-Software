package Backend.auth.controller;

import Backend.auth.dto.AuthReponse;
import Backend.auth.service.AuthService;
import Backend.auth.dto.LoginRequest;
import Backend.auth.dto.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthReponse> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(new AuthReponse("Usuario registrado correctamente"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthReponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/jwt/me")
    public ResponseEntity<String> me() {
            return ResponseEntity.ok("Autenticado correctamente");
    }
}
