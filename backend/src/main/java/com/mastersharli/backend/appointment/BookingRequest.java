package com.mastersharli.backend.appointment;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;
public record BookingRequest(
    @NotBlank @Size(max = 100) String fullName,
    @NotBlank @Pattern(regexp = "[+0-9() .-]{7,30}") String phone,
    @Email @Size(max = 254) String email,
    @NotBlank @Pattern(regexp = "Saç Kesimi|Sakal Bakımı|Klasik Tıraş|Saç Bakımı|Premium Hizmet") String service,
    @NotNull LocalDate date,
    @NotNull LocalTime time,
    @Size(max = 1000) String note
) {}
