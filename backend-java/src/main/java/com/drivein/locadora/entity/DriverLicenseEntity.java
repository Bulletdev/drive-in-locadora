package com.drivein.locadora.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "driver_licenses")
public class DriverLicenseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEntity user;

    @Column(name = "cnh_number", nullable = false, length = 20, unique = true)
    private String cnhNumber;

    @Column(name = "cnh_expiry", nullable = false)
    private LocalDate cnhExpiry;

    @Column(name = "cnh_category", length = 10)
    private String cnhCategory;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }
    public String getCnhNumber() { return cnhNumber; }
    public void setCnhNumber(String cnhNumber) { this.cnhNumber = cnhNumber; }
    public LocalDate getCnhExpiry() { return cnhExpiry; }
    public void setCnhExpiry(LocalDate cnhExpiry) { this.cnhExpiry = cnhExpiry; }
    public String getCnhCategory() { return cnhCategory; }
    public void setCnhCategory(String cnhCategory) { this.cnhCategory = cnhCategory; }
}