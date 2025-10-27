package com.HomeConnectPro_hub.subscription;

import com.HomeConnectPro_hub.customer.CustomerService;
import com.HomeConnectPro_hub.service.ServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubscriptionController {
    
    private final SubscriptionService subscriptionService;
    private final ServiceService serviceService;
    private final CustomerService customerService;
    
    /**
     * Get all subscriptions
     */
    @GetMapping
    public ResponseEntity<List<Subscription>> getAllSubscriptions() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptions());
    }
    
    /**
     * Get subscription by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Subscription> getSubscriptionById(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionById(id));
    }
    
    /**
     * Create a new subscription
     * Use Case 2.2.2.5 - Subscribe to Service
     */
    @PostMapping
    public ResponseEntity<Subscription> createSubscription(@Valid @RequestBody Subscription subscription) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(subscriptionService.createSubscription(subscription));
    }
    
    /**
     * Get subscriptions by customer ID
     * Use Case 2.2.2.6 - View My Subscriptions
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Subscription>> getSubscriptionsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByCustomerId(customerId));
    }
    
    /**
     * Get subscriptions by service ID
     */
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Subscription>> getSubscriptionsByService(@PathVariable Long serviceId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByServiceId(serviceId));
    }
    
    /**
     * Get subscriptions by provider ID
     * Use Case 2.2.1.7 - View Statistics
     */
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Subscription>> getSubscriptionsByProvider(@PathVariable Long providerId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByProviderId(providerId));
    }
    
    /**
     * Delete a subscription (unsubscribe)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id) {
        subscriptionService.deleteSubscription(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Delete subscription by customer and service IDs
     */
    @DeleteMapping("/customer/{customerId}/service/{serviceId}")
    public ResponseEntity<Void> deleteSubscriptionByCustomerAndService(
            @PathVariable Long customerId,
            @PathVariable Long serviceId) {
        subscriptionService.deleteSubscriptionByCustomerAndService(customerId, serviceId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Check if customer is subscribed to a service
     */
    @GetMapping("/check")
    public ResponseEntity<Boolean> checkSubscription(
            @RequestParam Long customerId,
            @RequestParam Long serviceId) {
        boolean isSubscribed = subscriptionService.isCustomerSubscribedToService(customerId, serviceId);
        return ResponseEntity.ok(isSubscribed);
    }
    
    /**
     * Get subscription count for a customer
     */
    @GetMapping("/customer/{customerId}/count")
    public ResponseEntity<Long> getCustomerSubscriptionCount(@PathVariable Long customerId) {
        long count = subscriptionService.countSubscriptionsForCustomer(
                customerService.getCustomerById(customerId));
        return ResponseEntity.ok(count);
    }
    
    /**
     * Get subscription count for a service
     */
    @GetMapping("/service/{serviceId}/count")
    public ResponseEntity<Long> getServiceSubscriptionCount(@PathVariable Long serviceId) {
        long count = subscriptionService.countSubscriptionsForService(
                serviceService.getServiceById(serviceId));
        return ResponseEntity.ok(count);
    }
}
