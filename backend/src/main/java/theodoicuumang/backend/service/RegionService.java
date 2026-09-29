package theodoicuumang.backend.service;

import theodoicuumang.backend.dto.RegionCreateRequest;
import theodoicuumang.backend.dto.RegionDTO;
import theodoicuumang.backend.entity.KhuVuc;
import theodoicuumang.backend.exception.ResourceNotFoundException;
import theodoicuumang.backend.repository.KhuVucRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RegionService {

    private final KhuVucRepository khuVucRepository;

    public List<RegionDTO> layTatCa() {
        Map<Integer, BigDecimal> mucTbMap = khuVucRepository.tinhMucTbTheoVung().stream()
                .collect(Collectors.toMap(
                        KhuVucRepository.MucTbProjection::getKhuVucId,
                        KhuVucRepository.MucTbProjection::getMucTb
                ));
        return khuVucRepository.findAll().stream()
                .map(k -> toDTO(k, mucTbMap.get(k.getId())))
                .toList();
    }

    @Transactional
    public RegionDTO tao(RegionCreateRequest req) {
        if (khuVucRepository.existsByTenKhuVucIgnoreCase(req.name())) {
            throw new IllegalArgumentException("Vùng '" + req.name() + "' đã tồn tại");
        }
        KhuVuc khuVuc = KhuVuc.builder().tenKhuVuc(req.name()).build();
        return toDTO(khuVucRepository.save(khuVuc), null);
    }

    private KhuVuc timHoacBaoLoi(Integer id) {
        return khuVucRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vùng id=" + id));
    }

    private RegionDTO toDTO(KhuVuc k, BigDecimal mucTb) {
        return new RegionDTO(k.getId(), k.getTenKhuVuc(), mucTb);
    }
}
