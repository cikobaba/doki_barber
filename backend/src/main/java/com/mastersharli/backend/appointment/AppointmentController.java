package com.mastersharli.backend.appointment;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.*;
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentRepository repository;
    private final ZoneId zone;
    public AppointmentController(AppointmentRepository repository, @Value("${booking.zone}") String zone) {
        this.repository = repository;
        this.zone = ZoneId.of(zone);
    }
    @PostMapping
    public ResponseEntity<Confirmation> create(@Valid @RequestBody BookingRequest request) {
        if (!LocalDateTime.of(request.date(), request.time()).isAfter(LocalDateTime.now(zone))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Geçmiş bir zamana randevu alınamaz.");
        }
        if (request.time().getHour() < 10 || request.time().getHour() > 18 ||
                request.time().getMinute() != 0 || request.time().getSecond() != 0 || request.time().getNano() != 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "10:00–18:00 arasında tam saat seçin.");
        }
        Appointment appointment = new Appointment();
        appointment.setFullName(request.fullName().trim());
        appointment.setPhone(request.phone().trim());
        appointment.setEmail(request.email());
        appointment.setService(request.service());
        appointment.setDate(request.date());
        appointment.setTime(request.time());
        appointment.setNote(request.note());
        appointment.setCreatedAt(LocalDateTime.now(zone));
        Appointment saved = repository.saveAndFlush(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(new Confirmation(saved.getId(), saved.getDate(), saved.getTime()));
    }
    public record Confirmation(Long id, LocalDate date, LocalTime time) {}
}
