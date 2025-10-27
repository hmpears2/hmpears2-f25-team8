package main.java.com.HomeConnectPro_hub.subscription;

import com.HomeConnectPro_hub.customer.Customer;
import com.HomeConnectPro_hub.customer.CustomerService;
import com.HomeConnectPro_hub.service.Service;
import com.HomeConnectPro_hub.service.ServiceService;
import com.HomeConnectPro_hub.serviceprovider.ServiceProvider;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionService {
    
    private final SubscriptionRepository subscriptionRepository;
    private final CustomerService customerService;
    private final ServiceService serviceService;
    
    /**
     * Create new subscription (Use Case 2.2.2.5 - Subscribe to Service)
     * Prevents duplicate subscriptions for the same customer-service pair
     */
    public Subscription createSubscription(Subscription subscription) {
        // Verify customer exists
        Customer customer = subscription.getCustomer();
        if (customer == null || customer.getId() == null) {
            throw new IllegalArgumentException("Customer is required");
        }
        customerService.getCustomerById(customer.getId());
        
        // Verify service exists
        Service service = subscription.getService();
        if (service == null || service.getId() == null) {
            throw new IllegalArgumentException("Service is required");
        }
        serviceService.getServiceById(service.getId());
        
        // Check if subscription already exists
        if (subscriptionRepository.existsByCustomerAndService(customer, service)) {
            throw new RuntimeException("Customer is already subscribed to this service");
        }
        
        return subscriptionRepository.save(subscription);
    }
    
    /**
     * Get all subscriptions
     */
    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }
    
    /**
     * Get subscription by ID
     */
    public Subscription getSubscriptionById(Long id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subscription not found with id: " + id));
    }
    
    /**
     * Get all subscriptions for a customer (Use Case 2.2.2.6 - View My Subscriptions)
     */
    public List<Subscription> getSubscriptionsByCustomer(Customer customer) {
        return subscriptionRepository.findByCustomerOrderBySubscribedAtDesc(customer);
    }
    
    /**
     * Get subscriptions by customer ID
     */
    public List<Subscription> getSubscriptionsByCustomerId(Long customerId) {
        return subscriptionRepository.findByCustomerId(customerId);
    }
    
    /**
     * Get all subscriptions for a specific service
     */
    public List<Subscription> getSubscriptionsByService(Service service) {
        return subscriptionRepository.findByService(service);
    }
    
    /**
     * Get subscriptions by service ID
     */
    public List<Subscription> getSubscriptionsByServiceId(Long serviceId) {
        return subscriptionRepository.findByServiceId(serviceId);
    }
    
    /**
     * Get all subscriptions for a provider's services
     * Used for provider statistics (Use Case 2.2.1.7)
     */
    public List<Subscription> getSubscriptionsByProvider(ServiceProvider provider) {
        return subscriptionRepository.findByServiceProvider(provider);
    }
    
    /**
     * Get subscriptions by provider ID
     */
    public List<Subscription> getSubscriptionsByProviderId(Long providerId) {
        return subscriptionRepository.findByServiceProviderId(providerId);
    }
    
    /**
     * Delete subscription (unsubscribe)
     */
    public void deleteSubscription(Long id) {
        Subscription subscription = getSubscriptionById(id);
        subscriptionRepository.delete(subscription);
    }
    
    /**
     * Delete subscription by customer and service IDs
     */
    public void deleteSubscriptionByCustomerAndService(Long customerId, Long serviceId) {
        Subscription subscription = subscriptionRepository.findByCustomerIdAndServiceId(customerId, serviceId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Subscription not found for customer " + customerId + " and service " + serviceId));
        subscriptionRepository.delete(subscription);
    }
    
    /**
     * Check if a customer is subscribed to a service
     * Useful for validating reviews (customer must be subscribed to review)
     */
    public boolean isCustomerSubscribedToService(Long customerId, Long serviceId) {
        return subscriptionRepository.existsByCustomerIdAndServiceId(customerId, serviceId);
    }
    
    /**
     * Count subscriptions for a service
     * Used in provider statistics
     */
    public long countSubscriptionsForService(Service service) {
        return subscriptionRepository.countByService(service);
    }
    
    /**
     * Count subscriptions for a customer
     */
    public long countSubscriptionsForCustomer(Customer customer) {
        return subscriptionRepository.countByCustomer(customer);
    }
    
    /**
     * Get customer's subscriptions with full service and provider details
     * Optimized query for display purposes
     */
    public List<Subscription> getCustomerSubscriptionsWithDetails(Customer customer) {
        return subscriptionRepository.findByCustomerWithServiceAndProvider(customer);
    }
}
