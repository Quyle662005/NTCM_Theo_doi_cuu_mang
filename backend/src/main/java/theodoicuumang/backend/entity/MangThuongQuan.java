package theodoicuumang.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "mang_thuong_quan")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MangThuongQuan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_mtq", nullable = false, unique = true, length = 200)
    private String tenMtq;
}
