package theodoicuumang.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "thanh_vien")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThanhVien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hoan_canh_id", nullable = false)
    private HoanCanh hoanCanh;

    @Column(name = "ten", nullable = false, length = 200)
    private String ten;

    /** 'TRUNG_CHUYEN' | 'HO_TRO' */
    @Column(name = "loai", nullable = false, length = 20)
    private String loai;
}
