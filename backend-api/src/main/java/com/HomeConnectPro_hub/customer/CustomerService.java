package com.HomeConnectPro_hub.customer;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {
    
    private final CustomerRepository customerRepository;
    
    /**
     * Create new customer (Use Case 2.2.2.1 - Sign Up)
     * Validates that email is unique before creating
     */
    public Customer createCustomer(Customer customer) {
        // Check if email already exists
        if (customerRepository.existsByEmail(customer.getEmail())) {
            throw new RuntimeException("Customer already exists with email: " + customer.getEmail());
        }
        
        // Check if phone number already exists (optional validation)
        if (customer.getPhoneNumber() != null && 
            customerRepository.existsByPhoneNumber(customer.getPhoneNumber())) {
            throw new RuntimeException("Phone number already in use: " + customer.getPhoneNumber());
        }
        
        return customerRepository.save(customer);
    }
    
    /**
     * Get all customers
     */
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
    
    /**
     * Get customer by ID
     */
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }
    
    /**
     * Get customer by email (Use Case 2.2.2.2 - Log In)
     */
    public Customer getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found with email: " + email));
    }
    
    /**
     * Update customer profile (Use Case 2.2.2.3)
     * Allows updating: first name, last name, email, phone number, address, and password
     */
    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = getCustomerById(id);
        
        // Update basic information
        customer.setFirstName(customerDetails.getFirstName());
        customer.setLastName(customerDetails.getLastName());
        customer.setPhoneNumber(customerDetails.getPhoneNumber());
        customer.setAddress(customerDetails.getAddress());
        
        // Only update email if it's different and not already taken
        if (!customer.getEmail().equals(customerDetails.getEmail())) {
            if (customerRepository.existsByEmail(customerDetails.getEmail())) {
                throw new RuntimeException("Email already in use: " + customerDetails.getEmail());
            }
            customer.setEmail(customerDetails.getEmail());
        }
        
        // Only update password if provided (not empty)
        if (customerDetails.getPassword() != null && !customerDetails.getPassword().isEmpty()) {
            customer.setPassword(customerDetails.getPassword());
        }
        
        return customerRepository.save(customer);
    }
    
    /**
     * Search customers by first name
     */
    public List<Customer> searchByFirstName(String firstName) {
        return customerRepository.findByFirstNameContainingIgnoreCase(firstName);
    }
    
    /**
     * Search customers by last name
     */
    public List<Customer> searchByLastName(String lastName) {
        return customerRepository.findByLastNameContainingIgnoreCase(lastName);
    }
    
    /**
     * Search customers by address
     */
    public List<Customer> searchByAddress(String address) {
        return customerRepository.findByAddressContainingIgnoreCase(address);
    }
    
    /**
     * Search customer by phone number
     */
    public Customer searchByPhoneNumber(String phoneNumber) {
        return customerRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("Customer not found with phone number: " + phoneNumber));
    }
    
    /**
     * Delete customer
     * This will cascade delete all associated subscriptions and reviews
     */
    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
    }
    
    /**
     * Verify customer exists (utility method)
     */
    public boolean customerExists(Long id) {
        return customerRepository.existsById(id);
    }
    
    /**
     * Verify customer credentials (for login validation)
     * Note: In production, use encrypted passwords with BCrypt
     */
    public boolean verifyCredentials(String email, String password) {
        return customerRepository.findByEmail(email)
                .map(customer -> customer.getPassword().equals(password))
                .orElse(false);
    }
}