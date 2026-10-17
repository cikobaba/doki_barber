package com.mastersharli.backend;
import com.mastersharli.backend.appointment.AppointmentRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import java.time.*;
import java.util.concurrent.*;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest
@AutoConfigureMockMvc
class BookingApiTests {
    @Autowired MockMvc mvc;
    @Autowired AppointmentRepository repository;
    @BeforeEach void clearTestDatabase() { repository.deleteAll(); }
    String payload(String date, String time) {
        return """
            {"fullName":"Test Customer","phone":"+905550000000","email":"test@example.com",
             "service":"Saç Kesimi","date":"%s","time":"%s","note":"Test"}
            """.formatted(date, time);
    }
    String tomorrow() { return LocalDate.now(ZoneId.of("Europe/Istanbul")).plusDays(1).toString(); }
    int create(String json) throws Exception {
        return mvc.perform(post("/api/appointments").contentType("application/json").content(json))
            .andReturn().getResponse().getStatus();
    }
    @Test void createsWithoutExposingPersonalData() throws Exception {
        mvc.perform(post("/api/appointments").contentType("application/json").content(payload(tomorrow(), "10:00")))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.id").isNumber())
            .andExpect(jsonPath("$.fullName").doesNotExist()).andExpect(jsonPath("$.phone").doesNotExist());
        assertThat(repository.count()).isEqualTo(1);
    }
    @Test void rejectsInvalidFieldsAndMalformedJson() throws Exception {
        for (String body : List.of("{}", "{", payload(tomorrow(), "10:00").replace("Test Customer", " "),
                payload(tomorrow(), "10:00").replace("test@example.com", "invalid"),
                payload(tomorrow(), "10:00").replace("Saç Kesimi", "unknown"),
                payload(tomorrow(), "10:00").replace("+905550000000", "bad"))) {
            assertThat(create(body)).isEqualTo(400);
        }
        assertThat(repository.count()).isZero();
    }
    @Test void rejectsPastAndOffGridTimes() throws Exception {
        assertThat(create(payload("2000-01-01", "10:00"))).isEqualTo(400);
        for (String time : List.of("09:00", "19:00", "10:30", "10:00:01")) {
            assertThat(create(payload(tomorrow(), time))).isEqualTo(400);
        }
    }
    @Test void duplicateSlotReturnsConflict() throws Exception {
        assertThat(create(payload(tomorrow(), "10:00"))).isEqualTo(201);
        assertThat(create(payload(tomorrow(), "10:00"))).isEqualTo(409);
        assertThat(create(payload(tomorrow(), "11:00"))).isEqualTo(201);
    }
    @Test void concurrentBookingHasExactlyOneWinner() throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);
        CountDownLatch start = new CountDownLatch(1);
        Callable<Integer> booking = () -> { start.await(); return create(payload(tomorrow(), "12:00")); };
        try {
            Future<Integer> first = pool.submit(booking);
            Future<Integer> second = pool.submit(booking);
            start.countDown();
            assertThat(List.of(first.get(15, TimeUnit.SECONDS), second.get(15, TimeUnit.SECONDS)))
                .containsExactlyInAnyOrder(201, 409);
            assertThat(repository.count()).isEqualTo(1);
        } finally { pool.shutdownNow(); }
    }
    @Test void appointmentListingAndConsoleAreForbidden() throws Exception {
        mvc.perform(get("/api/appointments")).andExpect(status().isForbidden());
        mvc.perform(get("/h2-console")).andExpect(status().isForbidden());
        mvc.perform(get("/actuator/env")).andExpect(status().isForbidden());
    }
    @Test void probesArePublicAndDoNotExposeDetails() throws Exception {
        mvc.perform(get("/actuator/health/readiness")).andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("UP")).andExpect(jsonPath("$.components").doesNotExist());
        mvc.perform(get("/actuator/health/liveness")).andExpect(status().isOk());
    }
}
