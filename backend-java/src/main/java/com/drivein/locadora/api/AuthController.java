package com.drivein.locadora.api;

import com.drivein.locadora.model.User;
import com.drivein.locadora.entity.UserEntity;
import com.drivein.locadora.repo.UserRepository;
import com.drivein.locadora.service.RegistrationService;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.time.LocalDate;
import java.time.Period;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final ObjectProvider<RegistrationService> registrationServiceProvider;

    public AuthController(UserRepository userRepository, ObjectProvider<RegistrationService> registrationServiceProvider) {
        this.userRepository = userRepository;
        this.registrationServiceProvider = registrationServiceProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && password != null) {
            String stored = userOpt.get().getPasswordHash();
            boolean ok = false;
            if (stored != null) {
                // If stored is a bcrypt hash, verify with BCrypt; otherwise compare plain text (dev seeds)
                if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
                    BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
                    ok = enc.matches(password, stored);
                } else {
                    ok = password.equals(stored);
                }
            }
            if (ok) {
                String token = com.drivein.locadora.service.TokenUtil.issueTokenFor(email);
                return ResponseEntity.ok(Map.of(
                        "accessToken", token,
                        "user", Map.of(
                                "id", userOpt.get().getId(),
                                "name", userOpt.get().getName(),
                                "email", userOpt.get().getEmail(),
                                "cpf", userOpt.get().getCpf(),
                                "phone", userOpt.get().getPhone(),
                                "createdAt", userOpt.get().getCreatedAt()
                        )
                ));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Credenciais inválidas"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Basic checks
        if (user.getName() == null || user.getName().isBlank() ||
            user.getEmail() == null || user.getEmail().isBlank() ||
            user.getPhone() == null || user.getPhone().isBlank() ||
            user.getCpf() == null || user.getCpf().isBlank() ||
            user.getPassword() == null || user.getPassword().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Campos obrigatórios ausentes"));
        }

        // Uniqueness via repository
        Optional<UserEntity> existingByEmail = userRepository.findByEmail(user.getEmail());
        if (existingByEmail.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email já cadastrado"));
        }
        if (userRepository.existsByCpf(user.getCpf())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "CPF já cadastrado"));
        }

        // Address required minimal set
        if (isBlank(user.getAddressStreet()) || isBlank(user.getAddressNumber()) ||
            isBlank(user.getAddressCity()) || isBlank(user.getAddressState()) ||
            isBlank(user.getAddressCep())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Endereço incompleto (Rua, Número, Cidade, Estado, CEP)"));
        }

        // Age >= 18 and CNH validity
        try {
            LocalDate birth = LocalDate.parse(user.getBirthDate());
            int age = Period.between(birth, LocalDate.now()).getYears();
            if (age < 18) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Idade mínima de 18 anos"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Data de nascimento inválida"));
        }

        if (isBlank(user.getCnhNumber())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Número da CNH é obrigatório"));
        }
        try {
            LocalDate exp = LocalDate.parse(user.getCnhExpiry());
            if (!exp.isAfter(LocalDate.now())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "CNH expirada"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Validade da CNH inválida"));
        }

        // Persist via JPA/MySQL exclusively (no in-memory store)
        RegistrationService regSvc = registrationServiceProvider.getIfAvailable();
        if (regSvc == null) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("message", "Persistência indisponível"));
        }
        UserEntity persisted;
        try {
            persisted = regSvc.persistAll(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Falha ao persistir usuário"));
        }
        String token = com.drivein.locadora.service.TokenUtil.issueTokenFor(persisted.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "accessToken", token,
                "user", Map.of(
                        "id", persisted.getId(),
                        "name", persisted.getName(),
                        "email", persisted.getEmail(),
                        "cpf", persisted.getCpf(),
                        "phone", persisted.getPhone(),
                        "createdAt", persisted.getCreatedAt()
                )
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Token ausente"));
        }
        String token = authHeader.substring("Bearer ".length());
        String email = com.drivein.locadora.service.TokenUtil.extractEmail(token);
        if (email == null || email.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Token inválido"));
        }
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Usuário não encontrado"));
        }
        UserEntity u = userOpt.get();
        return ResponseEntity.ok(Map.of(
                "id", u.getId(),
                "name", u.getName(),
                "email", u.getEmail(),
                "cpf", u.getCpf(),
                "phone", u.getPhone(),
                "createdAt", u.getCreatedAt()
        ));
    }

    private boolean isBlank(String s) {
        return s == null || s.isBlank();
    }
}