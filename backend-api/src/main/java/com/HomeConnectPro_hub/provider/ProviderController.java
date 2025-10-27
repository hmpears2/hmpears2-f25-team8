package com.HomeConnectPro_hub.provider;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProviderController {
    
    private final ProviderService providerService;
    
    /**
     * Register a new provider
     */
    @PostMapping("/register")
    public ResponseEntity<Provider> registerProvider(@RequestBody Provider provider) {
        Provider savedProvider = providerService.saveProvider(provider);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProvider);
    }
    
    /**
     * Provider login
     */
    @PostMapping("/login")
    public ResponseEntity<Provider> login(@RequestBody Provider loginRequest) {
        Optional<Provider> provider = providerService.findByEmailAndPassword(
                loginRequest.getEmail(), 
                loginRequest.getPassword()
        );
        return provider.map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
    
    /**
     * Get provider by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Provider> getProvider(@PathVariable Long id) {
        return ResponseEntity.ok(providerService.getProviderById(id));
    }
    
    /**
     * Get all providers
     */
    @GetMapping
    public ResponseEntity<List<Provider>> getAllProviders() {
        return ResponseEntity.ok(providerService.findAllProviders());
    }
    
    /**
     * Get all active providers
     */
    @GetMapping("/active")
    public ResponseEntity<List<Provider>> getActiveProviders() {
        return ResponseEntity.ok(providerService.getActiveProviders());
    }
    
    /**
     * Update provider
     */
    @PutMapping("/{id}")
    public ResponseEntity<Provider> updateProvider(
            @PathVariable Long id, 
            @RequestBody Provider provider) {
        Provider updatedProvider = providerService.updateProvider(id, provider);
        return ResponseEntity.ok(updatedProvider);
    }
    
    /**
     * Delete provider
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable Long id) {
        providerService.deleteProvider(id);
        return ResponseEntity.noContent().build();
    }
}
