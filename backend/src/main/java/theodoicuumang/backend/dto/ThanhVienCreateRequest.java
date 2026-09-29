package theodoicuumang.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/** Khớp addThanhVien(hcId, { ten, loai }) */
public record ThanhVienCreateRequest(
        @NotBlank(message = "Tên thành viên không được để trống")
        String ten,

        @NotBlank(message = "Loại thành viên không được để trống")
        @Pattern(regexp = "TRUNG_CHUYEN|HO_TRO", message = "loai phải là TRUNG_CHUYEN hoặc HO_TRO")
        String loai
) {
}
