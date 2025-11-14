package com.drivein.locadora.repo;

import com.drivein.locadora.entity.DriverLicenseEntity;
import com.drivein.locadora.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DriverLicenseRepository extends JpaRepository<DriverLicenseEntity, Long> {
    Optional<DriverLicenseEntity> findByUser(UserEntity user);
    boolean existsByCnhNumber(String cnhNumber);
}