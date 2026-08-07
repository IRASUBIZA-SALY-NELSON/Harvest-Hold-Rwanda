package rw.harvesthold.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rw.harvesthold.api.model.Farmer;
import java.util.Optional;

public interface FarmerRepository extends JpaRepository<Farmer, Long> {
    Optional<Farmer> findByPhone(String phone);
}
