import React, { useState, useEffect } from 'react';
import customerApi from '../services/customerApi';
import type{ Service } from '../types/types';

interface CustomerServicesProps {
  customerId: number;
  onSubscribe: () => void;
}

interface ServiceWithDistance {
  service: Service;
  distance: number;
  distanceFormatted: string;
}

const CustomerServices: React.FC<CustomerServicesProps> = ({ customerId, onSubscribe }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [servicesWithDistance, setServicesWithDistance] = useState<ServiceWithDistance[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceWithDistance[]>([]);
  const [subscribedServices, setSubscribedServices] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [subscribing, setSubscribing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState<string>('distance'); // Default to distance sorting
  
  // NEW: Distance filter state
  const [maxDistance, setMaxDistance] = useState<number>(50); // Default 50 miles
  const [useLocationFilter, setUseLocationFilter] = useState<boolean>(true);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);

  // Get unique categories from services
  const categories = Array.from(new Set(services.map(s => s.serviceType || 'Other').filter(Boolean)));

  useEffect(() => {
    loadServices();
  }, [customerId]);

  useEffect(() => {
    applyFilters();
  }, [servicesWithDistance, searchTerm, selectedCategory, priceRange, sortBy, maxDistance, useLocationFilter]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setLocationLoading(true);
      setError(null);

      // Load user's subscriptions first
      const subscriptions = await customerApi.getMySubscriptions(customerId);
      const subscribedIds = new Set(subscriptions.map(sub => sub.service.id));
      setSubscribedServices(subscribedIds);

      // Try to load services with distance from the location API
      try {
        const response = await fetch(
          `http://localhost:8080/api/location/services/with-distance?customerId=${customerId}`
        );
        
        if (response.ok) {
          const data: ServiceWithDistance[] = await response.json();
          
          // Enrich with ratings
          const enrichedData = await Promise.all(
            data.map(async (swd) => {
              try {
                const avgRating = await customerApi.getServiceAverageRating(swd.service.id);
                const reviews = await customerApi.getServiceReviews(swd.service.id);
                return {
                  ...swd,
                  service: {
                    ...swd.service,
                    averageRating: avgRating || 0,
                    reviewCount: reviews.length
                  }
                };
              } catch {
                return {
                  ...swd,
                  service: { ...swd.service, averageRating: 0, reviewCount: 0 }
                };
              }
            })
          );
          
          setServicesWithDistance(enrichedData);
          setServices(enrichedData.map(swd => swd.service));
        } else {
          // Fallback to regular service loading
          await loadServicesWithoutDistance();
        }
      } catch (locationError) {
        console.log('Location API not available, using standard service loading');
        await loadServicesWithoutDistance();
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services');
    } finally {
      setLoading(false);
      setLocationLoading(false);
    }
  };

  const loadServicesWithoutDistance = async () => {
    const servicesData = await customerApi.getActiveServices();
    
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
    // Create mock distance data (will show as N/A)
    setServicesWithDistance(servicesWithRatings.map(s => ({
      service: s,
      distance: -1,
      distanceFormatted: 'Distance unavailable'
    })));
    setUseLocationFilter(false);
  };

  const applyFilters = () => {
    let filtered = [...servicesWithDistance];

    // Distance filter (only if location data is available)
    if (useLocationFilter && maxDistance < 100) {
      filtered = filtered.filter(swd => swd.distance >= 0 && swd.distance <= maxDistance);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(swd =>
        swd.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        swd.service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        swd.service.provider?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(swd => 
        (swd.service.serviceType || 'Other') === selectedCategory
      );
    }

    // Price range filter
    filtered = filtered.filter(swd => 
      swd.service.price >= priceRange.min && swd.service.price <= priceRange.max
    );

    // Sorting
    switch (sortBy) {
      case 'distance':
        filtered.sort((a, b) => {
          if (a.distance < 0) return 1;
          if (b.distance < 0) return -1;
          return a.distance - b.distance;
        });
        break;
      case 'name':
        filtered.sort((a, b) => a.service.name.localeCompare(b.service.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.service.price - b.service.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.service.price - a.service.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.service.averageRating || 0) - (a.service.averageRating || 0));
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
      
      setTimeout(() => setSuccessMessage(null), 3000);
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

  const formatDistance = (distance: number): string => {
    if (distance < 0) return 'N/A';
    if (distance < 1) return '< 1 mile';
    return `${distance.toFixed(1)} mi`;
  };

  const getDistanceBadgeColor = (distance: number): string => {
    if (distance < 0) return 'secondary';
    if (distance <= 5) return 'success';
    if (distance <= 15) return 'primary';
    if (distance <= 25) return 'warning';
    return 'danger';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading services...</span>
          </div>
          {locationLoading && (
            <p className="text-muted">
              <i className="bi bi-geo-alt me-2"></i>
              Calculating distances to providers...
            </p>
          )}
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

      {/* Location Filter Banner */}
      {useLocationFilter && (
        <div className="alert alert-info border-0 shadow-sm mb-4">
          <div className="d-flex align-items-center">
            <i className="bi bi-geo-alt-fill fs-4 me-3 text-primary"></i>
            <div className="flex-grow-1">
              <strong>Location-Based Search Active</strong>
              <p className="mb-0 small text-muted">
                Services are sorted by distance from your address. Powered by Google Maps API.
              </p>
            </div>
            <span className="badge bg-primary rounded-pill">
              {filteredServices.length} nearby
            </span>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* Search */}
            <div className="col-md-3">
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

            {/* Distance Filter - NEW */}
            <div className="col-md-3">
              <label className="form-label">
                <i className="bi bi-geo-alt me-1"></i>
                Max Distance: {maxDistance >= 100 ? 'Any' : `${maxDistance} miles`}
              </label>
              <input
                type="range"
                className="form-range"
                min="5"
                max="100"
                step="5"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                disabled={!useLocationFilter}
              />
              <div className="d-flex justify-content-between">
                <small className="text-muted">5 mi</small>
                <small className="text-muted">Any</small>
              </div>
            </div>

            {/* Category Filter */}
            <div className="col-md-2">
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
            <div className="col-md-2">
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
            </div>

            {/* Sort By */}
            <div className="col-md-2">
              <label className="form-label">Sort By</label>
              <select 
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="distance">Distance (Nearest)</option>
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-muted mb-3">
        <i className="bi bi-funnel me-1"></i>
        Showing {filteredServices.length} of {services.length} services
        {useLocationFilter && maxDistance < 100 && ` within ${maxDistance} miles`}
      </p>

      {/* Services Grid */}
      <div className="row">
        {filteredServices.length > 0 ? (
          filteredServices.map(({ service, distance }) => (
            <div key={service.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  {/* Service Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title mb-1">{service.name}</h5>
                      <p className="text-muted small mb-0">
                        by {service.provider?.companyName || 'Unknown Provider'}
                      </p>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-primary rounded-pill mb-1 d-block">
                        {service.serviceType || 'General'}
                      </span>
                      {/* Distance Badge - NEW */}
                      {useLocationFilter && (
                        <span className={`badge bg-${getDistanceBadgeColor(distance)} rounded-pill`}>
                          <i className="bi bi-geo-alt me-1"></i>
                          {formatDistance(distance)}
                        </span>
                      )}
                    </div>
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
                      <strong>{service.provider?.firstName} {service.provider?.lastName}</strong><br />
                      <i className="bi bi-envelope me-1"></i>{service.provider?.email}<br />
                      <i className="bi bi-telephone me-1"></i>{service.provider?.phoneNumber || service.provider?.phoneNumber}<br />
                      {/* Distance Detail - NEW */}
                      {useLocationFilter && distance >= 0 && (
                        <span className="text-primary">
                          <i className="bi bi-geo-alt me-1"></i>
                          {distance < 1 ? 'Less than 1 mile away' : `${distance.toFixed(1)} miles from you`}
                        </span>
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
              No services found matching your criteria. 
              {useLocationFilter && maxDistance < 50 && (
                <span> Try increasing the distance filter or </span>
              )}
              Try adjusting your filters.
            </div>
          </div>
        )}
      </div>

      {/* Google Maps Attribution */}
      {useLocationFilter && (
        <div className="text-center text-muted small mt-4">
          <i className="bi bi-geo-alt me-1"></i>
          Distance calculations powered by Google Maps Geocoding API
        </div>
      )}
    </div>
  );
};

export default CustomerServices;