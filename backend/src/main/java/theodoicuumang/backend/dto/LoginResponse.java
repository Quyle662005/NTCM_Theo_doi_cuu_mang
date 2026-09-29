package theodoicuumang.backend.dto;

/** Khớp authApi.login trả về: { data: { token, username } } */
public record LoginResponse(String token, String username) {
}
