package theodoicuumang.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

/** Khớp addMtq(hcId, { ten, muc? }) */
public record ManhThuongQuanCreateRequest(
        @NotBlank(message = "Tên MTQ không được để trống")
        String ten,
        BigDecimal muc
) {
}
