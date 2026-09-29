package theodoicuumang.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Cấu hình Spring Security cho toàn bộ API.
 *
 * HIỆN TẠI: mọi endpoint /api/** đều permitAll() (KHÔNG bắt buộc đăng nhập) -
 * theo đúng quyết định "chưa cần auth thật, test API trước, thêm sau" (chỉ
 * cần 1 role, không phân quyền). Endpoint /api/auth/login đã hoạt động thật
 * (kiểm tra username/password + phát JWT thật), CHỈ RIÊNG việc ENFORCE các
 * endpoint khác phải có token hợp lệ là chưa bật.
 *
 * KHI CẦN BẬT XÁC THỰC BẮT BUỘC: đổi dòng .anyRequest().permitAll() thành
 *     .requestMatchers("/api/auth/**").permitAll()
 *     .anyRequest().authenticated()
 * JwtAuthenticationFilter đã sẵn sàng, không cần sửa gì thêm.
 *
 * CORS được cấu hình NGAY TẠI ĐÂY (không dùng CorsConfig.java / WebMvcConfigurer
 * riêng) vì khi Spring Security có mặt, request OPTIONS preflight bị Security
 * filter chain xử lý TRƯỚC KHI tới được MVC CORS handler.
 */
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // xem ghi chú ở đầu file trước khi đổi thành .authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigins));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
