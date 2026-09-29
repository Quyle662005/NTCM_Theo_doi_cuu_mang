package theodoicuumang.backend.repository;

import theodoicuumang.backend.entity.HoanCanh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HoanCanhRepository extends JpaRepository<HoanCanh, Integer> {

    @Query("""
        SELECT DISTINCT h FROM HoanCanh h
        LEFT JOIN h.dangKyHoTroList d
        LEFT JOIN d.mangThuongQuan mtq
        WHERE (:regionId IS NULL OR h.khuVuc.id = :regionId)
          AND (
              :keyword IS NULL
              OR LOWER(h.tenHoanCanh) LIKE LOWER(CONCAT('%', :keyword, '%'))
              OR LOWER(h.maHc) LIKE LOWER(CONCAT('%', :keyword, '%'))
              OR LOWER(mtq.tenMtq) LIKE LOWER(CONCAT('%', :keyword, '%'))
          )
        ORDER BY h.id DESC
        """)
    List<HoanCanh> timKiem(
            @Param("regionId") Integer regionId,
            @Param("keyword") String keyword
    );
}