package theodoicuumang.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hoan_canh")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HoanCanh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma_hc", length = 20)
    private String maHc;

    @Column(name = "ten_hoan_canh", nullable = false, length = 500)
    private String tenHoanCanh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "khu_vuc_id")
    private KhuVuc khuVuc;

    /** Text KHU VỰC gốc từ file Excel (có thể không đồng nhất hoa/thường với khuVuc.tenKhuVuc) */
    @Column(name = "khu_vuc_raw", length = 200)
    private String khuVucRaw;

    @Column(name = "cach_thuc_nhan_tien", length = 100)
    private String cachThucNhanTien;

    @Column(name = "link", length = 500)
    private String link;

    @Column(name = "thong_tin_lien_he", length = 300)
    private String thongTinLienHe;

    @Column(name = "vi_tri", length = 500)
    private String viTri;

    /** Số tài khoản / thông tin chuyển khoản (tên NH, chủ TK, STK...) */
    @Column(name = "thong_tin_chuyen_khoan", length = 300)
    private String thongTinChuyenKhoan;

    /** Mức hỗ trợ đề xuất - nhập tay qua UI, không có sẵn trong dữ liệu gốc */
    @Column(name = "muc_de_xuat", precision = 12, scale = 2)
    private BigDecimal mucDeXuat;

    /** Mức CMTX bình quân/tháng - admin nhập tay để override giá trị tự tính */
    @Column(name = "muc_binh_quan", precision = 12, scale = 2)
    private BigDecimal mucBinhQuan;

    @Builder.Default
    @Column(name = "trang_thai", nullable = false, length = 20)
    private String trangThai = "Dang ho tro"; // 'Dang ho tro' | 'Mong ket noi' | 'Ngung CMTX'

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    @Builder.Default
    @OneToMany(mappedBy = "hoanCanh", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ThanhVien> thanhVienList = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "hoanCanh", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<DangKyHoTro> dangKyHoTroList = new ArrayList<>();
}
