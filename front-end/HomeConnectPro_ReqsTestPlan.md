# HomeConnect Pro Requirements Testing

## Actors
- Service Provider
- Customer

## 3rd Party API Integration
- **API Used**: Google Maps Geocoding API
- **Purpose**: Location-based service filtering - allows customers to find providers near their address
- **Features**: Distance calculation, distance-based sorting, proximity filtering

---

### Use Cases

#### 1. Service Provider: Sign Up and Create Profile
1. Service Provider P1 navigates to the sign-up page.
2. P1 enters their information: first name "John", last name "Smith", email "john.smith@email.com", phone number "336-555-1234", business name "Smith's Home Repairs", primary service category "Plumbing", business address "123 Main St, Greensboro, NC", license number "NC-12345", years of experience "10", and password.
3. P1 agrees to terms of service and confirms license status.
4. P1 successfully creates an account and is redirected to their dashboard.
5. P1 exits the app.

#### 2. Service Provider: Create Services
1. Service Provider P1 logs in with email "john.smith@email.com" and password.
2. P1 navigates to "Create Service" section.
3. P1 creates Service S1: service name "Pipe Repair", description "Full pipe repair and replacement service", pricing model "Hourly", price "$75.00".
4. P1 creates Service S2: service name "Drain Cleaning", description "Professional drain cleaning and unclogging", pricing model "Flat Rate", price "$50.00".
5. P1 verifies both services S1 and S2 appear in their service listings.
6. P1 exits the app.

#### 3. Service Provider P2: Sign Up (Different Location)
1. Service Provider P2 navigates to the sign-up page.
2. P2 enters their information: first name "Jane", last name "Doe", email "jane.doe@email.com", phone number "336-555-5678", business name "Doe's Electric", primary service category "Electrical", business address "456 Oak Ave, Winston-Salem, NC", license number "NC-67890", years of experience "8", and password.
3. P2 successfully creates an account.
4. P2 creates Service S3: service name "Electrical Wiring", description "Home electrical wiring and repairs", price "$85.00".
5. P2 exits the app.

#### 4. Customer: Sign Up and Create Profile
1. Customer C1 navigates to the sign-up page.
2. C1 enters their information: first name "Alice", last name "Johnson", email "alice.johnson@email.com", phone number "336-555-9012", address "789 Elm St, Greensboro, NC", and password.
3. C1 successfully creates an account and is redirected to their dashboard.
4. C1 exits the app.

#### 5. Customer: Browse Services with Location Filter (3rd Party API)
1. Customer C1 logs in with email "alice.johnson@email.com" and password.
2. C1 navigates to "Browse Services" section.
3. C1 sees the "Location-Based Search Active" banner indicating Google Maps API integration.
4. C1 views available services S1, S2, and S3 with distance badges showing proximity:
   - S1 "Pipe Repair" shows green badge "~2 mi" (Provider P1 in Greensboro)
   - S2 "Drain Cleaning" shows green badge "~2 mi" (Provider P1 in Greensboro)
   - S3 "Electrical Wiring" shows yellow badge "~25 mi" (Provider P2 in Winston-Salem)
5. C1 uses the distance slider to filter services within 10 miles.
6. C1 sees only S1 and S2 (services from nearby Provider P1).
7. C1 changes sort option to "Distance (Nearest)" and verifies services are sorted by proximity.
8. C1 resets distance filter to 50 miles to see all services again.
9. C1 exits the app.

#### 6. Customer: Subscribe to Nearby Service
1. Customer C1 logs in with email "alice.johnson@email.com" and password.
2. C1 navigates to "Browse Services" section.
3. C1 clicks on S1 "Pipe Repair" to view service details including provider information, price, and distance.
4. C1 subscribes to service S1 "Pipe Repair".
5. C1 verifies S1 appears in "My Subscriptions".
6. C1 exits the app.

#### 7. Customer C2: Sign Up (Different Location)
1. Customer C2 navigates to the sign-up page.
2. C2 creates a new profile: first name "Bob", last name "Williams", email "bob.williams@email.com", phone number "336-555-3456", address "100 Center St, High Point, NC", and password.
3. C2 navigates to "Browse Services" section.
4. C2 sees different distance values than C1 due to different location:
   - S1 and S2 show "~12 mi" (High Point to Greensboro)
   - S3 shows "~20 mi" (High Point to Winston-Salem)
5. C2 subscribes to service S1.
6. C2 exits the app.

#### 8. Customer: View Subscriptions and Write Review
1. Customer C2 logs in with email "bob.williams@email.com" and password.
2. C2 navigates to "My Subscriptions" and views subscribed service S1.
3. C2 clicks "Write Review" for service S1.
4. C2 submits a review with rating "5" and comment "Excellent service! John fixed our pipes quickly and professionally. Highly recommend!"
5. C2 verifies the review is submitted successfully.
6. C2 exits the app.

#### 9. Customer: Update Profile
1. Customer C1 logs in with email "alice.johnson@email.com" and password.
2. C1 navigates to "Profile" section.
3. C1 clicks "Edit Profile".
4. C1 modifies their address from "789 Elm St, Greensboro, NC" to "500 Market St, High Point, NC".
5. C1 modifies their phone number from "336-555-9012" to "336-555-0000".
6. C1 saves changes and verifies the updated information is displayed.
7. C1 navigates to "Browse Services" and verifies distance values have updated based on new address.
8. C1 exits the app.

#### 10. Customer: Browse Services and View Reviews
1. Customer C1 logs in with email "alice.johnson@email.com" and password.
2. C1 navigates to "Browse Services" section.
3. C1 views service S1 "Pipe Repair" details.
4. C1 sees the positive review from C2 with rating "5" and the comment.
5. C1 subscribes to service S1.
6. C1 verifies S1 appears in "My Subscriptions".
7. C1 exits the app.

#### 11. Service Provider: View Reviews and Reply
1. Service Provider P1 logs in with email "john.smith@email.com" and password.
2. P1 navigates to "View Reviews" section.
3. P1 sees the review from C2 for service S1 with rating "5".
4. P1 clicks "Reply" on the review.
5. P1 submits reply: "Thank you so much for your kind words, Bob! We appreciate your business and look forward to serving you again!"
6. P1 verifies the reply is displayed under the review.
7. P1 exits the app.

#### 12. Service Provider: View Customer Statistics
1. Service Provider P1 logs in with email "john.smith@email.com" and password.
2. P1 navigates to "View Customer Stats" section.
3. P1 views statistics showing: total subscriptions (2 - C1 and C2 subscribed to S1), average rating (5.0), total reviews (1).
4. P1 exits the app.

#### 13. Service Provider: Edit Service
1. Service Provider P1 logs in with email "john.smith@email.com" and password.
2. P1 navigates to their services list.
3. P1 selects service S2 "Drain Cleaning" and clicks "Edit".
4. P1 modifies the price from "$50.00" to "$60.00".
5. P1 updates the description to "Professional drain cleaning, unclogging, and maintenance services".
6. P1 saves changes and verifies the updated information is displayed.
7. P1 exits the app.

#### 14. Service Provider: Update Profile
1. Service Provider P1 logs in with email "john.smith@email.com" and password.
2. P1 navigates to "Update Profile" section.
3. P1 modifies business name from "Smith's Home Repairs" to "Smith's Premium Home Repairs".
4. P1 modifies phone number from "336-555-1234" to "336-555-4321".
5. P1 saves changes and verifies the updated information is displayed.
6. P1 exits the app.

#### 15. Service Provider: Remove Service
1. Service Provider P1 logs in with email "john.smith@email.com" and password.
2. P1 navigates to their services list.
3. P1 sees services S1 "Pipe Repair" and S2 "Drain Cleaning".
4. P1 selects service S2 "Drain Cleaning" and clicks "Remove".
5. P1 confirms the deletion.
6. P1 verifies S2 no longer appears in their service listings.
7. P1 verifies S1 "Pipe Repair" still exists.
8. P1 exits the app.

---

## 3rd Party API Demonstration Summary

### Google Maps Geocoding API Integration

**Feature**: Location-based service filtering for customers

**How it works**:
1. Customer's address is converted to geographic coordinates (latitude/longitude)
2. Provider's business address is converted to geographic coordinates
3. Distance is calculated using the Haversine formula
4. Services are displayed with distance badges and can be filtered/sorted by proximity

**Demonstrated in Use Cases**:
- **Use Case 5**: Customer browses services with distance filter, sees distance badges, uses distance slider
- **Use Case 7**: Different customer location shows different distances
- **Use Case 9**: Updating customer address updates distance calculations

**API Endpoints**:
- `GET /api/location/services/with-distance?customerId={id}` - Get all services with distance from customer
- `GET /api/location/services/nearby?customerId={id}&maxDistance={miles}` - Get filtered services within radius
- `GET /api/location/distance?from={addr1}&to={addr2}` - Calculate distance between two addresses

---

## Data Persistence Verification

After all use cases are completed, verify the following data is stored in the database:

### PROVIDER Table
| id | first_name | last_name | email | phone | business_name | address | primary_service |
|----|------------|-----------|-------|-------|---------------|---------|-----------------|
| 1 | John | Smith | john.smith@email.com | 336-555-4321 | Smith's Premium Home Repairs | 123 Main St, Greensboro, NC | Plumbing |
| 2 | Jane | Doe | jane.doe@email.com | 336-555-5678 | Doe's Electric | 456 Oak Ave, Winston-Salem, NC | Electrical |

### CUSTOMER Table
| id | first_name | last_name | email | phone_number | address |
|----|------------|-----------|-------|--------------|---------|
| 1 | Alice | Johnson | alice.johnson@email.com | 336-555-0000 | 500 Market St, High Point, NC |
| 2 | Bob | Williams | bob.williams@email.com | 336-555-3456 | 100 Center St, High Point, NC |

### SERVICE Table
| id | provider_id | name | description | price | service_type | is_active |
|----|-------------|------|-------------|-------|--------------|-----------|
| 1 | 1 | Pipe Repair | Full pipe repair and replacement service | 75.00 | Plumbing | true |
| 3 | 2 | Electrical Wiring | Home electrical wiring and repairs | 85.00 | Electrical | true |

### SUBSCRIPTION Table
| id | customer_id | service_id | subscribed_at |
|----|-------------|------------|---------------|
| 1 | 1 | 1 | (timestamp) |
| 2 | 2 | 1 | (timestamp) |

### REVIEW Table
| id | customer_id | service_id | rating | comment | created_at |
|----|-------------|------------|--------|---------|------------|
| 1 | 2 | 1 | 5 | Excellent service! John fixed our pipes quickly and professionally. Highly recommend! | (timestamp) |

---