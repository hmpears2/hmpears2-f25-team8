// Type definitions for HomeConnectPro Customer Side

// Customer interface matching the backend entity
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  password?: string; // Optional for security reasons
  createdAt?: string;
  updatedAt?: string;
  subscriptions?: Subscription[];
  reviews?: Review[];
}

// Provider interface
export interface Provider {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  serviceCategory: string;
  licenseNumber: string;
  yearsOfExperience: number;
  bio?: string;
  hourlyRate?: number;
  rating?: number;
  verified?: boolean;
  services?: Service[];
}

// Service interface matching the backend entity
export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  provider: Provider;
  serviceType?: string;
  active: boolean;
  averageRating?: number; // Calculated from reviews
  reviewCount?: number;
}

// Subscription interface matching the backend entity
export interface Subscription {
  id: number;
  customer: Customer;
  service: Service;
  subscribedAt: string;
}

// Review interface matching the backend entity
export interface Review {
  id: number;
  customer: Customer;
  service: Service;
  rating: number;
  comment: string;
  createdAt: string;
}

// Login request interface
export interface LoginRequest {
  email: string;
  password: string;
}

// Registration request interface for customer
export interface CustomerRegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
}

// Update customer request interface
export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  password?: string;
}

// Create review request interface
export interface CreateReviewRequest {
  rating: number;
  comment: string;
}

// API Response wrapper for better error handling
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter options for services
export interface ServiceFilterOptions {
  serviceType?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  providerName?: string;
  active?: boolean;
}

// Pagination interface
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

// Statistics interface for dashboard
export interface CustomerStatistics {
  totalSubscriptions: number;
  totalReviews: number;
  totalSpent: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  type: 'subscription' | 'review' | 'profile_update';
  description: string;
  timestamp: string;
}

// Notification interface
export interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Session/Auth context interface
export interface AuthContextType {
  customer: Customer | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateCustomer: (customer: Customer) => void;
}