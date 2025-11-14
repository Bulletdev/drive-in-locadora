package com.drivein.locadora.repo;

import com.drivein.locadora.entity.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<ReservationEntity, String> {
    List<ReservationEntity> findByUserEmail(String userEmail);
}