package com.HomeConnectPro_hub.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    /**
     * Find customer by email (for login - Use Case 2.2.2.2)
     */
    Optional<Customer> findByEmail(String email);
    
    /**
     * Check if email exists (for validation during signup)
     */
    boolean existsByEmail(String email);
    
    /**
     * Find customers by first name (case-insensitive)
     */
    List<Customer> findByFirstNameContainingIgnoreCase(String firstName);
    
    /**
     * Find customers by last name (case-insensitive)
     */
    List<Customer> findByLastNameContainingIgnoreCase(String lastName);
    
    /**
     * Find customers by address (case-insensitive, partial match)
     */
    List<Customer> findByAddressContainingIgnoreCase(String address);
    
    /**
     * Find customer by phone number (exact match)
     */
    Optional<Customer> findByPhoneNumber(String phoneNumber);
    
    /**
     * Check if phone number exists
     */
    boolean existsByPhoneNumber(String phoneNumber);
}