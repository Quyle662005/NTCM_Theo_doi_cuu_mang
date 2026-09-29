package theodoicuumang.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "khu_vuc")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KhuVuc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_khu_vuc", nullable = false, unique = true, length = 100)
    private String tenKhuVuc;
}
