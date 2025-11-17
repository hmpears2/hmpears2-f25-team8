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
    const response = await fetch(`${API_BASE_URL}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });
    return response.json();
  },

  async loginCustomer(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/customers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  async getCustomerById(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`);
    return response.json();
  },

  async updateCustomer(id: number, customerData: any) {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });
    return response.json();
  },

  async deleteCustomer(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // ============================================
  // SERVICE APIs 
  // ============================================

  async getActiveServices() {
    const response = await fetch(`${API_BASE_URL}/api/services/active`);
    return response.json();
  },

  async getServiceById(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/services/${id}`);
    return response.json();
  },

  async getServicesByProvider(providerId: number) {
    const response = await fetch(`${API_BASE_URL}/api/services/provider/${providerId}`);
    return response.json();
  },

  async updateService(id: number, serviceData: any) {
    const response = await fetch(`${API_BASE_URL}/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });
    return response.json();
  },

  async deleteService(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/services/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  async searchServices(name: string) {
    const response = await fetch(`${API_BASE_URL}/api/services/search?name=${encodeURIComponent(name)}`);
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
    return response.json();
  },

  async getSubscriptionsByCustomer(customerId: number) {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/customer/${customerId}`);
    return response.json();
  },

  async getSubscriptionsByService(serviceId: number) {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/service/${serviceId}`);
    return response.json();
  },

  async getSubscriptionsByProvider(providerId: number) {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/provider/${providerId}`);
    return response.json();
  },

  async checkSubscription(customerId: number, serviceId: number) {
    const response = await fetch(
      `${API_BASE_URL}/api/subscriptions/check?customerId=${customerId}&serviceId=${serviceId}`
    );
    return response.json();
  },

  async deleteSubscription(subscriptionId: number) {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  async unsubscribe(customerId: number, serviceId: number) {
    const response = await fetch(
      `${API_BASE_URL}/api/subscriptions/customer/${customerId}/service/${serviceId}`,
      { method: 'DELETE' }
    );
    return response.json();
  },

  async getCustomerSubscriptionCount(customerId: number) {
    const response = await fetch(`${API_BASE_URL}/api/subscriptions/customer/${customerId}/count`);
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
    return response.json();
  },

  async getReviewsByCustomer(customerId: number) {
    const response = await fetch(`${API_BASE_URL}/api/reviews/customer/${customerId}`);
    return response.json();
  },

  async getReviewsByService(serviceId: number) {
    const response = await fetch(`${API_BASE_URL}/api/reviews/service/${serviceId}`);
    return response.json();
  },

  async getServiceAverageRating(serviceId: number) {
    const response = await fetch(`${API_BASE_URL}/api/reviews/service/${serviceId}/average-rating`);
    return response.json();
  },

  async updateReview(reviewId: number, rating: number, comment: string) {
    const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment }),
    });
    return response.json();
  },

  async deleteReview(reviewId: number) {
    const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

};