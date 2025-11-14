package com.drivein.locadora.repo;

import com.drivein.locadora.entity.AddressEntity;
import com.drivein.locadora.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<AddressEntity, Long> {
    Optional<AddressEntity> findByUser(UserEntity user);
}