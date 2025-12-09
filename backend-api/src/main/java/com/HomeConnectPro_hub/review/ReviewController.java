package com.HomeConnectPro_hub.review;

import com.HomeConnectPro_hub.customer.CustomerService;
import com.HomeConnectPro_hub.service.Service;
import com.HomeConnectPro_hub.service.ServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {
    
    private final ReviewService reviewService;
    private final ServiceService serviceService;
    private final CustomerService customerService;
    
    /**
     * Write review for a service (Use Case 2.2.2.7)
     * POST /api/reviews
     */
    @PostMapping
    public ResponseEntity<Review> createReview(@Valid @RequestBody Review review) {
        Review createdReview = reviewService.createReview(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
    }
    
    /**
     * Get all reviews
     * GET /api/reviews
     */
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }
    
    /**
     * Get review by ID
     * GET /api/reviews/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReview(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(reviewService.getReviewById(id));
    }
    
    /**
     * Update review
     * PUT /api/reviews/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable @NonNull Long id, 
                                               @Valid @RequestBody Review reviewDetails) {
        return ResponseEntity.ok(reviewService.updateReview(id, reviewDetails));
    }
    
    /**
     * Delete review
     * DELETE /api/reviews/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable @NonNull Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Add provider response to a review (Use Case 2.2.1.6 - Reply to Reviews)
     * PUT /api/reviews/{id}/response
     */
    @PutMapping("/{id}/response")
    public ResponseEntity<Review> addProviderResponse(
            @PathVariable @NonNull Long id, 
            @RequestBody Map<String, String> requestBody) {
        String providerResponse = requestBody.get("providerResponse");
        if (providerResponse == null || providerResponse.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Review updatedReview = reviewService.addProviderResponse(id, providerResponse);
        return ResponseEntity.ok(updatedReview);
    }
    
    /**
     * Get reviews for a specific service (Use Case 2.2.1.8 - View Reviews)
     * GET /api/reviews/service/{serviceId}
     */
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Review>> getServiceReviews(@PathVariable @NonNull Long serviceId) {
        return ResponseEntity.ok(reviewService.getReviewsByService(
                serviceService.getServiceById(serviceId)));
    }
    
    /**
     * Get reviews by a specific customer
     * GET /api/reviews/customer/{customerId}
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Review>> getCustomerReviews(@PathVariable @NonNull Long customerId) {
        return ResponseEntity.ok(reviewService.getReviewsByCustomer(
                customerService.getCustomerById(customerId)));
    }
    
    /**
     * Get all reviews for a provider's services
     * GET /api/reviews/provider/{providerId}
     */
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Review>> getProviderReviews(@PathVariable Long providerId) {
        return ResponseEntity.ok(reviewService.getReviewsByProviderId(providerId));
    }
    
    /**
     * Get average rating for a service
     * GET /api/reviews/service/{serviceId}/average-rating
     */
    @GetMapping("/service/{serviceId}/average-rating")
    public ResponseEntity<Map<String, Object>> getServiceAverageRating(@PathVariable @NonNull Long serviceId) {
        Service service = serviceService.getServiceById(serviceId);
        Double averageRating = reviewService.getAverageRating(service);
        Long reviewCount = reviewService.getReviewCount(service);
        
        Map<String, Object> response = new HashMap<>();
        response.put("serviceId", serviceId);
        response.put("serviceName", service.getName());
        response.put("averageRating", averageRating);
        response.put("reviewCount", reviewCount);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get rating statistics for a provider (Use Case 2.2.1.7 - Part of Customer Statistics)
     * GET /api/reviews/provider/{providerId}/statistics
     */
    @GetMapping("/provider/{providerId}/statistics")
    public ResponseEntity<Map<String, Object>> getProviderRatingStatistics(@PathVariable Long providerId) {
        Map<String, Object> statistics = reviewService.getProviderRatingStatistics(providerId);
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Get rating distribution for a service (1-5 star breakdown)
     * GET /api/reviews/service/{serviceId}/rating-distribution
     */
    @GetMapping("/service/{serviceId}/rating-distribution")
    public ResponseEntity<Map<Integer, Long>> getServiceRatingDistribution(@PathVariable @NonNull Long serviceId) {
        Service service = serviceService.getServiceById(serviceId);
        Map<Integer, Long> distribution = reviewService.getRatingDistribution(service);
        return ResponseEntity.ok(distribution);
    }
}