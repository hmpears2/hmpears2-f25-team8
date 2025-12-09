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
    
    try {
      await api.deleteService(serviceId);
      alert('Service deleted successfully!');
      await loadServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service. Please try again.');
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

  const showSection = (section: string) => {
    setActiveSection(section);
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
                      >
                        <i className="bi bi-trash"></i>
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
          <h2 className="mb-4">Customer Statistics</h2>
          <div className="alert alert-info">
            <h4>Statistics Dashboard</h4>
            <p>Customer statistics and analytics features are coming soon. This will show your total customers, monthly growth, ratings, and reviews.</p>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {activeSection === 'reviews' && (
        <div className="container-fluid py-4">
          <h2 className="mb-4">Customer Reviews</h2>
          <div className="alert alert-info">
            <h4>Reviews Management</h4>
            <p>Customer reviews and rating features are coming soon. You will be able to view and respond to customer feedback here.</p>
          </div>
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