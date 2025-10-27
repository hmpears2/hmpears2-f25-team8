package main.java.com.HomeConnectPro_hub.review;

import com.csc340.homeconnect_pro_hub.customer.Customer;
import com.csc340.homeconnect_pro_hub.customer.CustomerService;
import com.csc340.homeconnect_pro_hub.service.Service;
import com.csc340.homeconnect_pro_hub.service.ServiceService;
import com.csc340.homeconnect_pro_hub.serviceprovider.ServiceProvider;
import com.csc340.homeconnect_pro_hub.subscription.SubscriptionService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final CustomerService customerService;
    private final ServiceService serviceService;
    private final SubscriptionService subscriptionService;
    
    /**
     * Create new review (Use Case 2.2.2.7 - Write Review)
     * Validates that customer is subscribed to the service before allowing review
     */
    public Review createReview(Review review) {

        Customer customer = review.getCustomer();
        if (customer == null || customer.getId() == null) {
            throw new IllegalArgumentException("Customer is required");
        }
        customerService.getCustomerById(customer.getId());
        
        Service service = review.getService();
        if (service == null || service.getId() == null) {
            throw new IllegalArgumentException("Service is required");
        }
        serviceService.getServiceById(service.getId());
        
        if (!subscriptionService.isCustomerSubscribedToService(customer.getId(), service.getId())) {
            throw new RuntimeException("Customer must be subscribed to the service to write a review");
        }
        
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        
        return reviewRepository.save(review);
    }
    
    /**
     * Get all reviews
     */
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
    
    /**
     * Get review by ID
     */
    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + id));
    }
    
    /**
     * Update existing review
     */
    public Review updateReview(Long id, Review reviewDetails) {
        Review review = getReviewById(id);
        
        // Update rating and comment
        review.setRating(reviewDetails.getRating());
        review.setComment(reviewDetails.getComment());
        
        // Validate rating
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        
        return reviewRepository.save(review);
    }
    
    /**
     * Delete review
     */
    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new EntityNotFoundException("Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }
    
    /**
     * Get all reviews for a service (Use Case 2.2.1.8 - View Reviews)
     */
    public List<Review> getReviewsByService(Service service) {
        return reviewRepository.findByServiceOrderByCreatedAtDesc(service);
    }
    
    /**
     * Get reviews by service ID
     */
    public List<Review> getReviewsByServiceId(Long serviceId) {
        return reviewRepository.findByServiceId(serviceId);
    }
    
    /**
     * Get all reviews by a customer
     */
    public List<Review> getReviewsByCustomer(Customer customer) {
        return reviewRepository.findByCustomerOrderByCreatedAtDesc(customer);
    }
    
    /**
     * Get reviews by customer ID
     */
    public List<Review> getReviewsByCustomerId(Long customerId) {
        return reviewRepository.findByCustomerId(customerId);
    }
    
    /**
     * Get all reviews for a provider's services
     */
    public List<Review> getReviewsByProvider(ServiceProvider provider) {
        return reviewRepository.findByServiceProvider(provider);
    }
    
    /**
     * Get reviews by provider ID
     */
    public List<Review> getReviewsByProviderId(Long providerId) {
        return reviewRepository.findByServiceProviderId(providerId);
    }
    
    /**
     * Get average rating for a service
     */
    public Double getAverageRating(Service service) {
        Double average = reviewRepository.findAverageRatingByService(service);
        return average != null ? Math.round(average * 100.0) / 100.0 : 0.0;
    }
    
    /**
     * Get average rating for a provider (across all their services)
     */
    public Double getAverageRatingByProvider(ServiceProvider provider) {
        Double average = reviewRepository.findAverageRatingByProvider(provider);
        return average != null ? Math.round(average * 100.0) / 100.0 : 0.0;
    }
    
    /**
     * Get review count for a service
     */
    public Long getReviewCount(Service service) {
        return reviewRepository.countByService(service);
    }
    
    /**
     * Get review count for a customer
     */
    public Long getReviewCountByCustomer(Customer customer) {
        return reviewRepository.countByCustomer(customer);
    }
    
    /**
     * Get review count for a provider
     */
    public Long getReviewCountByProvider(ServiceProvider provider) {
        return reviewRepository.countByServiceProvider(provider);
    }
    
    /**
     * Get rating distribution for a service (1-5 star breakdown)
     */
    public Map<Integer, Long> getRatingDistribution(Service service) {
        List<Object[]> results = reviewRepository.findRatingDistributionByService(service);
        Map<Integer, Long> distribution = new HashMap<>();
        
        // Initialize all ratings to 0
        for (int i = 1; i <= 5; i++) {
            distribution.put(i, 0L);
        }
        
        // Fill in actual counts
        for (Object[] result : results) {
            Integer rating = (Integer) result[0];
            Long count = (Long) result[1];
            distribution.put(rating, count);
        }
        
        return distribution;
    }
    
    /**
     * Get rating distribution for a provider
     */
    public Map<Integer, Long> getRatingDistributionByProvider(ServiceProvider provider) {
        List<Object[]> results = reviewRepository.findRatingDistributionByProvider(provider);
        Map<Integer, Long> distribution = new HashMap<>();
        
        // Initialize all ratings to 0
        for (int i = 1; i <= 5; i++) {
            distribution.put(i, 0L);
        }
        
        // Fill in actual counts
        for (Object[] result : results) {
            Integer rating = (Integer) result[0];
            Long count = (Long) result[1];
            distribution.put(rating, count);
        }
        
        return distribution;
    }
    
    /**
     * Get comprehensive rating statistics for a provider (Use Case 2.2.1.7 - View Customer Statistics)
     */
    public Map<String, Object> getProviderRatingStatistics(Long providerId) {
        ServiceProvider provider = new ServiceProvider();
        provider.setId(providerId);
        
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("providerId", providerId);
        statistics.put("totalReviews", getReviewCountByProvider(provider));
        statistics.put("averageRating", getAverageRatingByProvider(provider));
        statistics.put("ratingDistribution", getRatingDistributionByProvider(provider));
        
        // Get ratings for each service
        List<Review> allReviews = getReviewsByProvider(provider);
        Map<String, Double> serviceRatings = allReviews.stream()
                .collect(Collectors.groupingBy(
                        review -> review.getService().getServiceName(),
                        Collectors.averagingDouble(Review::getRating)
                ));
        
        // Round service ratings
        serviceRatings.replaceAll((k, v) -> Math.round(v * 100.0) / 100.0);
        statistics.put("serviceRatings", serviceRatings);
        
        return statistics;
    }
    
    /**
     * Get recent reviews for a service (top 10)
     */
    public List<Review> getRecentReviewsByService(Service service) {
        return reviewRepository.findTop10ByServiceOrderByCreatedAtDesc(service);
    }
    
    /**
     * Get recent reviews for a provider (top 10)
     */
    public List<Review> getRecentReviewsByProvider(ServiceProvider provider) {
        return reviewRepository.findTop10ByServiceProviderOrderByCreatedAtDesc(provider);
    }
    
    /**
     * Check if customer has already reviewed a service
     */
    public boolean hasCustomerReviewedService(Customer customer, Service service) {
        return reviewRepository.existsByCustomerAndService(customer, service);
    }
    
    /**
     * Get customer's review for a specific service
     */
    public List<Review> getCustomerReviewForService(Customer customer, Service service) {
        return reviewRepository.findByCustomerAndService(customer, service);
    }
}