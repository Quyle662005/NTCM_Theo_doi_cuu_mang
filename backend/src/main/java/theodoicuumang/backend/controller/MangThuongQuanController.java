package theodoicuumang.backend.controller;

import theodoicuumang.backend.dto.ApiResponse;
import theodoicuumang.backend.dto.MangThuongQuanSuggestionDTO;
import theodoicuumang.backend.entity.MangThuongQuan;
import theodoicuumang.backend.repository.MangThuongQuanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mang-thuong-quan")
@RequiredArgsConstructor
public class MangThuongQuanController {

    private final MangThuongQuanRepository mtqRepository;

    /** GET /api/mang-thuong-quan?q=... -> gợi ý MTQ đã có sẵn khớp với từ khoá (autocomplete) */
    @GetMapping
    public ApiResponse<List<MangThuongQuanSuggestionDTO>> search(
            @RequestParam(required = false, defaultValue = "") String q
    ) {
        List<MangThuongQuanSuggestionDTO> result = mtqRepository.timTheoTen(q).stream()
                .map(m -> new MangThuongQuanSuggestionDTO(m.getId(), m.getTenMtq()))
                .toList();
        return ApiResponse.ok(result);
    }
}