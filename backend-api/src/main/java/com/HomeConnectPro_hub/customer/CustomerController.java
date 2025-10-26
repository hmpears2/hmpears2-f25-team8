package main.java.com.HomeConnectPro_hub.customer;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    
    private final CustomerService customerService;
    
    /**
     * Create customer profile (Use Case 2.2.2.1)
     * POST /api/customers
     */
    @PostMapping
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody Customer customer) {
        Customer createdCustomer = customerService.createCustomer(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCustomer);
    }
    
    /**
     * Update customer profile (Use Case 2.2.2.3)
     * PUT /api/customers/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, 
                                                   @Valid @RequestBody Customer customerDetails) {
        return ResponseEntity.ok(customerService.updateCustomer(id, customerDetails));
    }
    
    /**
     * Get customer by ID
     * GET /api/customers/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
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
     * Get customer by email (for login - Use Case 2.2.2.2)
     * GET /api/customers/email/{email}
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<Customer> getCustomerByEmail(@PathVariable String email) {
        return ResponseEntity.ok(customerService.getCustomerByEmail(email));
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
    public ResponseEntity<Customer> searchByPhoneNumber(@RequestParam String phoneNumber) {
        return ResponseEntity.ok(customerService.searchByPhoneNumber(phoneNumber));
    }
    
    /**
     * Delete customer profile (removes account)
     * DELETE /api/customers/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
