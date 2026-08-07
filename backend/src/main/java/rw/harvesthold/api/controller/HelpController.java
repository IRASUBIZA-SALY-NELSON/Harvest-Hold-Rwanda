package rw.harvesthold.api.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import rw.harvesthold.api.dto.HelpTicketRequest;
import rw.harvesthold.api.model.HelpTicket;
import rw.harvesthold.api.repository.HelpTicketRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/farmers/{farmerId}/help")
public class HelpController {

    private final HelpTicketRepository tickets;

    public HelpController(HelpTicketRepository tickets) {
        this.tickets = tickets;
    }

    @GetMapping
    public List<Map<String, Object>> list(@PathVariable Long farmerId) {
        return tickets.findByFarmerIdOrderByCreatedAtDesc(farmerId).stream().map(this::toMap).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> create(@PathVariable Long farmerId, @Valid @RequestBody HelpTicketRequest req) {
        HelpTicket ticket = new HelpTicket();
        ticket.setFarmerId(farmerId);
        ticket.setUnitId(req.getUnitId());
        ticket.setTopic(req.getTopic());
        ticket.setDetails(req.getDetails());
        ticket.setStatus("Open");
        return toMap(tickets.save(ticket));
    }

    private Map<String, Object> toMap(HelpTicket t) {
        return Map.of(
                "id", t.getId(),
                "unitId", t.getUnitId() == null ? "" : t.getUnitId(),
                "topic", t.getTopic(),
                "details", t.getDetails(),
                "status", t.getStatus(),
                "createdAt", t.getCreatedAt().toString()
        );
    }
}
