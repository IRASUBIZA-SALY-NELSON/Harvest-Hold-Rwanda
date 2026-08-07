package rw.harvesthold.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rw.harvesthold.api.model.HelpTicket;
import java.util.List;

public interface HelpTicketRepository extends JpaRepository<HelpTicket, Long> {
    List<HelpTicket> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
}
