package theodoicuumang.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "giao_dich_thang")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GiaoDichThang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dang_ky_id", nullable = false)
    private DangKyHoTro dangKy;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hoan_canh_id", nullable = false)
    private HoanCanh hoanCanh;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mtq_id", nullable = false)
    private MangThuongQuan mangThuongQuan;

    @Column(name = "thang", nullable = false)
    private Integer thang; // 1..12

    @Column(name = "nam", nullable = false)
    private Integer nam;

    @Column(name = "so_tien", precision = 12, scale = 2)
    private BigDecimal soTien; // NULL nếu giá trị gốc không phải số (vd 'ok', 'Lì xì')

    @Column(name = "gia_tri_text", nullable = false, length = 50)
    private String giaTriText; // giá trị gốc trong ô, luôn giữ lại
}
