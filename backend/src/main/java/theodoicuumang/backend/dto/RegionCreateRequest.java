package theodoicuumang.backend.dto;

import jakarta.validation.constraints.NotBlank;

/** Khớp regionApi.create: { name, mucTb? }.
 *  mucTb KHÔNG được lưu (là giá trị tính động từ mucDeXuat của các hoàn cảnh
 *  trong vùng) nên field này chỉ nhận vào cho khớp type, không dùng tới. */
public record RegionCreateRequest(
        @NotBlank(message = "Tên vùng không được để trống")
        String name,
        java.math.BigDecimal mucTb
) {
}
