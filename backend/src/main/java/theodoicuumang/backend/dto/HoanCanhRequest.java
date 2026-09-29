package theodoicuumang.backend.dto;

import java.math.BigDecimal;

/** Khớp create(Partial<HoanCanh> & { regionId }) / update(id, Partial<HoanCanh>).
 *  Mọi field đều optional (kể cả regionId) vì update chỉ gửi phần thay đổi;
 *  service sẽ validate regionId bắt buộc riêng khi tạo mới. */
public record HoanCanhRequest(
        Integer regionId,
        String ma,
        String ten,
        String link,
        String khuVuc,
        String ghiChu,
        BigDecimal mucDeXuat,
        BigDecimal mucBinhQuan,
        String trangThai,
        String thongTinLienHe,
        String viTri,
        String thongTinChuyenKhoan
) {
}
