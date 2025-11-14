package com.drivein.locadora.api;

import com.drivein.locadora.model.Vehicle;
import com.drivein.locadora.entity.VehicleEntity;
import com.drivein.locadora.repo.VehicleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    private final VehicleRepository vehicleRepository;

    public VehicleController(VehicleRepository vehicleRepository) { this.vehicleRepository = vehicleRepository; }

    @GetMapping
    public ResponseEntity<?> list(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "categorias", required = false) String categorias,
            @RequestParam(value = "transmissoes", required = false) String transmissoes,
            @RequestParam(value = "anos", required = false) String anos,
            @RequestParam(value = "minPreco", required = false) Double minPreco,
            @RequestParam(value = "maxPreco", required = false) Double maxPreco,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "pageSize", required = false) Integer pageSize
    ) {
        try {
            List<Vehicle> all = new ArrayList<>();
            for (VehicleEntity ve : vehicleRepository.findAll()) {
                all.add(toModel(ve));
            }

            // Categories (support both `category` single and `categorias` multi)
            Set<String> categorySet = new HashSet<>();
            if (category != null && !category.isBlank()) categorySet.add(category.trim());
            if (categorias != null && !categorias.isBlank()) {
                for (String c : categorias.split(",")) {
                    if (!c.isBlank()) categorySet.add(c.trim());
                }
            }

            // Transmissions (normalize "Automática" to "Automático" for comparison)
            Set<String> transmissionSet = new HashSet<>();
            if (transmissoes != null && !transmissoes.isBlank()) {
                for (String t : transmissoes.split(",")) {
                    if (!t.isBlank()) transmissionSet.add(t.trim());
                }
            }

            // Years
            Set<Integer> yearSet = new HashSet<>();
            if (anos != null && !anos.isBlank()) {
                for (String y : anos.split(",")) {
                    try {
                        yearSet.add(Integer.parseInt(y.trim()));
                    } catch (NumberFormatException ignored) {}
                }
            }

            double min = (minPreco != null) ? minPreco : 0d;
            double max = (maxPreco != null) ? maxPreco : Double.MAX_VALUE;

            // Filtering
            List<Vehicle> filtered = new ArrayList<>();
            for (Vehicle v : all) {
                // Category filter
                if (!categorySet.isEmpty() && !categorySet.contains(v.getCategory())) continue;

                // Transmission filter (handle "Automática" vs "Automático")
                String vt = v.getTransmission();
                String normalizedVt = vt != null && vt.toLowerCase(Locale.ROOT).startsWith("autom") ? "Automático" : vt;
                if (!transmissionSet.isEmpty() && !transmissionSet.contains(normalizedVt)) continue;

                // Year filter
                if (!yearSet.isEmpty() && !yearSet.contains(v.getYear())) continue;

                // Price filter
                double price = v.getPricePerDay();
                if (price < min || price > max) continue;

                filtered.add(v);
            }

            // Pagination
            int p = (page != null && page > 0) ? page : 1;
            int ps = (pageSize != null && pageSize > 0) ? pageSize : 9;
            int from = Math.max(0, (p - 1) * ps);
            int to = Math.min(filtered.size(), from + ps);
            if (from >= filtered.size()) {
                return ResponseEntity.ok(Collections.emptyList());
            }
            List<Vehicle> pageItems = filtered.subList(from, to);
            return ResponseEntity.ok(pageItems);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public Vehicle get(@PathVariable("id") String id) {
        return vehicleRepository.findById(id)
                .map(this::toModel)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Vehicle not found"));
    }

    private Vehicle toModel(VehicleEntity ve) {
        Vehicle v = new Vehicle();
        v.setId(ve.getId());
        v.setName(ve.getName());
        v.setCategory(ve.getCategory());
        v.setYear(ve.getYear());
        v.setPricePerDay(ve.getPricePerDay());
        v.setTransmission(ve.getTransmission());
        v.setPassengers(ve.getPassengers());
        v.setFuel(ve.getFuel());
        v.setAvailable(ve.isAvailable());
        v.setDoors(ve.getDoors());
        v.setAirConditioning(ve.getAirConditioning());
        v.setDescription(ve.getDescription());
        if (ve.getImagesJson() != null && !ve.getImagesJson().isBlank()) {
            v.setImages(parseStringArray(ve.getImagesJson()));
        } else {
            v.setImages(new String[]{});
        }
        if (ve.getFeaturesJson() != null && !ve.getFeaturesJson().isBlank()) {
            v.setFeatures(parseStringArray(ve.getFeaturesJson()));
        }
        return v;
    }

    private String[] parseStringArray(String json) {
        String trimmed = json.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            String inner = trimmed.substring(1, trimmed.length() - 1).trim();
            if (inner.isEmpty()) return new String[]{};
            // very simple parser for ["a","b"]
            List<String> out = new ArrayList<>();
            String[] parts = inner.split(",");
            for (String p : parts) {
                String s = p.trim();
                if (s.startsWith("\"") && s.endsWith("\"")) {
                    s = s.substring(1, s.length() - 1);
                }
                out.add(s);
            }
            return out.toArray(new String[0]);
        }
        return new String[]{};
    }

    
}