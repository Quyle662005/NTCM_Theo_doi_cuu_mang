package theodoicuumang.backend.repository;

import theodoicuumang.backend.entity.DangKyHoTro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DangKyHoTroRepository extends JpaRepository<DangKyHoTro, Integer> {

    List<DangKyHoTro> findByHoanCanh_Id(Integer hoanCanhId);

    List<DangKyHoTro> findByMangThuongQuan_Id(Integer mtqId);
}
