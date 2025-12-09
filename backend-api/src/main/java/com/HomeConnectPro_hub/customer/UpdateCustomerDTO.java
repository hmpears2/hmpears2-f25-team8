package com.HomeConnectPro_hub.customer;

import jakarta.validation.constraints.Email;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Data Transfer Object for updating customer profile
 * All fields are optional to allow partial updates
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCustomerDTO {
    
    private String firstName;
    
    private String lastName;
    
    @Email(message = "Email must be valid")
    private String email;
    
    // Phone number validation handled in service layer to allow flexible input formats
    private String phoneNumber;
    
    private String address;
    
    private String password;
}