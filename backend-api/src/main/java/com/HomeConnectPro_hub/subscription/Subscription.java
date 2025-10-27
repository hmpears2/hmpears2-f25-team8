package com.HomeConnectPro_hub.subscription;

import com.HomeConnectPro_hub.customer.Customer;
import com.HomeConnectPro_hub.service.Service;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "subscription")
public class Subscription {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnoreProperties({"subscriptions", "reviews"})
    private Customer customer;
    
    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    @JsonIgnoreProperties({"subscriptions", "reviews", "provider"})
    private Service service;
    
    @NotNull
    @Column(name = "subscribed_at", nullable = false)
    private LocalDateTime subscribedAt;
    
    @PrePersist
    protected void onCreate() {
        subscribedAt = LocalDateTime.now();
    }
    
    // Constructor for easy instantiation
    public Subscription(Customer customer, Service service) {
        this.customer = customer;
        this.service = service;
    }
}