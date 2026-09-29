package theodoicuumang.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Đọc token "Bearer ..." từ header Authorization (interceptor axios cậu đã
 * scaffold sẵn ở frontend) và set SecurityContext nếu hợp lệ.
 *
 * LƯU Ý: filter này KHÔNG tự động chặn request thiếu token - việc chặn hay
 * không do SecurityConfig.authorizeHttpRequests(...) quyết định. Hiện tại
 * đang permitAll() nên request thiếu/token sai vẫn qua được, chỉ là không
 * có Authentication trong context. Khi cần bật xác thực bắt buộc thật, đổi
 * permitAll() thành .anyRequest().authenticated() trong SecurityConfig -
 * filter này đã sẵn sàng, không cần sửa gì thêm.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            String username = jwtService.validateAndGetUsername(token);
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                var auth = new UsernamePasswordAuthenticationToken(username, null, List.of());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        chain.doFilter(request, response);
    }
}
