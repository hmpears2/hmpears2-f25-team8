import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { providerService, type Provider } from '../services/providerApi';
import { api } from '../services/api';

interface Service {
  id?: number;
  name: string;
  description: string;
  price: number;
  serviceType: string;
  active: boolean;
  provider?: { id: number };
}

const ProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [providerData, setProviderData] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceFormData, setServiceFormData] = useState<Service>({
    name: '',
    description: '',
    price: 0,
    serviceType: '',
    active: true,
  });
  const [statistics, setStatistics] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [replyingToReview, setReplyingToReview] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [deletingServiceId, setDeletingServiceId] = useState<number | null>(null);

  useEffect(() => {
    const loadProviderData = () => {
      const storedData = localStorage.getItem('providerData');
      const storedId = localStorage.getItem('providerId');
      
      if (storedData) {
        setProviderData(JSON.parse(storedData));
        setIsLoading(false);
      } else if (storedId) {
        fetchProviderData(parseInt(storedId));
      } else {
        navigate('/');
      }
    };

    const fetchProviderData = async (id: number) => {
      try {
        const data = await providerService.getProvider(id);
        setProviderData(data);
        localStorage.setItem('providerData', JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching provider data:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadProviderData();
  }, [navigate]);

  // Load services when provider data is available
  useEffect(() => {
    if (providerData?.id) {
      loadServices();
    }
  }, [providerData?.id]);

  const loadServices = async () => {
    if (!providerData?.id) return;
    
    try {
      const servicesData = await api.getServicesByProvider(providerData.id);
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleServiceFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setServiceFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!providerData?.id) return;

    try {
      if (editingService) {
        // Update existing service
        await api.updateService(editingService.id!, {
          ...serviceFormData,
          provider: { id: providerData.id }
        });
        alert('Service updated successfully!');
      } else {
        // Create new service
        await api.createService({
          ...serviceFormData,
          provider: { id: providerData.id }
        });
        alert('Service created successfully!');
      }
      
      // Reset form and reload services
      setServiceFormData({
        name: '',
        description: '',
        price: 0,
        serviceType: '',
        active: true,
      });
      setEditingService(null);
      setShowServiceForm(false);
      await loadServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service. Please try again.');
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      serviceType: service.serviceType,
      active: service.active,
    });
    setShowServiceForm(true);
  };

  const handleDeleteService = async (serviceId: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    // Prevent multiple clicks
    if (deletingServiceId) return;
    
    setDeletingServiceId(serviceId);
    try {
      await api.deleteService(serviceId);
      alert('Service deleted successfully!');
      await loadServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service. Please try again.');
    } finally {
      setDeletingServiceId(null);
    }
  };

  const handleToggleServiceActive = async (service: Service) => {
    try {
      if (service.active) {
        await api.deactivateService(service.id!);
      } else {
        await api.activateService(service.id!);
      }
      await loadServices();
    } catch (error) {
      console.error('Error toggling service status:', error);
      alert('Failed to update service status.');
    }
  };

  const loadStatistics = async () => {
    if (!providerData?.id) return;
    
    try {
      setStatsLoading(true);
      
      // Load statistics, subscriptions, and reviews in parallel
      const [statsData, subsData, reviewsData] = await Promise.all([
        api.getProviderStatistics(providerData.id),
        api.getProviderSubscriptions(providerData.id),
        api.getProviderReviews(providerData.id)
      ]);
      
      setStatistics(statsData);
      setSubscriptions(subsData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadReviews = async () => {
    if (!providerData?.id) return;
    
    try {
      setReviewsLoading(true);
      const reviewsData = await api.getProviderReviews(providerData.id);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAddReply = async (reviewId: number) => {
    if (!replyText.trim()) {
      alert('Please enter a response');
      return;
    }

    try {
      await api.addProviderResponse(reviewId, replyText);
      alert('Response added successfully!');
      setReplyingToReview(null);
      setReplyText('');
      await loadReviews();
    } catch (error) {
      console.error('Error adding response:', error);
      alert('Failed to add response. Please try again.');
    }
  };

  const showSection = (section: string) => {
    setActiveSection(section);
    
    // Load statistics when navigating to statistics section
    if (section === 'statistics' && !statistics) {
      loadStatistics();
    }
    
    // Load reviews when navigating to reviews section
    if (section === 'reviews' && reviews.length === 0) {
      loadReviews();
    }
  };

  const removeProfile = async () => {
    if (confirm('Are you sure you want to remove your provider profile? This action cannot be undone.')) {
      if (providerData?.id) {
        try {
          await providerService.deleteProvider(providerData.id);
          localStorage.removeItem('providerId');
          localStorage.removeItem('providerData');
          alert('Provider profile has been removed. You will be redirected to the login page.');
          navigate('/');
        } catch (error) {
          console.error('Error deleting provider:', error);
          alert('Failed to delete profile. Please try again.');
        }
      }
    }
  };

  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!providerData?.id) return;

    const formData = new FormData(e.currentTarget);
    const updatedProvider = {
      businessName: formData.get('businessName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      yearsExperience: parseInt(formData.get('yearsExperience') as string),
      address: formData.get('address') as string,
      licenseNumber: formData.get('licenseNumber') as string,
      primaryService: formData.get('primaryService') as string,
    };

    try {
      const result = await providerService.updateProvider(providerData.id, updatedProvider);
      setProviderData(result);
      localStorage.setItem('providerData', JSON.stringify(result));
      alert('Provider profile updated successfully!');
    } catch (error) {
      console.error('Error updating provider:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!providerData) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-danger">
          Failed to load provider data. Please try logging in again.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-warning shadow-sm border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-dark" href="#">
            <i className="bi bi-tools me-2"></i>HOMECONNECT PRO
          </a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'dashboard' ? 'active bg-dark text-white' : 'text-dark'} rounded px-3 btn btn-link`}
                  onClick={() => showSection('dashboard')}
                >
                  DASHBOARD
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'services' ? 'active bg-dark text-white' : 'text-dark'} btn btn-link`}
                  onClick={() => showSection('services')}
                >
                  MY SERVICES
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'statistics' ? 'active bg-dark text-white' : 'text-dark'} btn btn-link`}
                  onClick={() => showSection('statistics')}
                >
                  CUSTOMER STATS
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'reviews' ? 'active bg-dark text-white' : 'text-dark'} btn btn-link`}
                  onClick={() => showSection('reviews')}
                >
                  REVIEWS
                </button>
              </li>
            </ul>
            <div className="dropdown">
              <button className="btn btn-outline-dark dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                <i className="bi bi-tools fs-5 me-2"></i>{providerData.businessName}
              </button>
              <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={() => showSection('profile')}><i className="bi bi-gear me-2"></i>Modify Profile</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={() => navigate('/')}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      {activeSection === 'dashboard' && (
        <div className="container-fluid py-4">
          {/* Welcome Section */}
          <div className="alert alert-warning border-0 mb-4">
            <h1 className="alert-heading h2 mb-2 text-dark">Welcome back, {providerData.businessName}!</h1>
            <p className="mb-0 text-dark">{providerData.businessName} • {providerData.yearsExperience} years in business</p>
          </div>

          {/* Quick Actions */}
          <div className="mb-5">
            <h2 className="mb-3 text-dark">Quick Actions</h2>
            <div className="row g-3">
              <div className="col-md-6 col-lg-3">
                <div className="card text-decoration-none h-100 border-primary bg-white shadow-sm" onClick={() => showSection('services')} style={{cursor: 'pointer'}}>
                  <div className="card-body text-center">
                    <i className="bi bi-plus-circle fs-1 text-primary mb-3"></i>
                    <h5 className="card-title text-dark">Create Services</h5>
                    <p className="card-text text-muted small">Add or modify your services</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card text-decoration-none h-100 border-success bg-white shadow-sm" onClick={() => showSection('statistics')} style={{cursor: 'pointer'}}>
                  <div className="card-body text-center">
                    <i className="bi bi-graph-up fs-1 text-success mb-3"></i>
                    <h5 className="card-title text-dark">Customer Statistics</h5>
                    <p className="card-text text-muted small">View customer analytics</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card text-decoration-none h-100 border-warning bg-white shadow-sm" onClick={() => showSection('profile')} style={{cursor: 'pointer'}}>
                  <div className="card-body text-center">
                    <i className="bi bi-person-gear fs-1 text-warning mb-3"></i>
                    <h5 className="card-title text-dark">Modify Profile</h5>
                    <p className="card-text text-muted small">Update provider profile</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card text-decoration-none h-100 border-info bg-white shadow-sm" onClick={() => showSection('reviews')} style={{cursor: 'pointer'}}>
                  <div className="card-body text-center">
                    <i className="bi bi-chat-dots fs-1 text-info mb-3"></i>
                    <h5 className="card-title text-dark">Reply to Reviews</h5>
                    <p className="card-text text-muted small">Respond to customer feedback</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Section */}
      {activeSection === 'services' && (
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>My Services</h2>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setEditingService(null);
                setServiceFormData({
                  name: '',
                  description: '',
                  price: 0,
                  serviceType: '',
                  active: true,
                });
                setShowServiceForm(!showServiceForm);
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              {showServiceForm ? 'Cancel' : 'Add New Service'}
            </button>
          </div>
          
          {/* Service Form */}
          {showServiceForm && (
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">{editingService ? 'Edit Service' : 'Add New Service'}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmitService}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Service Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={serviceFormData.name}
                        onChange={handleServiceFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        name="price"
                        value={serviceFormData.price}
                        onChange={handleServiceFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Service Type *</label>
                      <select
                        className="form-select"
                        name="serviceType"
                        value={serviceFormData.serviceType}
                        onChange={handleServiceFormChange}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Electrical">Electrical</option>
                        <option value="HVAC">HVAC</option>
                        <option value="Carpentry">Carpentry</option>
                        <option value="Landscaping">Landscaping</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Painting">Painting</option>
                        <option value="Roofing">Roofing</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows={3}
                      value={serviceFormData.description}
                      onChange={handleServiceFormChange}
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-save me-2"></i>
                      {editingService ? 'Update Service' : 'Create Service'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowServiceForm(false);
                        setEditingService(null);
                        setServiceFormData({
                          name: '',
                          description: '',
                          price: 0,
                          serviceType: '',
                          active: true,
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Services List */}
          <div className="row">
            {services.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-info">
                  <h4>No Services Yet</h4>
                  <p>You haven't added any services yet. Click "Add New Service" to get started!</p>
                  <p className="mb-0">Your primary service is: <strong>{providerData.primaryService}</strong></p>
                </div>
              </div>
            ) : (
              services.map((service) => (
                <div key={service.id} className="col-md-6 col-lg-4 mb-3">
                  <div className={`card h-100 ${service.active ? '' : 'border-secondary'}`}>
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">{service.name}</h5>
                      <span className={`badge ${service.active ? 'bg-success' : 'bg-secondary'}`}>
                        {service.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="card-body">
                      <p className="card-text text-muted small mb-2">
                        <strong>Type:</strong> {service.serviceType}
                      </p>
                      <p className="card-text">{service.description || 'No description provided'}</p>
                      <p className="card-text">
                        <strong className="text-success fs-5">${service.price.toFixed(2)}</strong>
                      </p>
                    </div>
                    <div className="card-footer bg-white d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary flex-fill"
                        onClick={() => handleEditService(service)}
                      >
                        <i className="bi bi-pencil me-1"></i>Edit
                      </button>
                      <button
                        className={`btn btn-sm flex-fill ${service.active ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleToggleServiceActive(service)}
                      >
                        <i className={`bi ${service.active ? 'bi-pause' : 'bi-play'} me-1`}></i>
                        {service.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteService(service.id!)}
                        disabled={deletingServiceId === service.id}
                      >
                        {deletingServiceId === service.id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            Deleting...
                          </>
                        ) : (
                          <i className="bi bi-trash"></i>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Statistics Section */}
      {activeSection === 'statistics' && (
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Customer Statistics</h2>
            <button 
              className="btn btn-primary"
              onClick={loadStatistics}
              disabled={statsLoading}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              {statsLoading ? 'Loading...' : 'Refresh Stats'}
            </button>
          </div>

          {statsLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading statistics...</span>
              </div>
            </div>
          ) : statistics ? (
            <>
              {/* Overview Cards */}
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <div className="card bg-primary text-white h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="card-subtitle mb-2 text-white-50">Total Subscriptions</h6>
                          <h2 className="card-title mb-0">{subscriptions.length}</h2>
                        </div>
                        <i className="bi bi-people-fill fs-1 opacity-50"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="card bg-success text-white h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="card-subtitle mb-2 text-white-50">Average Rating</h6>
                          <h2 className="card-title mb-0">
                            {statistics.averageRating ? statistics.averageRating.toFixed(1) : '0.0'}
                            <i className="bi bi-star-fill ms-2 fs-5"></i>
                          </h2>
                        </div>
                        <i className="bi bi-star-fill fs-1 opacity-50"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="card bg-info text-white h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="card-subtitle mb-2 text-white-50">Total Reviews</h6>
                          <h2 className="card-title mb-0">{statistics.totalReviews || 0}</h2>
                        </div>
                        <i className="bi bi-chat-dots-fill fs-1 opacity-50"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="card bg-warning text-dark h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="card-subtitle mb-2">Active Services</h6>
                          <h2 className="card-title mb-0">{services.filter(s => s.active).length}</h2>
                        </div>
                        <i className="bi bi-tools fs-1 opacity-50"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Distribution */}
              {statistics.ratingDistribution && (
                <div className="card mb-4">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">
                      <i className="bi bi-bar-chart-fill me-2"></i>
                      Rating Distribution
                    </h5>
                  </div>
                  <div className="card-body">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = statistics.ratingDistribution[rating] || 0;
                      const percentage = statistics.totalReviews > 0 
                        ? (count / statistics.totalReviews) * 100 
                        : 0;
                      
                      return (
                        <div key={rating} className="mb-3">
                          <div className="d-flex align-items-center mb-1">
                            <span className="me-2" style={{ minWidth: '60px' }}>
                              {rating} <i className="bi bi-star-fill text-warning"></i>
                            </span>
                            <div className="progress flex-grow-1 me-2" style={{ height: '20px' }}>
                              <div 
                                className={`progress-bar ${rating >= 4 ? 'bg-success' : rating >= 3 ? 'bg-warning' : 'bg-danger'}`}
                                role="progressbar" 
                                style={{ width: `${percentage}%` }}
                                aria-valuenow={percentage} 
                                aria-valuemin={0} 
                                aria-valuemax={100}
                              >
                                {percentage > 10 && `${percentage.toFixed(0)}%`}
                              </div>
                            </div>
                            <span className="text-muted" style={{ minWidth: '40px' }}>
                              ({count})
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="row">
                {/* Service Ratings */}
                {statistics.serviceRatings && Object.keys(statistics.serviceRatings).length > 0 && (
                  <div className="col-md-6 mb-4">
                    <div className="card h-100">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">
                          <i className="bi bi-tools me-2"></i>
                          Service Ratings
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="list-group list-group-flush">
                          {Object.entries(statistics.serviceRatings).map(([serviceName, rating]: [string, any]) => (
                            <div key={serviceName} className="list-group-item d-flex justify-content-between align-items-center px-0">
                              <span>{serviceName}</span>
                              <span className="badge bg-warning text-dark">
                                {typeof rating === 'number' ? rating.toFixed(1) : rating} <i className="bi bi-star-fill"></i>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subscribed Customers */}
                <div className="col-md-6 mb-4">
                  <div className="card h-100">
                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        <i className="bi bi-people me-2"></i>
                        Subscribed Customers
                      </h5>
                      <span className="badge bg-primary">{subscriptions.length}</span>
                    </div>
                    <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {subscriptions.length === 0 ? (
                        <div className="text-center text-muted py-4">
                          <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                          <p>No subscriptions yet</p>
                        </div>
                      ) : (
                        <div className="list-group list-group-flush">
                          {subscriptions.map((sub: any, index: number) => (
                            <div key={sub.id || index} className="list-group-item px-0">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="mb-1">
                                    {sub.customer?.firstName} {sub.customer?.lastName}
                                  </h6>
                                  <p className="mb-1 small text-muted">
                                    <i className="bi bi-envelope me-1"></i>
                                    {sub.customer?.email}
                                  </p>
                                  <p className="mb-0 small">
                                    <strong>Service:</strong> {sub.service?.name}
                                  </p>
                                </div>
                                <span className="badge bg-success">Active</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Reviews */}
              {reviews.length > 0 && (
                <div className="card">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="bi bi-chat-left-text me-2"></i>
                      Recent Reviews
                    </h5>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => showSection('reviews')}
                    >
                      View All Reviews
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {reviews.slice(0, 3).map((review: any) => (
                        <div key={review.id} className="col-md-4 mb-3">
                          <div className="card h-100 border">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="mb-0">
                                  {review.customer?.firstName} {review.customer?.lastName}
                                </h6>
                                <span className="badge bg-warning text-dark">
                                  {review.rating} <i className="bi bi-star-fill"></i>
                                </span>
                              </div>
                              <p className="small text-muted mb-2">
                                <i className="bi bi-tools me-1"></i>
                                {review.service?.name}
                              </p>
                              <p className="card-text small">
                                {review.comment?.length > 100 
                                  ? `${review.comment.substring(0, 100)}...` 
                                  : review.comment}
                              </p>
                              <p className="small text-muted mb-0">
                                <i className="bi bi-calendar me-1"></i>
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="alert alert-info">
              <h4>No Statistics Available</h4>
              <p>Click "Refresh Stats" to load your customer statistics.</p>
            </div>
          )}
        </div>
      )}

      {/* Reviews Section */}
      {activeSection === 'reviews' && (
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Customer Reviews</h2>
            <button 
              className="btn btn-primary"
              onClick={loadReviews}
              disabled={reviewsLoading}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              {reviewsLoading ? 'Loading...' : 'Refresh Reviews'}
            </button>
          </div>

          {reviewsLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading reviews...</span>
              </div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="alert alert-info">
              <h4><i className="bi bi-inbox me-2"></i>No Reviews Yet</h4>
              <p>You haven't received any customer reviews yet. Reviews will appear here once customers subscribe to your services and leave feedback.</p>
            </div>
          ) : (
            <div className="row">
              {reviews.map((review: any) => (
                <div key={review.id} className="col-12 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                                 style={{ width: '50px', height: '50px', fontSize: '20px' }}>
                              {review.customer?.firstName?.[0]}{review.customer?.lastName?.[0]}
                            </div>
                            <div>
                              <h5 className="mb-0">
                                {review.customer?.firstName} {review.customer?.lastName}
                              </h5>
                              <p className="text-muted small mb-0">
                                <i className="bi bi-envelope me-1"></i>
                                {review.customer?.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <i 
                                key={star}
                                className={`bi bi-star${star <= review.rating ? '-fill' : ''} ${
                                  star <= review.rating ? 'text-warning' : 'text-muted'
                                }`}
                              ></i>
                            ))}
                            <span className="ms-2 badge bg-warning text-dark">
                              {review.rating}/5
                            </span>
                          </div>
                          <small className="text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </small>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-muted small mb-1">
                          <i className="bi bi-tools me-1"></i>
                          <strong>Service:</strong> {review.service?.name}
                        </p>
                        <div className="bg-light p-3 rounded">
                          <p className="mb-0">{review.comment}</p>
                        </div>
                      </div>

                      {/* Provider Response Section */}
                      {review.providerResponse ? (
                        <div className="bg-success bg-opacity-10 p-3 rounded border-start border-success border-4">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="text-success mb-0">
                              <i className="bi bi-reply-fill me-2"></i>
                              Your Response
                            </h6>
                            <small className="text-muted">
                              <i className="bi bi-calendar me-1"></i>
                              {new Date(review.responseDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </small>
                          </div>
                          <p className="mb-0">{review.providerResponse}</p>
                        </div>
                      ) : replyingToReview === review.id ? (
                        <div className="border-top pt-3">
                          <h6 className="mb-3">
                            <i className="bi bi-reply me-2"></i>
                            Add Your Response
                          </h6>
                          <textarea
                            className="form-control mb-3"
                            rows={3}
                            placeholder="Write your response to this review..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success"
                              onClick={() => handleAddReply(review.id)}
                              disabled={!replyText.trim()}
                            >
                              <i className="bi bi-send me-2"></i>
                              Submit Response
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={() => {
                                setReplyingToReview(null);
                                setReplyText('');
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="border-top pt-3">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                              setReplyingToReview(review.id);
                              setReplyText('');
                            }}
                          >
                            <i className="bi bi-reply me-2"></i>
                            Reply to Review
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Section */}
      {activeSection === 'profile' && (
        <div className="container-fluid py-4">
          <h2 className="mb-4">Provider Profile</h2>
          <div className="card">
            <div className="card-body">
              <form onSubmit={updateProfile}>
                <div className="mb-3">
                  <label className="form-label">Business Name</label>
                  <input type="text" className="form-control" name="businessName" defaultValue={providerData.businessName} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" name="email" defaultValue={providerData.email} required />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-control" name="phone" defaultValue={providerData.phone} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Years Experience</label>
                    <input type="number" className="form-control" name="yearsExperience" defaultValue={providerData.yearsExperience} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" name="address" defaultValue={providerData.address} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">License Number</label>
                  <input type="text" className="form-control" name="licenseNumber" defaultValue={providerData.licenseNumber} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Primary Service</label>
                  <input type="text" className="form-control" name="primaryService" defaultValue={providerData.primaryService} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Business Hours</label>
                  <input type="text" className="form-control" name="businessHours" defaultValue="Mon-Fri 9AM-5PM" required />
                </div>
                <div className="btn-group">
                  <button type="submit" className="btn btn-primary">Update Profile</button>
                  <button type="button" className="btn btn-danger" onClick={removeProfile}>Remove Profile</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;