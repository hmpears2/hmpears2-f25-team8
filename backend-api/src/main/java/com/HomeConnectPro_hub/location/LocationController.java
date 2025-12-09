package com.HomeConnectPro_hub.location;

import com.HomeConnectPro_hub.service.Service;
import com.HomeConnectPro_hub.service.ServiceService;
import com.HomeConnectPro_hub.customer.Customer;
import com.HomeConnectPro_hub.customer.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * ============================================================================
 * Location Controller - REST API for location-based service filtering
 * ============================================================================
 * 
 * Provides endpoints for:
 * 1. Getting services filtered by distance from customer
 * 2. Calculating distance between addresses
 * 3. Geocoding addresses to coordinates
 */
@RestController
@RequestMapping("/api/location")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LocationController {

    private final LocationService locationService;
    private final ServiceService serviceService;
    private final CustomerService customerService;

    /**
     * Get all services sorted by distance from a customer
     * 
     * GET /api/location/services/nearby?customerId={id}&maxDistance={miles}
     */
    @GetMapping("/services/nearby")
    public ResponseEntity<List<ServiceWithDistance>> getNearbyServices(
            @RequestParam Long customerId,
            @RequestParam(defaultValue = "25") double maxDistance) {
        
        try {
            // Get customer's address
            Customer customer = customerService.getCustomerById(customerId);
            String customerAddress = customer.getAddress();
            
            // Get all active services
            List<Service> services = serviceService.getActiveServices();
            
            // Calculate distance for each service and filter
            List<ServiceWithDistance> nearbyServices = services.stream()
                    .map(service -> {
                        String providerAddress = service.getProvider().getAddress();
                        double distance = locationService.calculateDistanceBetweenAddresses(
                                customerAddress, providerAddress);
                        return new ServiceWithDistance(service, distance);
                    })
                    .filter(swd -> swd.getDistance() <= maxDistance)
                    .sorted(Comparator.comparingDouble(ServiceWithDistance::getDistance))
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(nearbyServices);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get all services with distance information (no filtering)
     * 
     * GET /api/location/services/with-distance?customerId={id}
     */
    @GetMapping("/services/with-distance")
    public ResponseEntity<List<ServiceWithDistance>> getServicesWithDistance(
            @RequestParam Long customerId) {
        
        try {
            Customer customer = customerService.getCustomerById(customerId);
            String customerAddress = customer.getAddress();
            
            List<Service> services = serviceService.getActiveServices();
            
            List<ServiceWithDistance> servicesWithDistance = services.stream()
                    .map(service -> {
                        String providerAddress = service.getProvider().getAddress();
                        double distance = locationService.calculateDistanceBetweenAddresses(
                                customerAddress, providerAddress);
                        return new ServiceWithDistance(service, distance);
                    })
                    .sorted(Comparator.comparingDouble(ServiceWithDistance::getDistance))
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(servicesWithDistance);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Calculate distance between two addresses
     * 
     * GET /api/location/distance?from={address1}&to={address2}
     */
    @GetMapping("/distance")
    public ResponseEntity<Map<String, Object>> getDistance(
            @RequestParam String from,
            @RequestParam String to) {
        
        try {
            double distance = locationService.calculateDistanceBetweenAddresses(from, to);
            
            Map<String, Object> response = new HashMap<>();
            response.put("from", from);
            response.put("to", to);
            response.put("distanceMiles", Math.round(distance * 10.0) / 10.0);
            response.put("distanceKm", Math.round(distance * 1.60934 * 10.0) / 10.0);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to calculate distance");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Geocode an address to get coordinates
     * 
     * GET /api/location/geocode?address={address}
     */
    @GetMapping("/geocode")
    public ResponseEntity<Map<String, Object>> geocodeAddress(@RequestParam String address) {
        try {
            LocationService.GeoLocation location = locationService.geocodeAddress(address);
            
            if (location != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("address", address);
                response.put("latitude", location.getLatitude());
                response.put("longitude", location.getLongitude());
                response.put("formattedAddress", location.getFormattedAddress());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Could not geocode address");
                return ResponseEntity.badRequest().body(error);
            }
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Geocoding failed");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get distance ranges/buckets for services
     * 
     * GET /api/location/services/distance-summary?customerId={id}
     */
    @GetMapping("/services/distance-summary")
    public ResponseEntity<Map<String, Object>> getDistanceSummary(@RequestParam Long customerId) {
        try {
            Customer customer = customerService.getCustomerById(customerId);
            String customerAddress = customer.getAddress();
            
            List<Service> services = serviceService.getActiveServices();
            
            int within5Miles = 0;
            int within10Miles = 0;
            int within25Miles = 0;
            int beyond25Miles = 0;
            
            for (Service service : services) {
                String providerAddress = service.getProvider().getAddress();
                double distance = locationService.calculateDistanceBetweenAddresses(
                        customerAddress, providerAddress);
                
                if (distance <= 5) within5Miles++;
                else if (distance <= 10) within10Miles++;
                else if (distance <= 25) within25Miles++;
                else beyond25Miles++;
            }
            
            Map<String, Object> summary = new HashMap<>();
            summary.put("customerAddress", customerAddress);
            summary.put("totalServices", services.size());
            summary.put("within5Miles", within5Miles);
            summary.put("within10Miles", within10Miles);
            summary.put("within25Miles", within25Miles);
            summary.put("beyond25Miles", beyond25Miles);
            
            return ResponseEntity.ok(summary);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * DTO for service with distance information
     */
    public static class ServiceWithDistance {
        private final Service service;
        private final double distance;

        public ServiceWithDistance(Service service, double distance) {
            this.service = service;
            this.distance = Math.round(distance * 10.0) / 10.0; // Round to 1 decimal
        }

        public Service getService() {
            return service;
        }

        public double getDistance() {
            return distance;
        }
        
        public String getDistanceFormatted() {
            if (distance < 1) {
                return "< 1 mile away";
            } else if (distance == 1) {
                return "1 mile away";
            } else {
                return distance + " miles away";
            }
        }
    }
}
