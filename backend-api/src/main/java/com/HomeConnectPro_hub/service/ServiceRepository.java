package com.HomeConnectPro_hub.service;

import com.HomeConnectPro_hub.provider.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    
    /**
     * Find all services by provider
     */
    List<Service> findByProvider(Provider provider);
    
    /**
     * Find services by provider ID
     */
    List<Service> findByProviderId(Long providerId);
    
    /**
     * Find active services
     */
    List<Service> findByActiveTrue();
    
    /**
     * Find active services by provider
     */
    List<Service> findByProviderAndActiveTrue(Provider provider);
    
    /**
     * Find services by service type
     */
    List<Service> findByServiceType(String serviceType);
    
    /**
     * Find services by name containing (case-insensitive search)
     */
    List<Service> findByNameContainingIgnoreCase(String name);
}
