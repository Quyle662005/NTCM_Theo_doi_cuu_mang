package theodoicuumang.backend.repository;

import theodoicuumang.backend.entity.KhuVuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface KhuVucRepository extends JpaRepository<KhuVuc, Integer> {

    boolean existsByTenKhuVucIgnoreCase(String tenKhuVuc);

    /** mucTb = mức trung bình (mucDeXuat) của tất cả hoàn cảnh trong từng vùng - tính động, không lưu DB */
    @Query("""
        SELECT h.khuVuc.id AS khuVucId, AVG(h.mucDeXuat) AS mucTb
        FROM HoanCanh h
        WHERE h.khuVuc IS NOT NULL AND h.mucDeXuat IS NOT NULL
        GROUP BY h.khuVuc.id
        """)
    List<MucTbProjection> tinhMucTbTheoVung();

    interface MucTbProjection {
        Integer getKhuVucId();
        BigDecimal getMucTb();
    }
}
