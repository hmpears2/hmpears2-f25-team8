package main.java.com.HomeConnectPro_hub.subscription;

import com.HomeConnectPro_hub.customer.CustomerService;
import com.HomeConnectPro_hub.service.ServiceService;
import com.HomeConnectPro_hub.serviceprovider.ServiceProviderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {
    
    private final SubscriptionService subscriptionService;
    private final ServiceService serviceService;
    private final CustomerService customerService;
    private final ServiceProviderService serviceProviderService;
    
    /**
     * Subscribe to a service (Use Case 2.2.2.5)
     * POST /api/subscriptions
     */
    @PostMapping
    public ResponseEntity<Subscription> createSubscription(@Valid @RequestBody Subscription subscription) {
        Subscription createdSubscription = subscriptionService.createSubscription(subscription);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSubscription);
    }
    
    /**
     * Get all subscriptions
     * GET /api/subscriptions
     */
    @GetMapping
    public ResponseEntity<List<Subscription>> getAllSubscriptions() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptions());
    }
    
    /**
     * Get subscription by ID
     * GET /api/subscriptions/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Subscription> getSubscription(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionById(id));
    }
    
    /**
     * Get customer's subscriptions (Use Case 2.2.2.6 - View My Subscriptions)
     * GET /api/subscriptions/customer/{customerId}
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Subscription>> getCustomerSubscriptions(@PathVariable Long customerId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByCustomer(
                customerService.getCustomerById(customerId)));
    }
    
    /**
     * Get subscriptions for a specific service
     * GET /api/subscriptions/service/{serviceId}
     */
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Subscription>> getServiceSubscriptions(@PathVariable Long serviceId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByService(
                serviceService.getServiceById(serviceId)));
    }
    
    /**
     * Get all subscriptions for a provider's services
     * GET /api/subscriptions/provider/{providerId}
     */
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Subscription>> getProviderSubscriptions(@PathVariable Long providerId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByProvider(
                serviceProviderService.getServiceProviderById(providerId)));
    }
    
    /**
     * Unsubscribe from a service
     * DELETE /api/subscriptions/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id) {
        subscriptionService.deleteSubscription(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Unsubscribe using customer and service IDs
     * DELETE /api/subscriptions/customer/{customerId}/service/{serviceId}
     */
    @DeleteMapping("/customer/{customerId}/service/{serviceId}")
    public ResponseEntity<Void> unsubscribeByCustomerAndService(
            @PathVariable Long customerId, 
            @PathVariable Long serviceId) {
        subscriptionService.deleteSubscriptionByCustomerAndService(customerId, serviceId);
        return ResponseEntity.noContent().build();
    }
}
