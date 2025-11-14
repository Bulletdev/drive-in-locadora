package com.drivein.locadora.model;

public class Vehicle {
    private String id;
    private String name;
    private String category;
    private int year;
    private String[] images;
    private double pricePerDay;
    private String transmission;
    private int passengers;
    private String fuel;
    private boolean available;
    private Integer doors;
    private Boolean airConditioning;
    private String description;
    private String[] features;

    public Vehicle() {}

    // getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
    public String[] getImages() { return images; }
    public void setImages(String[] images) { this.images = images; }
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
    public String[] getFeatures() { return features; }
    public void setFeatures(String[] features) { this.features = features; }
}