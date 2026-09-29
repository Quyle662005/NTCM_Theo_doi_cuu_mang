package theodoicuumang.backend.controller;

import theodoicuumang.backend.dto.ApiResponse;
import theodoicuumang.backend.dto.RegionCreateRequest;
import theodoicuumang.backend.dto.RegionDTO;
import theodoicuumang.backend.service.RegionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/regions")
@RequiredArgsConstructor
public class RegionController {

    private final RegionService regionService;

    @GetMapping
    public ApiResponse<List<RegionDTO>> getAll() {
        return ApiResponse.ok(regionService.layTatCa());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<RegionDTO> create(@Valid @RequestBody RegionCreateRequest request) {
        return ApiResponse.ok(regionService.tao(request), "Đã tạo vùng mới");
    }
}
