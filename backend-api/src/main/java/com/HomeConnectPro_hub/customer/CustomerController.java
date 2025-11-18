package com.HomeConnectPro_hub.customer;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CustomerController {
    
    private final CustomerService customerService;
    
    /**
     * Create customer profile with enhanced error handling
     * POST /api/customers
     */
    @PostMapping
    public ResponseEntity<?> createCustomer(@Valid @RequestBody Customer customer) {
        try {
            // Validate email doesn't already exist
            try {
                Customer existing = customerService.getCustomerByEmail(customer.getEmail());
                if (existing != null) {
                    Map<String, String> error = new HashMap<>();
                    error.put("message", "Email already exists. Please use a different email or login.");
                    error.put("field", "email");
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
                }
            } catch (Exception e) {
                // Customer not found, which is good - we can proceed
            }
            
            // Create the customer
            Customer createdCustomer = customerService.createCustomer(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCustomer);
            
        } catch (DataIntegrityViolationException e) {
            // Database constraint violation (e.g., duplicate email)
            Map<String, String> error = new HashMap<>();
            error.put("message", "A customer with this email or phone number already exists.");
            error.put("error", e.getMostSpecificCause().getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
            
        } catch (Exception e) {
            // General error
            Map<String, String> error = new HashMap<>();
            error.put("message", "An error occurred during registration. Please try again.");
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Customer login endpoint with enhanced error handling
     * POST /api/customers/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Validate input
            if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email is required.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Password is required.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            // Find customer
            Customer customer = customerService.getCustomerByEmail(loginRequest.getEmail());
            
            if (customer == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid email or password.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
            
            // Check password
            if (!customer.getPassword().equals(loginRequest.getPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid email or password.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
            
            return ResponseEntity.ok(customer);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Login failed. Please try again.");
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Update customer profile
     * PUT /api/customers/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(
            @PathVariable @NonNull Long id, 
            @Valid @RequestBody @NonNull Customer customerDetails) {
        try {
            Customer updatedCustomer = customerService.updateCustomer(id, customerDetails);
            return ResponseEntity.ok(updatedCustomer);
            
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Customer not found with id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update customer.");
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Get customer by ID
     * GET /api/customers/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomer(@PathVariable @NonNull Long id) {
        try {
            Customer customer = customerService.getCustomerById(id);
            return ResponseEntity.ok(customer);
            
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Customer not found with id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
    
    /**
     * Get all customers
     * GET /api/customers
     */
    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }
    
    /**
     * Get customer by email
     * GET /api/customers/email/{email}
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getCustomerByEmail(@PathVariable String email) {
        try {
            Customer customer = customerService.getCustomerByEmail(email);
            if (customer == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Customer not found with email: " + email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            return ResponseEntity.ok(customer);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error finding customer.");
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Search customers by first name
     * GET /api/customers/search/firstname?name={name}
     */
    @GetMapping("/search/firstname")
    public ResponseEntity<List<Customer>> searchByFirstName(@RequestParam String name) {
        return ResponseEntity.ok(customerService.searchByFirstName(name));
    }
    
    /**
     * Search customers by last name
     * GET /api/customers/search/lastname?name={name}
     */
    @GetMapping("/search/lastname")
    public ResponseEntity<List<Customer>> searchByLastName(@RequestParam String name) {
        return ResponseEntity.ok(customerService.searchByLastName(name));
    }
    
    /**
     * Search customers by address
     * GET /api/customers/search/address?address={address}
     */
    @GetMapping("/search/address")
    public ResponseEntity<List<Customer>> searchByAddress(@RequestParam String address) {
        return ResponseEntity.ok(customerService.searchByAddress(address));
    }
    
    /**
     * Search customers by phone number
     * GET /api/customers/search/phone?phoneNumber={phoneNumber}
     */
    @GetMapping("/search/phone")
    public ResponseEntity<?> searchByPhoneNumber(@RequestParam String phoneNumber) {
        try {
            Customer customer = customerService.searchByPhoneNumber(phoneNumber);
            if (customer == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Customer not found with phone number: " + phoneNumber);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            return ResponseEntity.ok(customer);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error searching for customer.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Delete customer profile
     * DELETE /api/customers/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable @NonNull Long id) {
        try {
            customerService.deleteCustomer(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Customer deleted successfully.");
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Customer not found with id: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete customer.");
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Health check endpoint
     * GET /api/customers/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "Customer Service");
        health.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(health);
    }
    
    /**
     * Inner class for login request
     */
    public static class LoginRequest {
        private String email;
        private String password;
        
        public LoginRequest() {}
        
        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getPassword() {
            return password;
        }
        
        public void setPassword(String password) {
            this.password = password;
        }
    }
}