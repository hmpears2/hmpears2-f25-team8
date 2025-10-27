package main.java.com.HomeConnectPro_hub.subscription;

import com.HomeConnectPro_hub.customer.Customer;
import com.HomeConnectPro_hub.service.Service;
import com.HomeConnectPro_hub.serviceprovider.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    
    /**
     * Find all subscriptions for a specific customer
     * Use Case 2.2.2.6 - View My Subscriptions
     */
    List<Subscription> findByCustomer(Customer customer);
    
    /**
     * Find all subscriptions for a specific service
     */
    List<Subscription> findByService(Service service);
    
    /**
     * Find subscriptions by customer ID
     */
    List<Subscription> findByCustomerId(Long customerId);
    
    /**
     * Find subscriptions by service ID
     */
    List<Subscription> findByServiceId(Long serviceId);
    
    /**
     * Find a specific subscription by customer and service
     * Useful for checking if subscription already exists
     */
    Optional<Subscription> findByCustomerAndService(Customer customer, Service service);
    
    /**
     * Find subscription by customer ID and service ID
     */
    Optional<Subscription> findByCustomerIdAndServiceId(Long customerId, Long serviceId);
    
    /**
     * Check if a subscription exists for a customer and service
     * Prevents duplicate subscriptions
     */
    boolean existsByCustomerAndService(Customer customer, Service service);
    
    /**
     * Check if subscription exists by IDs
     */
    boolean existsByCustomerIdAndServiceId(Long customerId, Long serviceId);
    
    /**
     * Find all subscriptions for services by a specific provider
     * Uses Spring Data JPA path traversal: service.provider
     */
    List<Subscription> findByServiceProvider(ServiceProvider provider);
    
    /**
     * Find all subscriptions for a provider by provider ID
     */
    List<Subscription> findByServiceProviderId(Long providerId);
    
    /**
     * Count subscriptions for a specific service
     * Useful for provider statistics
     */
    long countByService(Service service);
    
    /**
     * Count subscriptions for a specific customer
     */
    long countByCustomer(Customer customer);
    
    /**
     * Find subscriptions ordered by subscription date (newest first)
     */
    List<Subscription> findByCustomerOrderBySubscribedAtDesc(Customer customer);
    
    // /**
    //  * Custom query to find subscriptions with service and provider details
    //  * Using JPQL for more complex queries
    //  */
    // @Query("SELECT s FROM Subscription s " +
    //        "JOIN FETCH s.service serv " +
    //        "JOIN FETCH serv.provider " +
    //        "WHERE s.customer = :customer")
    // List<Subscription> findByCustomerWithServiceAndProvider(@Param("customer") Customer customer);
}