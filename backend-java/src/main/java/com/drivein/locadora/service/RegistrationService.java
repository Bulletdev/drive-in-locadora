package com.drivein.locadora.service;

import com.drivein.locadora.entity.AddressEntity;
import com.drivein.locadora.entity.DriverLicenseEntity;
import com.drivein.locadora.entity.UserEntity;
import com.drivein.locadora.model.User;
import com.drivein.locadora.repo.AddressRepository;
import com.drivein.locadora.repo.DriverLicenseRepository;
import com.drivein.locadora.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;

@Service
@ConditionalOnBean(UserRepository.class)
public class RegistrationService {
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final DriverLicenseRepository driverLicenseRepository;

    @Autowired
    public RegistrationService(UserRepository userRepository,
                               AddressRepository addressRepository,
                               DriverLicenseRepository driverLicenseRepository) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.driverLicenseRepository = driverLicenseRepository;
    }

    public UserEntity persistAll(User user) {
        UserEntity ue = new UserEntity();
        ue.setName(user.getName());
        ue.setEmail(user.getEmail());
        ue.setPhone(user.getPhone());
        ue.setCpf(user.getCpf());
        // Hashear a senha do usuário ao persistir
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
            ue.setPasswordHash(enc.encode(user.getPassword()));
        }
        if (user.getBirthDate() != null && !user.getBirthDate().isBlank()) {
            ue.setBirthDate(LocalDate.parse(user.getBirthDate()));
        }
        ue = userRepository.save(ue);

        AddressEntity addr = new AddressEntity();
        addr.setUser(ue);
        addr.setStreet(user.getAddressStreet());
        addr.setNumber(user.getAddressNumber());
        addr.setComplement(user.getAddressComplement());
        addr.setNeighborhood(user.getAddressNeighborhood());
        addr.setCity(user.getAddressCity());
        addr.setState(user.getAddressState());
        addr.setCep(user.getAddressCep());
        addressRepository.save(addr);

        DriverLicenseEntity dl = new DriverLicenseEntity();
        dl.setUser(ue);
        dl.setCnhNumber(user.getCnhNumber());
        dl.setCnhCategory(user.getCnhCategory());
        if (user.getCnhExpiry() != null && !user.getCnhExpiry().isBlank()) {
            dl.setCnhExpiry(LocalDate.parse(user.getCnhExpiry()));
        } else {
            dl.setCnhExpiry(LocalDate.now().plusYears(1));
        }
        driverLicenseRepository.save(dl);

        return ue;
    }
}