package theodoicuumang.backend.service;

import theodoicuumang.backend.dto.*;
import theodoicuumang.backend.entity.*;
import theodoicuumang.backend.exception.ResourceNotFoundException;
import theodoicuumang.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import theodoicuumang.backend.dto.ManhThuongQuanDTO;

import java.time.Year;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HoanCanhService {

    private final HoanCanhRepository hoanCanhRepository;
    private final KhuVucRepository khuVucRepository;
    private final MangThuongQuanRepository mtqRepository;
    private final DangKyHoTroRepository dangKyRepository;
    private final GiaoDichThangRepository giaoDichRepository;
    private final ThanhVienRepository thanhVienRepository;

    // ============ Hoàn cảnh ============

    public List<HoanCanhDTO> timKiem(Integer regionId, String keyword) {
        return hoanCanhRepository.timKiem(regionId, keyword).stream().map(this::toDTO).toList();
    }

    public HoanCanhDTO layTheoId(Integer id) {
        return toDTO(timHoanCanhHoacBaoLoi(id));
    }

    @Transactional
    public HoanCanhDTO tao(HoanCanhRequest req) {
        if (req.regionId() == null) {
            throw new IllegalArgumentException("regionId không được để trống");
        }
        KhuVuc khuVuc = khuVucRepository.findById(req.regionId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vùng id=" + req.regionId()));

        HoanCanh h = HoanCanh.builder()
                .khuVuc(khuVuc)
                .maHc(req.ma())
                .tenHoanCanh(req.ten() != null ? req.ten() : "")
                .link(req.link())
                .khuVucRaw(req.khuVuc())
                .ghiChu(req.ghiChu())
                .mucDeXuat(req.mucDeXuat())
                .mucBinhQuan(req.mucBinhQuan())
                .trangThai(req.trangThai() != null ? req.trangThai() : "Dang ho tro")
                .thongTinLienHe(req.thongTinLienHe())
                .viTri(req.viTri())
                .thongTinChuyenKhoan(req.thongTinChuyenKhoan())
                .build();

        return toDTO(hoanCanhRepository.save(h));
    }

    @Transactional
    public HoanCanhDTO capNhat(Integer id, HoanCanhRequest req) {
        HoanCanh h = timHoanCanhHoacBaoLoi(id);

        if (req.regionId() != null) {
            KhuVuc khuVuc = khuVucRepository.findById(req.regionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vùng id=" + req.regionId()));
            h.setKhuVuc(khuVuc);
        }
        if (req.ma() != null) h.setMaHc(req.ma());
        if (req.ten() != null) h.setTenHoanCanh(req.ten());
        if (req.link() != null) h.setLink(req.link());
        if (req.khuVuc() != null) h.setKhuVucRaw(req.khuVuc());
        if (req.ghiChu() != null) h.setGhiChu(req.ghiChu());
        if (req.mucDeXuat() != null) h.setMucDeXuat(req.mucDeXuat());
        if (req.mucBinhQuan() != null) h.setMucBinhQuan(req.mucBinhQuan());
        if (req.trangThai() != null) h.setTrangThai(req.trangThai());
        if (req.thongTinLienHe() !=null) h.setThongTinLienHe(req.thongTinLienHe());
        if (req.viTri() != null) h.setViTri(req.viTri());
        if (req.thongTinChuyenKhoan() != null) h.setThongTinChuyenKhoan(req.thongTinChuyenKhoan());
        return toDTO(hoanCanhRepository.save(h));
    }

    @Transactional
    public void xoa(Integer id) {
        if (!hoanCanhRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy hoàn cảnh id=" + id);
        }
        hoanCanhRepository.deleteById(id); // thanh_vien, dang_ky_ho_tro, giao_dich_thang liên quan tự xoá theo (CASCADE)
    }

    // ============ MTQ lồng trong hoàn cảnh (= dang_ky_ho_tro) ============

    @Transactional
    public ManhThuongQuanDTO themMtq(Integer hcId, ManhThuongQuanCreateRequest req) {
        HoanCanh h = timHoanCanhHoacBaoLoi(hcId);

        // Tìm hoặc tạo mới MTQ trong danh mục dùng chung (tránh trùng do khác hoa/thường)
        MangThuongQuan mtq = mtqRepository.findByTenMtqIgnoreCase(req.ten().trim())
                .orElseGet(() -> mtqRepository.save(
                        MangThuongQuan.builder().tenMtq(req.ten().trim()).build()
                ));

        DangKyHoTro dangKy = DangKyHoTro.builder()
                .hoanCanh(h)
                .mangThuongQuan(mtq)
                .mucHoTroSo(req.muc())
                .mucHoTroText(req.muc() != null ? req.muc().toPlainString() : null)
                .build();

        return toMtqDTO(dangKyRepository.save(dangKy));
    }

    @Transactional
    public void xoaMtq(Integer dangKyId) {
        if (!dangKyRepository.existsById(dangKyId)) {
            throw new ResourceNotFoundException("Không tìm thấy đăng ký MTQ id=" + dangKyId);
        }
        dangKyRepository.deleteById(dangKyId); // giao_dich_thang liên quan tự xoá theo (CASCADE)
    }


    @Transactional
    public ManhThuongQuanDTO suaMtq(Integer dangKyId, ManhThuongQuanCreateRequest req) {
        DangKyHoTro dangKy = dangKyRepository.findById(dangKyId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đăng ký MTQ id=" + dangKyId));

        MangThuongQuan mtqHienTai = dangKy.getMangThuongQuan();
        String tenMoi = req.ten().trim();

        if (!tenMoi.equalsIgnoreCase(mtqHienTai.getTenMtq())) {
            MangThuongQuan mtqTrung = mtqRepository.findByTenMtqIgnoreCase(tenMoi).orElse(null);

            if (mtqTrung != null && !mtqTrung.getId().equals(mtqHienTai.getId())) {
                // Tên mới trùng với 1 MTQ khác đã tồn tại -> gộp: chuyển toàn bộ
                // đăng ký đang thuộc mtqHienTai sang mtqTrung, rồi xoá mtqHienTai
                List<DangKyHoTro> lienQuan = dangKyRepository.findByMangThuongQuan_Id(mtqHienTai.getId());
                for (DangKyHoTro d : lienQuan) {
                    d.setMangThuongQuan(mtqTrung);
                }
                dangKyRepository.saveAll(lienQuan);
                mtqRepository.delete(mtqHienTai);
            } else {
                // Đổi tên trực tiếp trên danh mục dùng chung -> áp dụng cho
                // TẤT CẢ hoàn cảnh đang dùng chung MTQ này
                mtqHienTai.setTenMtq(tenMoi);
                mtqRepository.save(mtqHienTai);
            }
        }

        dangKy.setMucHoTroSo(req.muc());
        dangKy.setMucHoTroText(req.muc() != null ? req.muc().toPlainString() : null);

        return toMtqDTO(dangKyRepository.save(dangKy));
    }

    // ============ Giao dịch tháng lồng trong MTQ (upsert theo dangKy+thang+năm hiện tại) ============

    @Transactional
    public ThangHoTroDTO capNhatThang(Integer dangKyId, Integer thang, String giaTri) {
        DangKyHoTro dangKy = dangKyRepository.findById(dangKyId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đăng ký MTQ id=" + dangKyId));

        int nam = Year.now().getValue();
        GiaoDichThang giaoDich = giaoDichRepository.findByDangKy_IdAndThangAndNam(dangKyId, thang, nam)
                .orElseGet(() -> GiaoDichThang.builder()
                        .dangKy(dangKy)
                        .hoanCanh(dangKy.getHoanCanh())
                        .mangThuongQuan(dangKy.getMangThuongQuan())
                        .thang(thang)
                        .nam(nam)
                        .build()
                );

        giaoDich.setGiaTriText(giaTri);
        giaoDich.setSoTien(chuyenSangSoNeuHopLe(giaTri));

        GiaoDichThang saved = giaoDichRepository.save(giaoDich);
        return new ThangHoTroDTO(saved.getId(), saved.getThang(), saved.getGiaTriText());
    }

    @Transactional
    public void xoaThang(Integer dangKyId, Integer thang) {
        int nam = Year.now().getValue();
        giaoDichRepository.deleteByDangKy_IdAndThangAndNam(dangKyId, thang, nam);
    }

    private static final Pattern SO_PATTERN = Pattern.compile("^-?\\d+(\\.\\d+)?$");

    private java.math.BigDecimal chuyenSangSoNeuHopLe(String giaTri) {
        if (giaTri == null) return null;
        String s = giaTri.trim().replace(",", "");
        return SO_PATTERN.matcher(s).matches() ? new java.math.BigDecimal(s) : null;
    }

    // ============ Thành viên lồng trong hoàn cảnh ============

    @Transactional
    public ThanhVienDTO themThanhVien(Integer hcId, ThanhVienCreateRequest req) {
        HoanCanh h = timHoanCanhHoacBaoLoi(hcId);
        ThanhVien tv = ThanhVien.builder()
                .hoanCanh(h)
                .ten(req.ten())
                .loai(req.loai())
                .build();
        return toThanhVienDTO(thanhVienRepository.save(tv));
    }

    @Transactional
    public void xoaThanhVien(Integer tvId) {
        if (!thanhVienRepository.existsById(tvId)) {
            throw new ResourceNotFoundException("Không tìm thấy thành viên id=" + tvId);
        }
        thanhVienRepository.deleteById(tvId);
    }

    @Transactional
    public ThanhVienDTO suaThanhVien(Integer tvId, ThanhVienCreateRequest req) {
        ThanhVien tv = thanhVienRepository.findById(tvId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thành viên id=" + tvId));

        tv.setTen(req.ten());
        tv.setLoai(req.loai());

        return toThanhVienDTO(thanhVienRepository.save(tv));
    }

    // ============ Mapping ============

    private HoanCanh timHoanCanhHoacBaoLoi(Integer id) {
        return hoanCanhRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hoàn cảnh id=" + id));
    }

    private HoanCanhDTO toDTO(HoanCanh h) {
        RegionDTO region = h.getKhuVuc() != null
                ? new RegionDTO(h.getKhuVuc().getId(), h.getKhuVuc().getTenKhuVuc(), null)
                : null;

        List<ManhThuongQuanDTO> mtqList = dangKyRepository.findByHoanCanh_Id(h.getId()).stream()
                .map(this::toMtqDTO)
                .toList();

        List<ThanhVienDTO> thanhVienList = thanhVienRepository.findByHoanCanh_Id(h.getId()).stream()
                .map(this::toThanhVienDTO)
                .toList();

        return new HoanCanhDTO(
                h.getId(), region, h.getMaHc(), h.getTenHoanCanh(), h.getLink(), h.getKhuVucRaw(),
                h.getGhiChu(), h.getMucDeXuat(), h.getMucBinhQuan(), h.getTrangThai(), h.getThongTinLienHe(), h.getViTri(), h.getThongTinChuyenKhoan(), mtqList, thanhVienList
        );
    }

    private ManhThuongQuanDTO toMtqDTO(DangKyHoTro d) {
        List<ThangHoTroDTO> thangList = giaoDichRepository.findByDangKy_IdOrderByNamAscThangAsc(d.getId()).stream()
                .map(g -> new ThangHoTroDTO(g.getId(), g.getThang(), g.getGiaTriText()))
                .toList();

        return new ManhThuongQuanDTO(
                d.getId(), d.getMangThuongQuan().getTenMtq(), d.getMucHoTroSo(), thangList
        );
    }

    private ThanhVienDTO toThanhVienDTO(ThanhVien tv) {
        return new ThanhVienDTO(tv.getId(), tv.getTen(), tv.getLoai());
    }
}
