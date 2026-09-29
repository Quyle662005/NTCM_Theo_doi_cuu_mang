package theodoicuumang.backend.repository;

import theodoicuumang.backend.entity.GiaoDichThang;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GiaoDichThangRepository extends JpaRepository<GiaoDichThang, Integer> {

    List<GiaoDichThang> findByDangKy_IdOrderByNamAscThangAsc(Integer dangKyId);

    Optional<GiaoDichThang> findByDangKy_IdAndThangAndNam(Integer dangKyId, Integer thang, Integer nam);

    void deleteByDangKy_IdAndThangAndNam(Integer dangKyId, Integer thang, Integer nam);
}
