package com.drivein.locadora.api;

import com.drivein.locadora.model.Reservation;
import com.drivein.locadora.entity.ReservationEntity;
import com.drivein.locadora.repo.ReservationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationRepository reservationRepository;

    public ReservationController(ReservationRepository reservationRepository) { this.reservationRepository = reservationRepository; }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Reservation r, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        String userEmail = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring("Bearer ".length());
            userEmail = com.drivein.locadora.service.TokenUtil.extractEmail(token);
        }
        r.setUserEmail(userEmail);
        ReservationEntity re = new ReservationEntity();
        re.setId(r.getId() != null ? r.getId() : java.util.UUID.randomUUID().toString());
        re.setCarId(r.getCarId());
        re.setPickupDate(r.getPickupDate());
        re.setReturnDate(r.getReturnDate());
        re.setPickupLocation(r.getPickupLocation());
        re.setReturnLocation(r.getReturnLocation());
        re.setSelectedExtrasJson(r.getSelectedExtras() != null ? new com.fasterxml.jackson.databind.ObjectMapper().valueToTree(r.getSelectedExtras()).toString() : null);
        re.setCustomerName(r.getCustomer() != null ? r.getCustomer().name : null);
        re.setCustomerEmail(r.getCustomer() != null ? r.getCustomer().email : null);
        re.setCustomerPhone(r.getCustomer() != null ? r.getCustomer().phone : null);
        re.setUserEmail(userEmail);
        reservationRepository.save(re);
        Reservation saved = r;
        saved.setId(re.getId());
        Map<String, Object> response = new HashMap<>();
        response.put("id", saved.getId());
        response.put("message", "Reserva criada com sucesso");
        response.put("reservation", saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> myReservations(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Token ausente"));
        }
        String token = authHeader.substring("Bearer ".length());
        String email = com.drivein.locadora.service.TokenUtil.extractEmail(token);
        if (email == null || email.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Token inválido"));
        }
        java.util.List<ReservationEntity> list = reservationRepository.findByUserEmail(email);
        java.util.List<Reservation> out = new java.util.ArrayList<>();
        for (ReservationEntity re : list) {
            Reservation rr = new Reservation();
            rr.setId(re.getId());
            rr.setCarId(re.getCarId());
            rr.setPickupDate(re.getPickupDate());
            rr.setReturnDate(re.getReturnDate());
            rr.setPickupLocation(re.getPickupLocation());
            rr.setReturnLocation(re.getReturnLocation());
            rr.setUserEmail(re.getUserEmail());
            out.add(rr);
        }
        return ResponseEntity.ok(out);
    }
}