# HomeConnect Pro Requirements Testing

## Actors
- Provider P - Home Service Providers
- Customer C - New/Existing Homeowners

### Use Cases

#### 1. Service Provider: Sign Up and Create Profile
1. Service Provider P1 navigates to the sign-up page.
2. P1 enters their information: first name "John", last name "Smith", email "john.smith@email.com", phone number "336-555-1234", business name "Smith's Home Repairs", primary service category "Plumbing", and password.
3. P1 successfully creates an account and is redirected to their dashboard.
4. P1 exits the app.

#### 2. Service Provider: Create Services
1. Service Provider P1 logs in with email "john.smith@email.com" and password.
2. P1 navigates to "Create Service" section.
3. P1 creates Service S1: service name "Pipe Repair", description "Full pipe repair and replacement service", pricing model "Hourly", hourly rate "$75.00".
4. P1 creates Service S2: service name "Drain Cleaning", description "Professional drain cleaning and unclogging", pricing model "Flat Rate", hourly rate "$50.00".
5. P1 verifies both services S1 and S2 appear in their service listings.
6. P1 exits the app.

#### 3. Customer: Sign Up and Create Profile
1. Customer C1 navigates to the sign-up page.
2. C1 enters their information: first name "Alice", last name "Johnson", email "alice.johnson@email.com", phone number "336-555-5678", address "123 Main St, Greensboro, NC", and password.
3. C1 successfully creates an account and is redirected to their dashboard.
4. C1 exits the app.

#### 4. Customer: Browse Services and Subscribe
1. Customer C2 navigates to the sign-up page.
2. C2 creates a new profile: first name "Bob", last name "Williams", email "bob.williams@email.com", phone number "336-555-9012", address "456 Oak Ave, Greensboro, NC", and password.
3. C2 navigates to "Browse Services" section.
4. C2 views available services and sees S1 "Pipe Repair" and S2 "Drain Cleaning" listed.
5. C2 clicks on S1 to view service details including provider information and pricing.
6. C2 subscribes to service S1 "Pipe Repair".
7. C2 verifies S1 appears in "My Subscriptions".
8. C2 exits the app.

#### 5. Customer: View Subscriptions and Write Review
1. Customer C2 logs in with email "bob.williams@email.com" and password.
2. C2 navigates to "My Subscriptions" and views subscribed service S1.
3. C2 clicks "Write Review" for service S1.
4. C2 submits a review with rating "5" and comment "Excellent service! John fixed our pipes quickly and professionally. Highly recommend!"
5. C2 verifies the review is submitted successfully.
6. C2 exits the app.

#### 6. Customer: Update Profile
1. Customer C1 logs in with email "alice.johnson@email.com" and password.
2. C1 navigates to "Update Profile" section.
3. C1 modifies their address from "123 Main St, Greensboro, NC" to "789 Elm St, Greensboro, NC".
4. C1 modifies their phone number from "336-555-5678" to "336-555-0000".
5. C1 saves changes and verifies the updated information is displayed.
6. C1 exits the app.

#### 7. Customer: Browse Services and View Reviews
1. Customer C1 logs in with email "alice.johnson@email.com" and password.
2. C1 navigates to "Browse Services" section.
3. C1 views service S1 "Pipe Repair" details.
4. C1 sees the positive review from C2 with rating "5" and the comment.
5. C1 subscribes to service S1.
6. C1 verifies S1 appears in "My Subscriptions".
7. C1 exits the app.

#### 8. Service Provider: View Reviews and Reply
1. Service Provider P1 logs in with email "john.smith@email.com" and password.
2. P1 navigates to "View Reviews" section.
3. P1 sees the review from C2 for service S1 with rating "5".
4. P1 clicks "Reply" on the review.
5. P1 submits reply: "Thank you so much for your kind words, Bob! We appreciate your business and look forward to serving you again!"
6. P1 verifies the reply is displayed under the review.
7. P1 exits the app.

#### 9. Service Provider: View Customer Statistics
1. Service Provider P1 logs in with email "john.smith@email.com" and password.
2. P1 navigates to "View Customer Stats" section.
3. P1 views statistics showing: total subscriptions (2 - C1 and C2 subscribed to S1), average rating (5.0), total reviews (1).
4. P1 exits the app.

#### 10. Service Provider: Edit Service
1. Service Provider P1 logs in with email "john.smith@email.com" and password.
2. P1 navigates to their services list.
3. P1 selects service S2 "Drain Cleaning" and clicks "Edit".
4. P1 modifies the hourly rate from "$50.00" to "$60.00".
5. P1 updates the description to "Professional drain cleaning, unclogging, and maintenance services".
6. P1 saves changes and verifies the updated information is displayed.
7. P1 exits the app.

#### 11. Service Provider: Update Profile
1. Service Provider P1 logs in with email "john.smith@email.com" and password.
2. P1 navigates to "Update Profile" section.
3. P1 modifies business name from "Smith's Home Repairs" to "Smith's Premium Home Repairs".
4. P1 modifies phone number from "336-555-1234" to "336-555-4321".
5. P1 saves changes and verifies the updated information is displayed.
6. P1 exits the app.

#### 12. Service Provider: Remove Service
1. Service Provider P1 logs in with email "john.smith@email.com" and password.
2. P1 navigates to their services list.
3. P1 sees services S1 "Pipe Repair" and S2 "Drain Cleaning".
4. P1 selects service S2 "Drain Cleaning" and clicks "Remove".
5. P1 confirms the deletion.
6. P1 verifies S2 no longer appears in their service listings.
7. P1 verifies S1 "Pipe Repair" still exists.
8. P1 exits the app.

---

## Data Persistence Verification

After all use cases are completed, verify the following data is stored in the database:

### SERVICEPROVIDER Table
| id | first_name | last_name | email | phone_number | business_name | primary_service_category |
|----|------------|-----------|-------|--------------|---------------|-------------------------|
| 1 | John | Smith | john.smith@email.com | 336-555-4321 | Smith's Premium Home Repairs | Plumbing |

### CUSTOMER Table
| id | first_name | last_name | email | phone_number | address |
|----|------------|-----------|-------|--------------|---------|
| 1 | Alice | Johnson | alice.johnson@email.com | 336-555-0000 | 789 Elm St, Greensboro, NC |
| 2 | Bob | Williams | bob.williams@email.com | 336-555-9012 | 456 Oak Ave, Greensboro, NC |

### SERVICE Table
| id | provider_id | service_name | description | pricing_model | hourly_rate |
|----|-------------|--------------|-------------|---------------|-------------|
| 1 | 1 | Pipe Repair | Full pipe repair and replacement service | Hourly | 75.00 |

### SUBSCRIPTION Table
| id | customer_id | service_id | subscribed_at |
|----|-------------|------------|---------------|
| 1 | 2 | 1 | (timestamp) |
| 2 | 1 | 1 | (timestamp) |

### REVIEW Table
| id | customer_id | service_id | rating | comment | created_at |
|----|-------------|------------|--------|---------|------------|
| 1 | 2 | 1 | 5 | Excellent service! John fixed our pipes quickly and professionally. Highly recommend! | (timestamp) |