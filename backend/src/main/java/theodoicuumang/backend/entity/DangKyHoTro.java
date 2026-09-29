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
@Table(name = "dang_ky_ho_tro")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DangKyHoTro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hoan_canh_id", nullable = false)
    private HoanCanh hoanCanh;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mtq_id", nullable = false)
    private MangThuongQuan mangThuongQuan;

    @Column(name = "muc_ho_tro_text", length = 50)
    private String mucHoTroText;

    @Column(name = "muc_ho_tro_so", precision = 12, scale = 2)
    private BigDecimal mucHoTroSo;

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    @Builder.Default
    @OneToMany(mappedBy = "dangKy", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<GiaoDichThang> giaoDichList = new ArrayList<>();
}
