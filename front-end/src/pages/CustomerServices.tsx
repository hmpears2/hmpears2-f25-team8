import React, { useState, useEffect } from 'react';
import customerApi from '../services/customerApi';
import type{ Service } from '../types/types';

interface CustomerServicesProps {
  customerId: number;
  onSubscribe: () => void;
}

const CustomerServices: React.FC<CustomerServicesProps> = ({ customerId, onSubscribe }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [subscribedServices, setSubscribedServices] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [subscribing, setSubscribing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState<string>('name');

  // Get unique categories from services
  const categories = Array.from(new Set(services.map(s => s.serviceType || 'Other').filter(Boolean)));

  useEffect(() => {
    loadServices();
  }, [customerId]);

  useEffect(() => {
    applyFilters();
  }, [services, searchTerm, selectedCategory, priceRange, sortBy]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all active services
      const servicesData = await customerApi.getActiveServices();
      
      // Load user's subscriptions to check which services they're already subscribed to
      const subscriptions = await customerApi.getMySubscriptions(customerId);
      const subscribedIds = new Set(subscriptions.map(sub => sub.service.id));
      
      // Load average ratings for each service
      const servicesWithRatings = await Promise.all(
        servicesData.map(async (service) => {
          try {
            const avgRating = await customerApi.getServiceAverageRating(service.id);
            const reviews = await customerApi.getServiceReviews(service.id);
            return { 
              ...service, 
              averageRating: avgRating || 0,
              reviewCount: reviews.length 
            };
          } catch {
            return { ...service, averageRating: 0, reviewCount: 0 };
          }
        })
      );

      setServices(servicesWithRatings);
      setSubscribedServices(subscribedIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...services];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.provider.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => 
        (service.serviceType || 'Other') === selectedCategory
      );
    }

    // Price range filter
    filtered = filtered.filter(service => 
      service.price >= priceRange.min && service.price <= priceRange.max
    );

    // Sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'provider':
        filtered.sort((a, b) => a.provider.companyName.localeCompare(b.provider.companyName));
        break;
    }

    setFilteredServices(filtered);
  };

  const handleSubscribe = async (serviceId: number) => {
    try {
      setSubscribing(serviceId);
      setError(null);
      setSuccessMessage(null);

      await customerApi.subscribeToService(customerId, serviceId);
      
      setSubscribedServices(prev => new Set(prev).add(serviceId));
      setSuccessMessage('Successfully subscribed to the service!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Call parent refresh
      onSubscribe();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe to service');
    } finally {
      setSubscribing(null);
    }
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="bi bi-star-fill text-warning"></i>);
    }
    if (hasHalfStar && fullStars < 5) {
      stars.push(<i key="half" className="bi bi-star-half text-warning"></i>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<i key={i} className="bi bi-star text-warning"></i>);
    }
    return stars;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading services...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">
        <i className="bi bi-grid-3x3-gap me-2"></i>
        Browse Available Services
      </h2>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle me-2"></i>
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)}></button>
        </div>
      )}

      {/* Filters Section */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* Search */}
            <div className="col-md-4">
              <label className="form-label">Search Services</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or provider..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="col-md-3">
              <label className="form-label">Category</label>
              <select 
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="col-md-3">
              <label className="form-label">Max Price: ${priceRange.max}</label>
              <input
                type="range"
                className="form-range"
                min="0"
                max="1000"
                step="50"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
              />
              <div className="d-flex justify-content-between">
                <small>$0</small>
                <small>$1000</small>
              </div>
            </div>

            {/* Sort By */}
            <div className="col-md-2">
              <label className="form-label">Sort By</label>
              <select 
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="provider">Provider</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-muted mb-3">
        Showing {filteredServices.length} of {services.length} services
      </p>

      {/* Services Grid */}
      <div className="row">
        {filteredServices.length > 0 ? (
          filteredServices.map(service => (
            <div key={service.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  {/* Service Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title mb-1">{service.name}</h5>
                      <p className="text-muted small mb-0">
                        by {service.provider.companyName}
                      </p>
                    </div>
                    <span className="badge bg-primary rounded-pill">
                      {service.serviceType || 'General'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="card-text text-muted small">
                    {service.description || 'No description available'}
                  </p>

                  {/* Rating */}
                  <div className="mb-3">
                    <div className="d-flex align-items-center">
                      {renderStarRating(service.averageRating || 0)}
                      <span className="ms-2 text-muted small">
                        ({service.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Provider Info */}
                  <div className="mb-3 p-2 bg-light rounded">
                    <small className="text-muted">Provider Details:</small>
                    <div className="small">
                      <strong>{service.provider.firstName} {service.provider.lastName}</strong><br />
                      <i className="bi bi-envelope me-1"></i>{service.provider.email}<br />
                      <i className="bi bi-telephone me-1"></i>{service.provider.phoneNumber}<br />
                      {service.provider.yearsOfExperience && (
                        <span><i className="bi bi-award me-1"></i>{service.provider.yearsOfExperience} years experience</span>
                      )}
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="h4 text-primary mb-0">
                        {formatCurrency(service.price)}
                      </span>
                      <small className="text-muted d-block">per service</small>
                    </div>
                    
                    {subscribedServices.has(service.id) ? (
                      <button className="btn btn-success" disabled>
                        <i className="bi bi-check-circle me-1"></i>
                        Subscribed
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleSubscribe(service.id)}
                        disabled={subscribing === service.id}
                      >
                        {subscribing === service.id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1"></span>
                            Subscribing...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-bookmark-plus me-1"></i>
                            Subscribe
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              No services found matching your criteria. Try adjusting your filters.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerServices;