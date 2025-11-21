package Backend.auth.service;

import Backend.auth.dto.AuthReponse;
import Backend.auth.dto.LoginRequest;
import Backend.auth.dto.RegisterRequest;
import Backend.security.JwtService;
import Backend.usuario.model.Usuario;
import Backend.usuario.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public void register(RegisterRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }
        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuarioRepository.save(usuario);
    }

    public AuthReponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        boolean passwordOk = passwordEncoder.matches(
                request.getPassword(),
                usuario.getPassword()
        );
        if (!passwordOk) {
            throw new RuntimeException("Credenciales inválidas");
        }
        String token = jwtService.generateToken(usuario);
        return new AuthReponse(token);
    }
}
