const API_BASE_URL = 'http://localhost:8080';

export const api = {
  // Provider APIs
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

};