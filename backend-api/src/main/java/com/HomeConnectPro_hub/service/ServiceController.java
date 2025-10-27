package com.HomeConnectPro_hub.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ServiceController {
    
    private final ServiceService serviceService;
    
    /**
     * Get all services
     */
    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }
    
    /**
     * Get service by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.getServiceById(id));
    }
    
    /**
     * Create a new service
     */
    @PostMapping
    public ResponseEntity<Service> createService(@RequestBody Service service) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(serviceService.createService(service));
    }
    
    /**
     * Update a service
     */
    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(
            @PathVariable Long id,
            @RequestBody Service service) {
        return ResponseEntity.ok(serviceService.updateService(id, service));
    }
    
    /**
     * Delete a service
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Get services by provider ID
     */
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Service>> getServicesByProvider(@PathVariable Long providerId) {
        return ResponseEntity.ok(serviceService.getServicesByProviderId(providerId));
    }
    
    /**
     * Get active services
     */
    @GetMapping("/active")
    public ResponseEntity<List<Service>> getActiveServices() {
        return ResponseEntity.ok(serviceService.getActiveServices());
    }
    
    /**
     * Deactivate a service
     */
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Service> deactivateService(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.deactivateService(id));
    }
    
    /**
     * Activate a service
     */
    @PutMapping("/{id}/activate")
    public ResponseEntity<Service> activateService(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.activateService(id));
    }
    
    /**
     * Search services by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<Service>> searchServices(@RequestParam String name) {
        return ResponseEntity.ok(serviceService.searchServicesByName(name));
    }
}
