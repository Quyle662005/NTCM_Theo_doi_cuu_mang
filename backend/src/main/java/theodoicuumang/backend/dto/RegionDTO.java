package theodoicuumang.backend.dto;

import java.math.BigDecimal;

/** Khớp `interface Region` bên frontend: { id, name, mucTb } */
public record RegionDTO(Integer id, String name, BigDecimal mucTb) {
}
