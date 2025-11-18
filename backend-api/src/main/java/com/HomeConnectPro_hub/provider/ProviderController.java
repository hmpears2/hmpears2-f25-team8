package com.HomeConnectPro_hub.provider;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/providers")
@CrossOrigin(
    origins = "http://localhost:5175",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowedHeaders = "*",
    allowCredentials = "true"
)
public class ProviderController {
    
    @Autowired
    private ProviderService ProviderService;
    
    @PostMapping("/register")
    public ResponseEntity<Provider> registerProvider(@RequestBody @NonNull Provider provider){
        Provider savedProvider = ProviderService.saveProvider(provider);
        return ResponseEntity.ok(savedProvider);
    }
    
    @PostMapping("/login")
    public ResponseEntity<Provider> login(@RequestBody Provider loginRequest) {
        Optional<Provider> provider = ProviderService.findByEmailAndPassword(loginRequest.getEmail(), loginRequest.getPassword());
        return provider.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Provider> getProvider(@PathVariable @NonNull Long id) {
        Optional<Provider> provider = ProviderService.getProviderById(id);
        if (provider.isEmpty()) {
            return ResponseEntity.notFound().build(); 
        } else {
            return ResponseEntity.ok(provider.get());
        }
    }
    
    @GetMapping("/providers")
    public List<Provider> getAllProviders() {
        return ProviderService.findAllProviders();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Provider> updateProvider(@PathVariable Long id, @RequestBody Provider provider) {
        provider.setId(id);
        Provider updatedProvider = ProviderService.saveProvider(provider);
        return ResponseEntity.ok(updatedProvider);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvider(@PathVariable @NonNull Long id) {
        ProviderService.deleteProvider(id);
        return ResponseEntity.noContent().build();
    }
}