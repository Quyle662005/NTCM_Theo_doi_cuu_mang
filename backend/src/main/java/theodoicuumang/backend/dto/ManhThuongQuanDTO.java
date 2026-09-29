package theodoicuumang.backend.dto;

import java.math.BigDecimal;
import java.util.List;

/** Khớp `interface ManhThuongQuan` bên frontend: { id, ten, muc, thangList }.
 *  "id" ở đây là id của LƯỢT ĐĂNG KÝ (dang_ky_ho_tro.id), không phải id của
 *  mang_thuong_quan (master) - vì frontend thao tác (xoá/sửa) trên từng lượt
 *  đăng ký riêng cho từng hoàn cảnh, không sửa trực tiếp master MTQ. */
public record ManhThuongQuanDTO(
        Integer id,
        String ten,
        BigDecimal muc,
        List<ThangHoTroDTO> thangList
) {
}
