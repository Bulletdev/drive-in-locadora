package com.drivein.locadora.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "addresses")
public class AddressEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEntity user;

    @Column(name = "street", nullable = false, length = 160)
    private String street;

    @Column(name = "number", nullable = false, length = 32)
    private String number;

    @Column(name = "complement", length = 160)
    private String complement;

    @Column(name = "neighborhood", length = 120)
    private String neighborhood;

    @Column(name = "city", nullable = false, length = 120)
    private String city;

    @Column(name = "state", nullable = false, length = 2)
    private String state;

    @Column(name = "cep", nullable = false, length = 9)
    private String cep;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }
    public String getComplement() { return complement; }
    public void setComplement(String complement) { this.complement = complement; }
    public String getNeighborhood() { return neighborhood; }
    public void setNeighborhood(String neighborhood) { this.neighborhood = neighborhood; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }
}