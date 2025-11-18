import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customerApi from '../services/customerApi';
import type { Customer, CustomerStatistics } from '../types/types';
import CustomerServices from './CustomerServices';
import CustomerSubscriptions from './CustomerSubscriptions';
import CustomerProfile from './CustomerProfile';
import CustomerReviews from './CustomerReviews';

interface DashboardTab {
  id: string;
  label: string;
  icon: string;
}

const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [statistics, setStatistics] = useState<CustomerStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const tabs: DashboardTab[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { id: 'services', label: 'Browse Services', icon: 'bi-grid-3x3-gap' },
    { id: 'subscriptions', label: 'My Subscriptions', icon: 'bi-bookmark-star' },
    { id: 'reviews', label: 'My Reviews', icon: 'bi-star' },
    { id: 'profile', label: 'Profile', icon: 'bi-person-gear' },
  ];

  useEffect(() => {
    loadCustomerData();
  }, [refreshKey]);

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);

      const customerId = customerApi.getStoredCustomerId();
      if (!customerId) {
        navigate('/login');
        return;
      }

      const [customerData, stats] = await Promise.all([
        customerApi.getCustomerById(customerId),
        customerApi.getCustomerStatistics(customerId)
      ]);

      setCustomer(customerData);
      setStatistics(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customer data');
      console.error('Error loading customer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    customerApi.logout();
    navigate('/');
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-primary d-flex align-items-center" href="#">
            <i className="bi bi-house-fill me-2 fs-4"></i>
            <span>HOMECONNECT PRO</span>
          </a>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              {tabs.map(tab => (
                <li className="nav-item" key={tab.id}>
                  <button
                    className={`nav-link btn btn-link ${
                      activeSection === tab.id ? 'active text-primary fw-bold' : 'text-dark'
                    }`}
                    onClick={() => setActiveSection(tab.id)}
                  >
                    <i className={`${tab.icon} me-2`}></i>
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-link text-dark me-3"
                onClick={handleRefresh}
                title="Refresh"
              >
                <i className="bi bi-arrow-clockwise fs-5"></i>
              </button>
              
              <div className="dropdown">
                <button 
                  className="btn btn-outline-primary dropdown-toggle d-flex align-items-center" 
                  type="button" 
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle fs-5 me-2"></i>
                  {customer.firstName} {customer.lastName}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={() => setActiveSection('profile')}
                    >
                      <i className="bi bi-gear me-2"></i>Settings
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item text-danger" 
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid py-4">
        {/* Dashboard Section */}
        {activeSection === 'dashboard' && statistics && (
          <div className="dashboard-content">
            {/* Welcome Section */}
            <div className="alert alert-primary bg-gradient border-0 mb-4 shadow-sm">
              <h1 className="alert-heading h2 mb-2">
                Welcome back, {customer.firstName}!
              </h1>
              <p className="mb-0">
                Manage your home services, track subscriptions, and write reviews all in one place.
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-2">Active Subscriptions</h6>
                        <h2 className="mb-0">{statistics.totalSubscriptions}</h2>
                      </div>
                      <div className="text-primary">
                        <i className="bi bi-bookmark-star-fill fs-1"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-2">Reviews Written</h6>
                        <h2 className="mb-0">{statistics.totalReviews}</h2>
                      </div>
                      <div className="text-warning">
                        <i className="bi bi-star-fill fs-1"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-2">Total Spent</h6>
                        <h2 className="mb-0">{formatCurrency(statistics.totalSpent)}</h2>
                      </div>
                      <div className="text-success">
                        <i className="bi bi-currency-dollar fs-1"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="row">
              <div className="col-lg-8 mb-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-0 py-3">
                    <h5 className="mb-0">
                      <i className="bi bi-clock-history me-2"></i>
                      Recent Activity
                    </h5>
                  </div>
                  <div className="card-body">
                    {statistics.recentActivity.length > 0 ? (
                      <div className="timeline">
                        {statistics.recentActivity.map((activity, index) => (
                          <div key={index} className="d-flex mb-3">
                            <div className="flex-shrink-0">
                              <div className={`rounded-circle p-2 ${
                                activity.type === 'subscription' ? 'bg-primary' : 
                                activity.type === 'review' ? 'bg-warning' : 'bg-info'
                              } text-white`}>
                                <i className={`bi ${
                                  activity.type === 'subscription' ? 'bi-bookmark-plus' : 
                                  activity.type === 'review' ? 'bi-star' : 'bi-person'
                                }`}></i>
                              </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                              <h6 className="mb-1">{activity.description}</h6>
                              <small className="text-muted">
                                {formatDate(activity.timestamp)}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="col-lg-4 mb-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-0 py-3">
                    <h5 className="mb-0">
                      <i className="bi bi-lightning-charge me-2"></i>
                      Quick Actions
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-primary"
                        onClick={() => setActiveSection('services')}
                      >
                        <i className="bi bi-search me-2"></i>
                        Browse Services
                      </button>
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => setActiveSection('subscriptions')}
                      >
                        <i className="bi bi-bookmark me-2"></i>
                        View Subscriptions
                      </button>
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => setActiveSection('reviews')}
                      >
                        <i className="bi bi-pen me-2"></i>
                        Write Review
                      </button>
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => setActiveSection('profile')}
                      >
                        <i className="bi bi-person me-2"></i>
                        Update Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info Card */}
            <div className="row">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-0 py-3">
                    <h5 className="mb-0">
                      <i className="bi bi-person-badge me-2"></i>
                      Your Information
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="text-muted small">Email</label>
                        <p className="mb-0">{customer.email}</p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="text-muted small">Phone</label>
                        <p className="mb-0">{customer.phoneNumber}</p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="text-muted small">Address</label>
                        <p className="mb-0">{customer.address}</p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="text-muted small">Member Since</label>
                        <p className="mb-0">{customer.createdAt ? formatDate(customer.createdAt) : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services Section */}
        {activeSection === 'services' && (
          <CustomerServices 
            customerId={customer.id}
            onSubscribe={handleRefresh}
          />
        )}

        {/* Subscriptions Section */}
        {activeSection === 'subscriptions' && (
          <CustomerSubscriptions 
            customerId={customer.id}
            onUpdate={handleRefresh}
          />
        )}

        {/* Reviews Section */}
        {activeSection === 'reviews' && (
          <CustomerReviews 
            customerId={customer.id}
            onUpdate={handleRefresh}
          />
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <CustomerProfile 
            customer={customer}
            onUpdate={(updatedCustomer) => {
              setCustomer(updatedCustomer);
              handleRefresh();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;