package theodoicuumang.backend.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import theodoicuumang.backend.entity.MangThuongQuan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MangThuongQuanRepository extends JpaRepository<MangThuongQuan, Integer> {
    boolean existsByTenMtqIgnoreCase(String tenMtq);
    Optional<MangThuongQuan> findByTenMtqIgnoreCase(String tenMtq);
    @Query("""
        SELECT m FROM MangThuongQuan m
        WHERE LOWER(m.tenMtq) LIKE LOWER(CONCAT('%', :q, '%'))
        ORDER BY m.tenMtq
        """)
    List<MangThuongQuan> timTheoTen(@Param("q") String q);
}
