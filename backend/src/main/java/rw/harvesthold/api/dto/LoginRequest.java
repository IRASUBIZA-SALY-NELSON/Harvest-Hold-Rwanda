package rw.harvesthold.api.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank
    private String phone;
    @NotBlank
    private String pin;

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }
}
