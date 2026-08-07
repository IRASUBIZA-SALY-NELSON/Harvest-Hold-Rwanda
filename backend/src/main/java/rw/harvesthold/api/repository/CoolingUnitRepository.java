package rw.harvesthold.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rw.harvesthold.api.model.CoolingUnit;
import java.util.List;

public interface CoolingUnitRepository extends JpaRepository<CoolingUnit, String> {
    List<CoolingUnit> findByFarmerIdOrderByNameAsc(Long farmerId);
}
