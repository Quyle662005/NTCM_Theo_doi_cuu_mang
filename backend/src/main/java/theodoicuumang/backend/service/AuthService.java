package theodoicuumang.backend.service;

import theodoicuumang.backend.config.JwtService;
import theodoicuumang.backend.dto.LoginResponse;
import theodoicuumang.backend.entity.User;
import theodoicuumang.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("Sai tài khoản hoặc mật khẩu"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BadCredentialsException("Sai tài khoản hoặc mật khẩu");
        }

        String token = jwtService.generateToken(user.getUsername());
        return new LoginResponse(token, user.getUsername());
    }
}
