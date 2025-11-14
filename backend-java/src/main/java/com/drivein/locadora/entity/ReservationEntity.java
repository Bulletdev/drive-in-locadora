package com.drivein.locadora.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "api_reservations")
public class ReservationEntity {
    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "car_id", length = 160, nullable = false)
    private String carId; // references api_vehicles.id

    @Column(name = "pickup_date", length = 32)
    private String pickupDate;

    @Column(name = "return_date", length = 32)
    private String returnDate;

    @Column(name = "pickup_location", length = 160)
    private String pickupLocation;

    @Column(name = "return_location", length = 160)
    private String returnLocation;

    @Column(name = "selected_extras_json", columnDefinition = "TEXT")
    private String selectedExtrasJson;

    @Column(name = "customer_name", length = 160)
    private String customerName;

    @Column(name = "customer_email", length = 190)
    private String customerEmail;

    @Column(name = "customer_phone", length = 32)
    private String customerPhone;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "user_email", length = 190)
    private String userEmail;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCarId() { return carId; }
    public void setCarId(String carId) { this.carId = carId; }
    public String getPickupDate() { return pickupDate; }
    public void setPickupDate(String pickupDate) { this.pickupDate = pickupDate; }
    public String getReturnDate() { return returnDate; }
    public void setReturnDate(String returnDate) { this.returnDate = returnDate; }
    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }
    public String getReturnLocation() { return returnLocation; }
    public void setReturnLocation(String returnLocation) { this.returnLocation = returnLocation; }
    public String getSelectedExtrasJson() { return selectedExtrasJson; }
    public void setSelectedExtrasJson(String selectedExtrasJson) { this.selectedExtrasJson = selectedExtrasJson; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}