// Central API service for all customer-related operations. Provides typed
// functions for interacting with the Spring Boot backend REST API.

import type{
  Customer,
  Service,
  Subscription,
  Review,
  LoginRequest,
  CustomerRegistrationRequest,
  UpdateCustomerRequest,
  CreateReviewRequest,
  ServiceFilterOptions,
  CustomerStatistics
} from '../types/types';

const API_BASE_URL = 'http://localhost:8080';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text().catch(() => 'Network error occurred');
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }
  
  // Handle 204 No Content or empty responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }
  
  // Check if there's actually content to parse
  const text = await response.text();
  if (!text) {
    return undefined as T;
  }
  
  return JSON.parse(text);
}

// Helper function to build headers
function getHeaders(includeAuth: boolean = false): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
}

export const customerApi = {
  // ============================================
  // AUTHENTICATION APIs
  // ============================================
  
  /**
   * Register a new customer
   */
  async register(customerData: CustomerRegistrationRequest): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/api/customers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(customerData),
    });
    return handleResponse<Customer>(response);
  },

  /**
   * Customer login
   */
  async login(credentials: LoginRequest): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/api/customers/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    const customer = await handleResponse<Customer>(response);
    
    // Store customer ID in localStorage for session management
    if (customer && customer.id) {
      localStorage.setItem('customerId', customer.id.toString());
      localStorage.setItem('customerEmail', customer.email);
    }
    
    return customer;
  },

  /**
   * Logout customer (client-side only)
   */
  logout(): void {
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerEmail');
    localStorage.removeItem('authToken');
  },

  // ============================================
  // CUSTOMER PROFILE APIs
  // ============================================
  
  /**
   * Get customer by ID
   */
  async getCustomerById(id: number): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse<Customer>(response);
  },

  /**
   * Get current logged-in customer
   */
  async getCurrentCustomer(): Promise<Customer | null> {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      return null;
    }
    return this.getCustomerById(parseInt(customerId));
  },

  /**
   * Update customer profile
   */
  async updateProfile(id: number, updates: UpdateCustomerRequest): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(updates),
    });
    return handleResponse<Customer>(response);
  },

  /**
   * Delete customer account
   */
  async deleteAccount(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    if (response.ok) {
      this.logout();
    }
    return handleResponse<void>(response);
  },

  /**
   * Get customer by email
   */
  async getCustomerByEmail(email: string): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/api/customers/email/${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse<Customer>(response);
  },

  // ============================================
  // SERVICE APIs
  // ============================================
  
  /**
   * Get all available services
   */
  async getAllServices(): Promise<Service[]> {
    const response = await fetch(`${API_BASE_URL}/api/services`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<Service[]>(response);
  },

  /**
   * Get active services only
   */
  async getActiveServices(): Promise<Service[]> {
    const response = await fetch(`${API_BASE_URL}/api/services/active`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<Service[]>(response);
  },

  /**
   * Get service by ID
   */
  async getServiceById(id: number): Promise<Service> {
    const response = await fetch(`${API_BASE_URL}/api/services/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<Service>(response);
  },

  /**
   * Search services by name
   */
  async searchServices(name: string): Promise<Service[]> {
    const response = await fetch(`${API_BASE_URL}/api/services/search?name=${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<Service[]>(response);
  },

  /**
   * Get services by provider
   */
  async getServicesByProvider(providerId: number): Promise<Service[]> {
    const response = await fetch(`${API_BASE_URL}/api/services/provider/${providerId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<Service[]>(response);
  },

  /**
   * Filter and sort services (client-side implementation)
   */
  async getFilteredServices(filters: ServiceFilterOptions): Promise<Service[]> {
    let services = await this.getActiveServices();
    
    // Apply filters
    if (filters.serviceType) {
      services = services.filter(s => s.serviceType === filters.serviceType);
    }
    if (filters.minPrice !== undefined) {
      services = services.filter(s => s.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      services = services.filter(s => s.price <= filters.maxPrice!);
    }
    if (filters.minRating !== undefined && services[0]?.averageRating !== undefined) {
      services = services.filter(s => (s.averageRating || 0) >= filters.minRating!);
    }
    if (filters.providerName) {
      services = services.filter(s => 
        (s.provider.companyName || s.provider.businessName || '').toLowerCase().includes(filters.providerName!.toLowerCase())
      );
    }
    
    return services;
  },

  // ============================================
  // SUBSCRIPTION APIs
  // ============================================
  
  /**
   * Subscribe to a service
   */
  async subscribeToService(customerId: number, serviceId: number): Promise<Subscription> {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({
        customer: { id: customerId },
        service: { id: serviceId }
      }),
    });
    return handleResponse<Subscription>(response);
  },

  /**
   * Get customer's subscriptions
   */
  async getMySubscriptions(customerId: number): Promise<Subscription[]> {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/customer/${customerId}`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse<Subscription[]>(response);
  },

  /**
   * Check if customer is subscribed to a service
   */
  async checkSubscription(customerId: number, serviceId: number): Promise<boolean> {
    const response = await fetch(
      `${API_BASE_URL}/api/subscriptions/check?customerId=${customerId}&serviceId=${serviceId}`,
      {
        method: 'GET',
        headers: getHeaders(true),
      }
    );
    return handleResponse<boolean>(response);
  },

  /**
   * Unsubscribe from a service
   */
  async unsubscribeFromService(customerId: number, serviceId: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/subscriptions/customer/${customerId}/service/${serviceId}`,
      {
        method: 'DELETE',
        headers: getHeaders(true),
      }
    );
    return handleResponse<void>(response);
  },

  /**
   * Delete subscription by ID
   */
  async deleteSubscription(subscriptionId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse<void>(response);
  },

  /**
   * Get subscription count for customer
   */
  async getSubscriptionCount(customerId: number): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/customer/${customerId}/count`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse<number>(response);
  },

  // ============================================
  // REVIEW APIs
  // ============================================
  
  /**
   * Create a new review
   */
  async createReview(
    customerId: number, 
    serviceId: number, 
    reviewData: CreateReviewRequest
  ): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({
        customer: { id: customerId },
        service: { id: serviceId },
        rating: reviewData.rating,
        comment: reviewData.comment,
      }),
    });
    return handleResponse<Review>(response);
  },

  /**
   * Get customer's reviews
   */
  async getMyReviews(customerId: number): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/api/reviews/customer/${customerId}`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return handleResponse<Review[]>(response);
  },

  /**
   * Get reviews for a service
   */
  async getServiceReviews(serviceId: number): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/api/reviews/service/${serviceId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<Review[]>(response);
  },

  /**
   * Get average rating for a service
   */
  async getServiceAverageRating(serviceId: number): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/api/reviews/service/${serviceId}/average-rating`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse<number>(response);
  },

  /**
   * Update a review
   */
  async updateReview(reviewId: number, reviewData: CreateReviewRequest): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({
        rating: reviewData.rating,
        comment: reviewData.comment,
      }),
    });
    return handleResponse<Review>(response);
  },

  /**
   * Delete a review
   */
  async deleteReview(reviewId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse<void>(response);
  },

  // ============================================
  // STATISTICS & DASHBOARD APIs
  // ============================================
  
  /**
   * Get customer statistics for dashboard
   */
  async getCustomerStatistics(customerId: number): Promise<CustomerStatistics> {
    try {
      const [subscriptions, reviews] = await Promise.all([
        this.getMySubscriptions(customerId),
        this.getMyReviews(customerId)
      ]);

      const totalSpent = subscriptions.reduce((total, sub) => total + sub.service.price, 0);
      
      const recentActivity = [
        ...subscriptions.slice(0, 3).map(sub => ({
          type: 'subscription' as const,
          description: `Subscribed to ${sub.service.name}`,
          timestamp: sub.subscribedAt
        })),
        ...reviews.slice(0, 3).map(review => ({
          type: 'review' as const,
          description: `Reviewed ${review.service.name}`,
          timestamp: review.createdAt
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

      return {
        totalSubscriptions: subscriptions.length,
        totalReviews: reviews.length,
        totalSpent,
        recentActivity
      };
    } catch (error) {
      console.error('Error fetching customer statistics:', error);
      return {
        totalSubscriptions: 0,
        totalReviews: 0,
        totalSpent: 0,
        recentActivity: []
      };
    }
  },

  // ============================================
  // UTILITY APIs
  // ============================================
  
  /**
   * Check if customer is logged in
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('customerId');
  },

  /**
   * Get stored customer ID
   */
  getStoredCustomerId(): number | null {
    const id = localStorage.getItem('customerId');
    return id ? parseInt(id) : null;
  },

  /**
   * Clear all stored data
   */
  clearStoredData(): void {
    localStorage.clear();
  }
};

export default customerApi;