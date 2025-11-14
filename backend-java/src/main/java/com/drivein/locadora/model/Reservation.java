package com.drivein.locadora.model;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class Reservation {
    public static class Extra {
        public String id;
        public String name;
        public double price;
    }

    public static class Customer {
        public String name;
        public String email;
        public String phone;
    }

    private String id;
    private String carId;
    private String pickupDate;
    private String returnDate;
    private String pickupLocation;
    private String returnLocation;
    private List<Extra> selectedExtras;
    private Customer customer;
    private String createdAt;
    private String userEmail; // owner (optional for /me)

    public Reservation() { }

    public Reservation(String carId) {
        this.id = UUID.randomUUID().toString();
        this.carId = carId;
        this.createdAt = Instant.now().toString();
    }

    // getters and setters
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
    public List<Extra> getSelectedExtras() { return selectedExtras; }
    public void setSelectedExtras(List<Extra> selectedExtras) { this.selectedExtras = selectedExtras; }
    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}