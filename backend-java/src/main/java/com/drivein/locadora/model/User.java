package com.drivein.locadora.model;

import java.time.Instant;
import java.util.UUID;

public class User {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String cpf;
    private String password; // plain for demo; replace with hashing in production
    private String createdAt;

    // Address fields
    private String addressStreet;
    private String addressNumber;
    private String addressComplement;
    private String addressNeighborhood;
    private String addressCity;
    private String addressState;
    private String addressCep;

    // Driver license (CNH)
    private String birthDate; // YYYY-MM-DD
    private String cnhNumber;
    private String cnhExpiry; // YYYY-MM-DD
    private String cnhCategory; // e.g., B

    public User() {}

    public User(String name, String email, String phone, String cpf, String password) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.cpf = cpf;
        this.password = password;
        this.createdAt = Instant.now().toString();
    }

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getAddressStreet() { return addressStreet; }
    public void setAddressStreet(String addressStreet) { this.addressStreet = addressStreet; }
    public String getAddressNumber() { return addressNumber; }
    public void setAddressNumber(String addressNumber) { this.addressNumber = addressNumber; }
    public String getAddressComplement() { return addressComplement; }
    public void setAddressComplement(String addressComplement) { this.addressComplement = addressComplement; }
    public String getAddressNeighborhood() { return addressNeighborhood; }
    public void setAddressNeighborhood(String addressNeighborhood) { this.addressNeighborhood = addressNeighborhood; }
    public String getAddressCity() { return addressCity; }
    public void setAddressCity(String addressCity) { this.addressCity = addressCity; }
    public String getAddressState() { return addressState; }
    public void setAddressState(String addressState) { this.addressState = addressState; }
    public String getAddressCep() { return addressCep; }
    public void setAddressCep(String addressCep) { this.addressCep = addressCep; }

    public String getBirthDate() { return birthDate; }
    public void setBirthDate(String birthDate) { this.birthDate = birthDate; }
    public String getCnhNumber() { return cnhNumber; }
    public void setCnhNumber(String cnhNumber) { this.cnhNumber = cnhNumber; }
    public String getCnhExpiry() { return cnhExpiry; }
    public void setCnhExpiry(String cnhExpiry) { this.cnhExpiry = cnhExpiry; }
    public String getCnhCategory() { return cnhCategory; }
    public void setCnhCategory(String cnhCategory) { this.cnhCategory = cnhCategory; }
}