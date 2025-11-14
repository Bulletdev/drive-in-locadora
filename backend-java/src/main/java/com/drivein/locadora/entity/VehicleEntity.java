package com.drivein.locadora.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "api_vehicles")
public class VehicleEntity {
    @Id
    @Column(length = 160)
    private String id; // slug

    @Column(nullable = false, length = 160)
    private String name;

    @Column(nullable = false, length = 60)
    private String category;

    @Column(nullable = false)
    private int year;

    @Column(name = "images_json", columnDefinition = "TEXT")
    private String imagesJson;

    @Column(name = "price_per_day", nullable = false)
    private double pricePerDay;

    @Column(nullable = false, length = 60)
    private String transmission;

    @Column(nullable = false)
    private int passengers;

    @Column(nullable = false, length = 60)
    private String fuel;

    @Column(nullable = false)
    private boolean available;

    @Column
    private Integer doors;

    @Column(name = "air_conditioning")
    private Boolean airConditioning;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "features_json", columnDefinition = "TEXT")
    private String featuresJson;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
    public String getImagesJson() { return imagesJson; }
    public void setImagesJson(String imagesJson) { this.imagesJson = imagesJson; }
    public double getPricePerDay() { return pricePerDay; }
    public void setPricePerDay(double pricePerDay) { this.pricePerDay = pricePerDay; }
    public String getTransmission() { return transmission; }
    public void setTransmission(String transmission) { this.transmission = transmission; }
    public int getPassengers() { return passengers; }
    public void setPassengers(int passengers) { this.passengers = passengers; }
    public String getFuel() { return fuel; }
    public void setFuel(String fuel) { this.fuel = fuel; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public Integer getDoors() { return doors; }
    public void setDoors(Integer doors) { this.doors = doors; }
    public Boolean getAirConditioning() { return airConditioning; }
    public void setAirConditioning(Boolean airConditioning) { this.airConditioning = airConditioning; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getFeaturesJson() { return featuresJson; }
    public void setFeaturesJson(String featuresJson) { this.featuresJson = featuresJson; }
}