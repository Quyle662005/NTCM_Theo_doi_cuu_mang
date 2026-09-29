package theodoicuumang.backend.dto;

import jakarta.validation.constraints.NotBlank;

/** Khớp updateThang(mtqId, thang, giaTri): body { giaTri } */
public record ThangUpdateRequest(
        @NotBlank(message = "giaTri không được để trống")
        String giaTri
) {
}
