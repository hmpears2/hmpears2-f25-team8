# HomeConnect Pro Hub API Documentation

## Customer API Endpoints

### Create Customer (Sign Up - Use Case 2.2.2.1)
```http
POST /api/customers
Content-Type: application/json

{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "phoneNumber": "555-1234",
    "address": "123 Main St, Greensboro, NC 27401"
}
```

### Update Customer Profile (Use Case 2.2.2.3)
```http
PUT /api/customers/{id}
Content-Type: application/json

{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "password": "newPassword123",
    "phoneNumber": "555-5678",
    "address": "456 Oak Ave, Greensboro, NC 27401"
}
```

### Get Customer by ID
```http
GET /api/customers/{id}
```

### Get Customer by Email (Login - Use Case 2.2.2.2)
```http
GET /api/customers/email/{email}
```

### Get All Customers
```http
GET /api/customers
```

### Search Customers by First Name
```http
GET /api/customers/search/firstname?name={searchTerm}
```

### Search Customers by Last Name
```http
GET /api/customers/search/lastname?name={searchTerm}
```

### Search Customers by Address
```http
GET /api/customers/search/address?address={searchTerm}
```

### Search Customer by Phone Number
```http
GET /api/customers/search/phone?phoneNumber={phoneNumber}
```

### Delete Customer
```http
DELETE /api/customers/{id}
```

---

## Service Provider API Endpoints

### Create Service Provider (Sign Up - Use Case 2.2.1.1)
```http

---

## Service API Endpoints

### Create Service (Use Case 2.2.1.4)
```http
POST /api/services
Content-Type: application/json

{
    "providerId": 1,
    "serviceName": "Residential Plumbing",
    "description": "Complete plumbing services including repairs, installations, and maintenance for residential properties",
    "pricingModel": "Hourly",
    "hourlyRate": 75.00
}
```

### Update Service (Use Case 2.2.1.5)
```http
PUT /api/services/{id}
Content-Type: application/json

{
    "serviceName": "Premium Residential Plumbing",
    "description": "Complete plumbing services with 24/7 emergency support for residential properties",
    "pricingModel": "Hourly",
    "hourlyRate": 85.00
}
```

### Get Service by ID
```http
GET /api/services/{id}
```

### Get All Services (View Available Services - Use Case 2.2.2.4)
```http
GET /api/services
```

Response:
```json
[
    {
        "id": 1,
        "providerId": 1,
        "serviceName": "Residential Plumbing",
        "description": "Complete plumbing services...",
        "pricingModel": "Hourly",
        "hourlyRate": 75.00,
        "createdAt": "2025-10-27T10:00:00",
        "updatedAt": "2025-10-27T10:00:00"
    }
]
```

### Get Services by Provider
```http
GET /api/services/provider/{providerId}
```

### Search Services by Name
```http
GET /api/services/search?name={searchTerm}
```

### Delete Service (Use Case 2.2.1.6)
```http
DELETE /api/services/{id}
```

---

## Subscription API Endpoints

### Subscribe to Service (Use Case 2.2.2.5)
```http
POST /api/subscriptions
Content-Type: application/json

{
    "customer": {
        "id": 1
    },
    "service": {
        "id": 1
    }
}
```

Response:
```json
{
    "id": 1,
    "customer": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com"
    },
    "service": {
        "id": 1,
        "serviceName": "Residential Plumbing",
        "hourlyRate": 75.00
    },
    "subscribedAt": "2025-10-27T10:30:00"
}
```

### Get Subscription by ID
```http
GET /api/subscriptions/{id}
```

### Get All Subscriptions
```http
GET /api/subscriptions
```

### Get Customer's Subscriptions (View My Subscriptions - Use Case 2.2.2.6)
```http
GET /api/subscriptions/customer/{customerId}
```

Response:
```json
[
    {
        "id": 1,
        "service": {
            "serviceName": "Residential Plumbing",
            "description": "Complete plumbing services...",
            "hourlyRate": 75.00
        },
        "subscribedAt": "2025-10-27T10:30:00"
    },
    {
        "id": 2,
        "service": {
            "serviceName": "Electrical Repairs",
            "description": "Professional electrical work...",
            "hourlyRate": 80.00
        },
        "subscribedAt": "2025-10-26T14:15:00"
    }
]
```

### Get Service's Subscribers
```http
GET /api/subscriptions/service/{serviceId}
```

### Get Provider's Subscriptions
```http
GET /api/subscriptions/provider/{providerId}
```

### Unsubscribe by ID
```http
DELETE /api/subscriptions/{id}
```

### Unsubscribe by Customer and Service
```http
DELETE /api/subscriptions/customer/{customerId}/service/{serviceId}
```

---

## Review API Endpoints

### Write Review (Use Case 2.2.2.7)
```http
POST /api/reviews
Content-Type: application/json

{
    "customer": {
        "id": 1
    },
    "service": {
        "id": 1
    },
    "rating": 5,
    "comment": "Excellent service! Very professional and completed the work on time. Highly recommend!"
}
```

**Note:** Customer must be subscribed to the service to write a review.

Response:
```json
{
    "id": 1,
    "customer": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe"
    },
    "service": {
        "id": 1,
        "serviceName": "Residential Plumbing"
    },
    "rating": 5,
    "comment": "Excellent service! Very professional...",
    "createdAt": "2025-10-27T11:00:00"
}
```

### Update Review
```http
PUT /api/reviews/{id}
Content-Type: application/json

{
    "rating": 4,
    "comment": "Good service overall. Very satisfied with the results."
}
```

### Get Review by ID
```http
GET /api/reviews/{id}
```

### Get All Reviews
```http
GET /api/reviews
```

### Get Service Reviews (View Reviews - Use Case 2.2.1.8)
```http
GET /api/reviews/service/{serviceId}
```

Response:
```json
[
    {
        "id": 1,
        "customer": {
            "firstName": "John",
            "lastName": "Doe"
        },
        "rating": 5,
        "comment": "Excellent service! Very professional...",
        "createdAt": "2025-10-27T11:00:00"
    },
    {
        "id": 2,
        "customer": {
            "firstName": "Sarah",
            "lastName": "Johnson"
        },
        "rating": 4,
        "comment": "Great work, arrived on time.",
        "createdAt": "2025-10-26T15:30:00"
    }
]
```

### Get Customer's Reviews
```http
GET /api/reviews/customer/{customerId}
```

### Get Provider's Reviews (All Services)
```http
GET /api/reviews/provider/{providerId}
```

### Get Service Average Rating
```http
GET /api/reviews/service/{serviceId}/average-rating
```

Response:
```json
{
    "serviceId": 1,
    "serviceName": "Residential Plumbing",
    "averageRating": 4.5,
    "reviewCount": 12
}
```

### Get Service Rating Distribution
```http
GET /api/reviews/service/{serviceId}/rating-distribution
```

Response:
```json
{
    "5": 8,
    "4": 3,
    "3": 1,
    "2": 0,
    "1": 0
}
```

### Get Provider Rating Statistics (Use Case 2.2.1.7 - View Customer Statistics)
```http
GET /api/reviews/provider/{providerId}/statistics
```

Response:
```json
{
    "providerId": 1,
    "totalReviews": 25,
    "averageRating": 4.6,
    "ratingDistribution": {
        "5": 15,
        "4": 8,
        "3": 2,
        "2": 0,
        "1": 0
    },
    "serviceRatings": {
        "Residential Plumbing": 4.5,
        "Emergency Repairs": 4.8,
        "Pipe Installation": 4.4
    }
}
```

### Delete Review
```http
DELETE /api/reviews/{id}
```

---

## Statistics API Endpoints

### Get Provider Statistics (Use Case 2.2.1.7 - View Customer Statistics)
```http
GET /api/statistics/provider/{providerId}
```

Response includes comprehensive provider analytics:
```json
{
    "providerId": 1,
    "businessName": "Smith's Professional Plumbing",
    "totalServices": 3,
    "totalSubscriptions": 45,
    "totalReviews": 25,
    "averageRating": 4.6
}
```

---

## Complete User Flow Examples

### Customer Flow Example

#### 1. Customer Sign Up
```http
POST /api/customers
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "phoneNumber": "555-1234",
    "address": "123 Main St"
}
```

#### 2. Customer Login (Get by Email)
```http
GET /api/customers/email/john.doe@example.com
```

#### 3. View Available Services
```http
GET /api/services
```

#### 4. Subscribe to a Service
```http
POST /api/subscriptions
{
    "customer": {"id": 1},
    "service": {"id": 1}
}
```

#### 5. View My Subscriptions
```http
GET /api/subscriptions/customer/1
```

#### 6. Write a Review
```http
POST /api/reviews
{
    "customer": {"id": 1},
    "service": {"id": 1},
    "rating": 5,
    "comment": "Excellent service!"
}
```

---

### Service Provider Flow Example

#### 1. Provider Sign Up
```http
POST /api/providers
{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@plumbing.com",
    "password": "password123",
    "phoneNumber": "555-9999",
    "businessName": "Smith's Plumbing",
    "primaryServiceCategory": "Plumbing"
}
```

#### 2. Provider Login (Get by Email)
```http
GET /api/providers/email/jane@plumbing.com
```

#### 3. Create a Service
```http
POST /api/services
{
    "providerId": 1,
    "serviceName": "Residential Plumbing",
    "description": "Complete plumbing services",
    "pricingModel": "Hourly",
    "hourlyRate": 75.00
}
```

#### 4. View Customer Statistics
```http
GET /api/statistics/provider/1
```

#### 5. View Reviews
```http
GET /api/reviews/service/1
```

#### 6. Update Service
```http
PUT /api/services/1
{
    "serviceName": "Premium Residential Plumbing",
    "description": "Complete plumbing with emergency support",
    "pricingModel": "Hourly",
    "hourlyRate": 85.00
}
```

---

## Error Responses

### 400 Bad Request
```json
{
    "timestamp": "2025-10-27T10:00:00",
    "status": 400,
    "error": "Bad Request",
    "message": "Customer already exists with email: john.doe@example.com"
}
```

### 404 Not Found
```json
{
    "timestamp": "2025-10-27T10:00:00",
    "status": 404,
    "error": "Not Found",
    "message": "Customer not found with id: 999"
}
```

### 500 Internal Server Error
```json
{
    "timestamp": "2025-10-27T10:00:00",
    "status": 500,
    "error": "Internal Server Error",
    "message": "An unexpected error occurred"
}
```

---

## Business Rules

1. **Email Uniqueness**: Customer and Provider emails must be unique
2. **Duplicate Subscription Prevention**: Customers cannot subscribe to the same service twice
3. **Review Requirements**: Customers must be subscribed to a service before writing a review
4. **Rating Validation**: All ratings must be between 1 and 5 stars
5. **Cascade Deletion**: Deleting a customer removes all their subscriptions and reviews

---

## Base URL
```
http://localhost:8080
```
