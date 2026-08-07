package rw.harvesthold.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import rw.harvesthold.api.dto.UnitResponse;
import rw.harvesthold.api.model.CoolingUnit;
import rw.harvesthold.api.repository.CoolingUnitRepository;

import java.util.List;

@RestController
@RequestMapping("/api/farmers/{farmerId}/units")
public class UnitController {

    private final CoolingUnitRepository units;

    public UnitController(CoolingUnitRepository units) {
        this.units = units;
    }

    @GetMapping
    public List<UnitResponse> list(@PathVariable Long farmerId) {
        return units.findByFarmerIdOrderByNameAsc(farmerId).stream().map(UnitResponse::from).toList();
    }

    @GetMapping("/{unitId}")
    public UnitResponse one(@PathVariable Long farmerId, @PathVariable String unitId) {
        CoolingUnit unit = units.findById(unitId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unit not found"));
        if (!unit.getFarmerId().equals(farmerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your unit");
        }
        return UnitResponse.from(unit);
    }
}
