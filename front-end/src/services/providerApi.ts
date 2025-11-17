import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export interface Provider {
  id?: number;
  firstName?: string;
  lastName?: string;
  businessName: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  licenseNumber: string;
  yearsExperience: number;
  primaryService: string;
  userType?: string;
  active?: boolean;
}

export interface ProviderLoginRequest {
  email: string;
  password: string;
}

const providerApi = axios.create({
  baseURL: `${API_BASE_URL}/providers`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const providerService = {
  register: async (provider: Provider): Promise<Provider> => {
    const response = await providerApi.post('/register', provider);
    return response.data;
  },

  login: async (credentials: ProviderLoginRequest): Promise<Provider> => {
    const response = await providerApi.post('/login', credentials);
    return response.data;
  },

  getProvider: async (id: number): Promise<Provider> => {
    const response = await providerApi.get(`/${id}`);
    return response.data;
  },

  getAllProviders: async (): Promise<Provider[]> => {
    const response = await providerApi.get('/providers');
    return response.data;
  },

  updateProvider: async (id: number, provider: Provider): Promise<Provider> => {
    const response = await providerApi.put(`/${id}`, provider);
    return response.data;
  },

  deleteProvider: async (id: number): Promise<void> => {
    await providerApi.delete(`/${id}`);
  },
};

export default providerService;