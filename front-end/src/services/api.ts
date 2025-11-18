const API_BASE_URL = 'http://localhost:8080';

export const api = {
  // ============================================
  // PROVIDER APIs
  // ============================================
  
  async registerProvider(providerData: any) {
    const response = await fetch(`${API_BASE_URL}/providers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(providerData),
    });
    return response.json();
  },

  async loginProvider(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/providers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async getAllServices() {
    const response = await fetch(`${API_BASE_URL}/api/services`);
    return response.json();
  },

  async createService(serviceData: any) {
    const response = await fetch(`${API_BASE_URL}/api/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });
    return response.json();
  },

  // ============================================
  // CUSTOMER APIs
  // ============================================

  async registerCustomer(customerData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      });
      
      // Check if the response is OK (status 200-299)
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Registration failed. Please try again.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If parsing fails, use the status text
          errorMessage = `Registration failed: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      return response.json();
    } catch (error: any) {
      // If it's a network error or CORS issue
      if (error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. Please make sure the backend is running on http://localhost:8080');
      }
      // Re-throw other errors
      throw error;
    }
  },

  async loginCustomer(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Invalid email or password.');
      }
      
      return response.json();
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. Please make sure the backend is running.');
      }
      throw error;
    }
  },

  async getCustomerById(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch customer: ${response.status}`);
    }
    
    return response.json();
  },

  async updateCustomer(id: number, customerData: any) {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update customer: ${response.status}`);
    }
    
    return response.json();
  },

  async deleteCustomer(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete customer: ${response.status}`);
    }
    
    return response.json();
  },

  // ============================================
  // SERVICE APIs 
  // ============================================

  async getActiveServices() {
    const response = await fetch(`${API_BASE_URL}/api/services/active`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch active services: ${response.status}`);
    }
    
    return response.json();
  },

  async getServiceById(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/services/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch service: ${response.status}`);
    }
    
    return response.json();
  },

  async getServicesByProvider(providerId: number) {
    const response = await fetch(`${API_BASE_URL}/api/services/provider/${providerId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch provider services: ${response.status}`);
    }
    
    return response.json();
  },

  async updateService(id: number, serviceData: any) {
    const response = await fetch(`${API_BASE_URL}/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update service: ${response.status}`);
    }
    
    return response.json();
  },

  async deleteService(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/services/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete service: ${response.status}`);
    }
    
    return response.json();
  },

  async searchServices(name: string) {
    const response = await fetch(`${API_BASE_URL}/api/services/search?name=${encodeURIComponent(name)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to search services: ${response.status}`);
    }
    
    return response.json();
  },

  // ============================================
  // SUBSCRIPTION APIs 
  // ============================================

  async createSubscription(customerId: number, serviceId: number) {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { id: customerId },
        service: { id: serviceId },
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create subscription: ${response.status}`);
    }
    
    return response.json();
  },

  async getSubscriptionsByCustomer(customerId: number) {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/customer/${customerId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch subscriptions: ${response.status}`);
    }
    
    return response.json();
  },

  async getSubscriptionsByService(serviceId: number) {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/service/${serviceId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch subscriptions: ${response.status}`);
    }
    
    return response.json();
  },

  async getSubscriptionsByProvider(providerId: number) {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/provider/${providerId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch provider subscriptions: ${response.status}`);
    }
    
    return response.json();
  },

  async checkSubscription(customerId: number, serviceId: number) {
    const response = await fetch(
      `${API_BASE_URL}/api/subscriptions/check?customerId=${customerId}&serviceId=${serviceId}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to check subscription: ${response.status}`);
    }
    
    return response.json();
  },

  async deleteSubscription(subscriptionId: number) {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete subscription: ${response.status}`);
    }
    
    return response.json();
  },

  async unsubscribe(customerId: number, serviceId: number) {
    const response = await fetch(
      `${API_BASE_URL}/api/subscriptions/customer/${customerId}/service/${serviceId}`,
      { method: 'DELETE' }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to unsubscribe: ${response.status}`);
    }
    
    return response.json();
  },

  async getCustomerSubscriptionCount(customerId: number) {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/customer/${customerId}/count`);
    
    if (!response.ok) {
      throw new Error(`Failed to get subscription count: ${response.status}`);
    }
    
    return response.json();
  },

  // ============================================
  // REVIEW APIs 
  // ============================================

  async createReview(customerId: number, serviceId: number, rating: number, comment: string) {
    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { id: customerId },
        service: { id: serviceId },
        rating,
        comment,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create review: ${response.status}`);
    }
    
    return response.json();
  },

  async getReviewsByCustomer(customerId: number) {
    const response = await fetch(`${API_BASE_URL}/api/reviews/customer/${customerId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.status}`);
    }
    
    return response.json();
  },

  async getReviewsByService(serviceId: number) {
    const response = await fetch(`${API_BASE_URL}/api/reviews/service/${serviceId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch service reviews: ${response.status}`);
    }
    
    return response.json();
  },

  async getServiceAverageRating(serviceId: number) {
    const response = await fetch(`${API_BASE_URL}/api/reviews/service/${serviceId}/average-rating`);
    
    if (!response.ok) {
      throw new Error(`Failed to get average rating: ${response.status}`);
    }
    
    return response.json();
  },

  async updateReview(reviewId: number, rating: number, comment: string) {
    const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update review: ${response.status}`);
    }
    
    return response.json();
  },

  async deleteReview(reviewId: number) {
    const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete review: ${response.status}`);
    }
    
    return response.json();
  },

};