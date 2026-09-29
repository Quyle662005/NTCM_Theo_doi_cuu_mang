package theodoicuumang.backend.controller;

import theodoicuumang.backend.dto.*;
import theodoicuumang.backend.service.HoanCanhService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hoan-canh")
@RequiredArgsConstructor
public class HoanCanhController {

    private final HoanCanhService hoanCanhService;

    // GET /api/hoan-canh?regionId=&q=
    @GetMapping
    public ApiResponse<List<HoanCanhDTO>> getAll(
            @RequestParam(required = false) Integer regionId,
            @RequestParam(required = false) String q
    ) {
        return ApiResponse.ok(hoanCanhService.timKiem(regionId, q));
    }

    // GET /api/hoan-canh/{id}
    @GetMapping("/{id}")
    public ApiResponse<HoanCanhDTO> getById(@PathVariable Integer id) {
        return ApiResponse.ok(hoanCanhService.layTheoId(id));
    }

    // POST /api/hoan-canh
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<HoanCanhDTO> create(@RequestBody HoanCanhRequest request) {
        return ApiResponse.ok(hoanCanhService.tao(request), "Đã tạo hoàn cảnh mới");
    }

    // PUT /api/hoan-canh/{id}
    @PutMapping("/{id}")
    public ApiResponse<HoanCanhDTO> update(@PathVariable Integer id, @RequestBody HoanCanhRequest request) {
        return ApiResponse.ok(hoanCanhService.capNhat(id, request), "Đã cập nhật");
    }

    // DELETE /api/hoan-canh/{id}
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        hoanCanhService.xoa(id);
        return ApiResponse.ok(null, "Đã xoá");
    }

    // POST /api/hoan-canh/{hcId}/mtq
    @PostMapping("/{hcId}/mtq")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ManhThuongQuanDTO> addMtq(
            @PathVariable Integer hcId,
            @Valid @RequestBody ManhThuongQuanCreateRequest request
    ) {
        return ApiResponse.ok(hoanCanhService.themMtq(hcId, request), "Đã thêm MTQ");
    }

    // DELETE /api/hoan-canh/mtq/{mtqId}
    @DeleteMapping("/mtq/{mtqId}")
    public ApiResponse<Void> deleteMtq(@PathVariable Integer mtqId) {
        hoanCanhService.xoaMtq(mtqId);
        return ApiResponse.ok(null, "Đã xoá MTQ");
    }
    // PUT /api/hoan-canh/mtq/{dangKyId}
    @PutMapping("/mtq/{dangKyId}")
    public ApiResponse<ManhThuongQuanDTO> updateMtq(
            @PathVariable Integer dangKyId,
            @Valid @RequestBody ManhThuongQuanCreateRequest request
    ) {
        return ApiResponse.ok(hoanCanhService.suaMtq(dangKyId, request), "Đã cập nhật MTQ");
    }

    // PUT /api/hoan-canh/mtq/{mtqId}/thang/{thang}
    @PutMapping("/mtq/{mtqId}/thang/{thang}")
    public ApiResponse<ThangHoTroDTO> updateThang(
            @PathVariable Integer mtqId,
            @PathVariable Integer thang,
            @Valid @RequestBody ThangUpdateRequest request
    ) {
        return ApiResponse.ok(hoanCanhService.capNhatThang(mtqId, thang, request.giaTri()));
    }


    // DELETE /api/hoan-canh/mtq/{mtqId}/thang/{thang}
    @DeleteMapping("/mtq/{mtqId}/thang/{thang}")
    public ApiResponse<Void> deleteThang(@PathVariable Integer mtqId, @PathVariable Integer thang) {
        hoanCanhService.xoaThang(mtqId, thang);
        return ApiResponse.ok(null, "Đã xoá giá trị tháng");
    }

    // POST /api/hoan-canh/{hcId}/thanh-vien
    @PostMapping("/{hcId}/thanh-vien")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ThanhVienDTO> addThanhVien(
            @PathVariable Integer hcId,
            @Valid @RequestBody ThanhVienCreateRequest request
    ) {
        return ApiResponse.ok(hoanCanhService.themThanhVien(hcId, request), "Đã thêm thành viên");
    }

    // DELETE /api/hoan-canh/thanh-vien/{tvId}
    @DeleteMapping("/thanh-vien/{tvId}")
    public ApiResponse<Void> deleteThanhVien(@PathVariable Integer tvId) {
        hoanCanhService.xoaThanhVien(tvId);
        return ApiResponse.ok(null, "Đã xoá thành viên");
    }

    // PUT /api/hoan-canh/thanh-vien/{tvId}
    @PutMapping("/thanh-vien/{tvId}")
    public ApiResponse<ThanhVienDTO> updateThanhVien(
            @PathVariable Integer tvId,
            @Valid @RequestBody ThanhVienCreateRequest request
    ) {
        return ApiResponse.ok(hoanCanhService.suaThanhVien(tvId, request), "Đã cập nhật thành viên");
    }
}
