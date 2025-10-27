package main.java.com.HomeConnectPro_hub.review;

import com.csc340.homeconnect_pro_hub.customer.Customer;
import com.csc340.homeconnect_pro_hub.service.Service;
import com.csc340.homeconnect_pro_hub.serviceprovider.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    /**
     * Find all reviews for a specific service (Use Case 2.2.1.8 - View Reviews)
     */
    List<Review> findByService(Service service);
    
    /**
     * Find all reviews by a specific customer
     */
    List<Review> findByCustomer(Customer customer);
    
    /**
     * Find reviews for all services by a specific provider
     * Uses Spring Data JPA path traversal: service.provider
     */
    List<Review> findByServiceProvider(ServiceProvider provider);
    
    /**
     * Find reviews by service ID
     */
    List<Review> findByServiceId(Long serviceId);
    
    /**
     * Find reviews by customer ID
     */
    List<Review> findByCustomerId(Long customerId);
    
    /**
     * Find reviews by provider ID (through service relationship)
     */
    List<Review> findByServiceProviderId(Long providerId);
    
    /**
     * Find reviews for a service ordered by creation date (newest first)
     */
    List<Review> findByServiceOrderByCreatedAtDesc(Service service);
    
    /**
     * Find reviews for a service ordered by rating (highest first)
     */
    List<Review> findByServiceOrderByRatingDesc(Service service);
    
    /**
     * Find reviews by customer ordered by creation date (newest first)
     */
    List<Review> findByCustomerOrderByCreatedAtDesc(Customer customer);
    
    /**
     * Count reviews for a specific service
     */
    long countByService(Service service);
    
    /**
     * Count reviews by a specific customer
     */
    long countByCustomer(Customer customer);
    
    /**
     * Count reviews for a provider's services
     */
    long countByServiceProvider(ServiceProvider provider);
    
    /**
     * Find reviews with a specific rating for a service
     */
    List<Review> findByServiceAndRating(Service service, Integer rating);
    
    /**
     * Find reviews with rating greater than or equal to a value
     */
    List<Review> findByServiceAndRatingGreaterThanEqual(Service service, Integer rating);
    
    /**
     * Calculate average rating for a service using custom query
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.service = :service")
    Double findAverageRatingByService(@Param("service") Service service);
    
    /**
     * Calculate average rating for a provider's services
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.service.provider = :provider")
    Double findAverageRatingByProvider(@Param("provider") ServiceProvider provider);
    
    /**
     * Get rating distribution for a service (count of each rating 1-5)
     */
    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.service = :service GROUP BY r.rating")
    List<Object[]> findRatingDistributionByService(@Param("service") Service service);
    
    /**
     * Get rating distribution for a provider
     */
    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.service.provider = :provider GROUP BY r.rating")
    List<Object[]> findRatingDistributionByProvider(@Param("provider") ServiceProvider provider);
    
    /**
     * Find recent reviews for a service (limit results)
     */
    List<Review> findTop10ByServiceOrderByCreatedAtDesc(Service service);
    
    /**
     * Find recent reviews for a provider
     */
    List<Review> findTop10ByServiceProviderOrderByCreatedAtDesc(ServiceProvider provider);
    
    /**
     * Check if a customer has reviewed a specific service
     */
    boolean existsByCustomerAndService(Customer customer, Service service);
    
    /**
     * Find a review by customer and service
     */
    List<Review> findByCustomerAndService(Customer customer, Service service);
}