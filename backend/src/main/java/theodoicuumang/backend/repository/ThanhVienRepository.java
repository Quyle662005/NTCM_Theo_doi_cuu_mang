package theodoicuumang.backend.repository;

import theodoicuumang.backend.entity.ThanhVien;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ThanhVienRepository extends JpaRepository<ThanhVien, Integer> {
    List<ThanhVien> findByHoanCanh_Id(Integer hoanCanhId);
}
