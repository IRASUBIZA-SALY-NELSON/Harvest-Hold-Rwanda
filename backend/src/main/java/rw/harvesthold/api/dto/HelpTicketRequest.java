package rw.harvesthold.api.dto;

import jakarta.validation.constraints.NotBlank;

public class HelpTicketRequest {
    private String unitId;
    @NotBlank
    private String topic;
    @NotBlank
    private String details;

    public String getUnitId() { return unitId; }
    public void setUnitId(String unitId) { this.unitId = unitId; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
