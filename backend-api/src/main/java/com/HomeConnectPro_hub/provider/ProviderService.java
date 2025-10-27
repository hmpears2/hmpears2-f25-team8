package com.HomeConnectPro_hub.provider;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProviderService {
    
    private final ProviderRepository providerRepository;
    
    /**
     * Save or update a provider
     */
    public Provider saveProvider(Provider provider) {
        return providerRepository.save(provider);
    }
    
    /**
     * Get provider by ID
     */
    public Provider getProviderById(Long id) {
        return providerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Provider not found with id: " + id));
    }
    
    /**
     * Find provider by ID (returns Optional)
     */
    public Optional<Provider> findById(Long id) {
        return providerRepository.findById(id);
    }
    
    /**
     * Find provider by email and password (for authentication)
     */
    public Optional<Provider> findByEmailAndPassword(String email, String password) {
        return providerRepository.findByEmailAndPassword(email, password);
    }
    
    /**
     * Get all providers
     */
    public List<Provider> findAllProviders() {
        return providerRepository.findAll();
    }
    
    /**
     * Get active providers only
     */
    public List<Provider> getActiveProviders() {
        return providerRepository.findByActiveTrue();
    }
    
    /**
     * Delete a provider
     */
    public void deleteProvider(Long id) {
        Provider provider = getProviderById(id);
        providerRepository.delete(provider);
    }
    
    /**
     * Update provider
     */
    public Provider updateProvider(Long id, Provider providerDetails) {
        Provider provider = getProviderById(id);
        
        if (providerDetails.getFirstName() != null) {
            provider.setFirstName(providerDetails.getFirstName());
        }
        if (providerDetails.getLastName() != null) {
            provider.setLastName(providerDetails.getLastName());
        }
        if (providerDetails.getEmail() != null) {
            provider.setEmail(providerDetails.getEmail());
        }
        if (providerDetails.getPhone() != null) {
            provider.setPhone(providerDetails.getPhone());
        }
        if (providerDetails.getAddress() != null) {
            provider.setAddress(providerDetails.getAddress());
        }
        if (providerDetails.getBusinessName() != null) {
            provider.setBusinessName(providerDetails.getBusinessName());
        }
        if (providerDetails.getLicenseNumber() != null) {
            provider.setLicenseNumber(providerDetails.getLicenseNumber());
        }
        if (providerDetails.getYearsExperience() != null) {
            provider.setYearsExperience(providerDetails.getYearsExperience());
        }
        if (providerDetails.getPrimaryService() != null) {
            provider.setPrimaryService(providerDetails.getPrimaryService());
        }
        
        return providerRepository.save(provider);
    }
}
