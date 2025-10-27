package com.HomeConnectPro_hub.service;

import com.HomeConnectPro_hub.provider.Provider;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "service")
public class Service {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Service name is required")
    @Column(nullable = false)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @NotNull(message = "Price is required")
    @Column(nullable = false)
    private Double price;
    
    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    @JsonIgnoreProperties({"services"})
    private Provider provider;
    
    @Column(name = "service_type")
    private String serviceType;
    
    @Column(name = "is_active")
    private boolean active = true;
    
    // Constructor for easy instantiation
    public Service(String name, String description, Double price, Provider provider) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.provider = provider;
    }
}