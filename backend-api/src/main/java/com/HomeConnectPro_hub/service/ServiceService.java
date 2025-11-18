package com.HomeConnectPro_hub.service;

import com.HomeConnectPro_hub.provider.Provider;
import com.HomeConnectPro_hub.provider.ProviderService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ServiceService {
    
    private final ServiceRepository serviceRepository;
    private final ProviderService providerService;
    
    /**
     * Create a new service
     */
    public com.HomeConnectPro_hub.service.Service createService(com.HomeConnectPro_hub.service.Service service) {
        // Verify provider exists
        if (service.getProvider() == null || service.getProvider().getId() == null) {
            throw new IllegalArgumentException("Provider is required");
        }
        Long providerId = service.getProvider().getId();
        if (providerId == null) {
            throw new IllegalArgumentException("Provider ID cannot be null");
        }
        providerService.getProviderById(providerId);
        
        return serviceRepository.save(service);
    }
    
    /**
     * Get all services
     */
    public List<com.HomeConnectPro_hub.service.Service> getAllServices() {
        return serviceRepository.findAll();
    }
    
    /**
     * Get service by ID
     */
    public com.HomeConnectPro_hub.service.Service getServiceById(@NonNull Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Service not found with id: " + id));
    }
    
    /**
     * Get all services by provider
     */
    public List<com.HomeConnectPro_hub.service.Service> getServicesByProvider(Provider provider) {
        return serviceRepository.findByProvider(provider);
    }
    
    /**
     * Get services by provider ID
     */
    public List<com.HomeConnectPro_hub.service.Service> getServicesByProviderId(Long providerId) {
        return serviceRepository.findByProviderId(providerId);
    }
    
    /**
     * Get all active services
     */
    public List<com.HomeConnectPro_hub.service.Service> getActiveServices() {
        return serviceRepository.findByActiveTrue();
    }
    
    /**
     * Get active services by provider
     */
    public List<com.HomeConnectPro_hub.service.Service> getActiveServicesByProvider(Provider provider) {
        return serviceRepository.findByProviderAndActiveTrue(provider);
    }
    
    /**
     * Update a service
     */
    @SuppressWarnings("null")
    public com.HomeConnectPro_hub.service.Service updateService(@NonNull Long id, @NonNull com.HomeConnectPro_hub.service.Service serviceDetails) {
        com.HomeConnectPro_hub.service.Service service = getServiceById(id);

        if (serviceDetails.getName() != null) {
            service.setName(serviceDetails.getName());
        }
        if (serviceDetails.getDescription() != null) {
            service.setDescription(serviceDetails.getDescription());
        }
        if (serviceDetails.getPrice() != null) {
            service.setPrice(serviceDetails.getPrice());
        }
        if (serviceDetails.getServiceType() != null) {
            service.setServiceType(serviceDetails.getServiceType());
        }
        
        return serviceRepository.save(service);
    }
    
    /**
     * Delete a service
     */
    @SuppressWarnings("null")
    public void deleteService(@NonNull Long id) {
        com.HomeConnectPro_hub.service.Service service = getServiceById(id);
        serviceRepository.delete(service);
    }
    
    /**
     * Deactivate a service (soft delete)
     */
    public com.HomeConnectPro_hub.service.Service deactivateService(@NonNull Long id) {
        com.HomeConnectPro_hub.service.Service service = getServiceById(id);
        service.setActive(false);
        return serviceRepository.save(service);
    }
    
    /**
     * Activate a service
     */
    public com.HomeConnectPro_hub.service.Service activateService(@NonNull Long id) {
        com.HomeConnectPro_hub.service.Service service = getServiceById(id);
        service.setActive(true);
        return serviceRepository.save(service);
    }
    
    /**
     * Search services by name
     */
    public List<com.HomeConnectPro_hub.service.Service> searchServicesByName(String name) {
        return serviceRepository.findByNameContainingIgnoreCase(name);
    }
}
