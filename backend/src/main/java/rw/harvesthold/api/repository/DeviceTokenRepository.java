package rw.harvesthold.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rw.harvesthold.api.model.DeviceToken;
import java.util.List;
import java.util.Optional;

public interface DeviceTokenRepository extends JpaRepository<DeviceToken, Long> {
    Optional<DeviceToken> findByToken(String token);
    List<DeviceToken> findByFarmerId(Long farmerId);
}
