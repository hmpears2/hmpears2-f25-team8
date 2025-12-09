package com.HomeConnectPro_hub.review;

import com.HomeConnectPro_hub.customer.Customer;
import com.HomeConnectPro_hub.service.Service;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "review")
public class Review {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnoreProperties({"reviews", "subscriptions"})
    private Customer customer;
    
    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    @JsonIgnoreProperties({"reviews", "subscriptions"})
    private Service service;
    
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    @Column(nullable = false)
    private Integer rating;
    
    @NotBlank(message = "Comment is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;
    
    @Column(name = "provider_response", columnDefinition = "TEXT")
    private String providerResponse;
    
    @Column(name = "response_date")
    private LocalDateTime responseDate;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public Review(Customer customer, Service service, Integer rating, String comment) {
        this.customer = customer;
        this.service = service;
        this.rating = rating;
        this.comment = comment;
    }
}