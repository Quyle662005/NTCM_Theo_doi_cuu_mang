package theodoicuumang.backend.dto;

import java.math.BigDecimal;
import java.util.List;

/** Khớp `interface HoanCanh` bên frontend:
 *  { id, region, ma, ten, link?, khuVuc?, ghiChu?, mucDeXuat, mucBinhQuan?, trangThai, thongTinLienHe?, viTri?,thongTinChuyenKhoan?, mtqList, thanhVienList } */
public record HoanCanhDTO(
        Integer id,
        RegionDTO region,
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
        String thongTinChuyenKhoan,
        List<ManhThuongQuanDTO> mtqList,
        List<ThanhVienDTO> thanhVienList
) {
}