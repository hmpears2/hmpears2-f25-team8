package com.HomeConnectPro_hub.customer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
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
    
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be 10 digits")
    private String phoneNumber;
    
    private String address;
    
    private String password;
}