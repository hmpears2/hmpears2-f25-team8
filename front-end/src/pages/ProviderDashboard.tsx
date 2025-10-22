import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  const showSection = (section: string) => {
    setActiveSection(section);
  };

  const createService = () => {
    const serviceName = prompt('Enter service name:');
    const serviceDescription = prompt('Enter service description:');
    const servicePrice = prompt('Enter hourly rate:');
    
    if (serviceName && serviceDescription && servicePrice) {
      alert(`Service "${serviceName}" created successfully!\nDescription: ${serviceDescription}\nRate: ${servicePrice}/hour`);
    }
  };

  const editService = (serviceName: string) => {
    const newDescription = prompt(`Edit description for ${serviceName}:`);
    const newPrice = prompt(`Edit price for ${serviceName}:`);
    
    if (newDescription && newPrice) {
      alert(`${serviceName} updated successfully!`);
    }
  };

  const removeService = (serviceName: string) => {
    if (confirm(`Are you sure you want to remove "${serviceName}"?`)) {
      alert(`${serviceName} has been removed.`);
    }
  };

  const removeProfile = () => {
    if (confirm('Are you sure you want to remove your provider profile? This action cannot be undone.')) {
      alert('Provider profile has been removed. You will be redirected to the login page.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

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
                <i className="bi bi-tools fs-5 me-2"></i>Mike Johnson
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
            <h1 className="alert-heading h2 mb-2 text-dark">Welcome back, Mike!</h1>
            <p className="mb-0 text-dark">Mike's Plumbing Services • 4.9 ⭐ Rating • 127 Reviews</p>
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
            <button className="btn btn-primary" onClick={createService}>Create New Service</button>
          </div>
          
          <div className="row g-3">
            <div className="col-md-6 col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Emergency Plumbing</h5>
                  <p className="card-text">24/7 emergency plumbing repairs</p>
                  <p className="text-primary fw-bold">$75/hour</p>
                  <div className="btn-group">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => editService('Emergency Plumbing')}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeService('Emergency Plumbing')}>Remove</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Pipe Installation</h5>
                  <p className="card-text">Professional pipe installation and repair</p>
                  <p className="text-primary fw-bold">$50/hour</p>
                  <div className="btn-group">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => editService('Pipe Installation')}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeService('Pipe Installation')}>Remove</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Section */}
      {activeSection === 'statistics' && (
        <div className="container-fluid py-4">
          <h2 className="mb-4">Customer Statistics</h2>
          <div className="row g-3">
            <div className="col-lg-3 col-md-6">
              <div className="card bg-white border-primary shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-people fs-1 text-primary mb-3"></i>
                  <h3 className="text-dark">45</h3>
                  <p className="text-muted mb-0">Total Customers</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card bg-white border-success shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-graph-up fs-1 text-success mb-3"></i>
                  <h3 className="text-dark">12</h3>
                  <p className="text-muted mb-0">This Month</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card bg-white border-warning shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-star fs-1 text-warning mb-3"></i>
                  <h3 className="text-dark">4.9</h3>
                  <p className="text-muted mb-0">Average Rating</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card bg-white border-info shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-bookmark-check fs-1 text-info mb-3"></i>
                  <h3 className="text-dark">127</h3>
                  <p className="text-muted mb-0">Total Reviews</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Recent Customer Activity</h5>
                </div>
                <div className="card-body">
                  <div className="list-group">
                    <div className="list-group-item">
                      <div className="d-flex justify-content-between">
                        <span>John Smith subscribed to Emergency Plumbing</span>
                        <small className="text-muted">2 hours ago</small>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="d-flex justify-content-between">
                        <span>Sarah Williams left a 5-star review</span>
                        <small className="text-muted">1 day ago</small>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="d-flex justify-content-between">
                        <span>Robert Chen subscribed to Pipe Installation</span>
                        <small className="text-muted">3 days ago</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {activeSection === 'reviews' && (
        <div className="container-fluid py-4">
          <h2 className="mb-4">Customer Reviews</h2>
          <div className="row g-3">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="mb-1">Sarah Williams</h6>
                      <div className="text-warning mb-1">⭐⭐⭐⭐⭐</div>
                      <p className="mb-2">"Excellent work! Mike was professional and fixed our pipe issue quickly."</p>
                      <small className="text-muted">2 days ago</small>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button className="btn btn-outline-primary btn-sm">Reply</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="mb-1">David Wilson</h6>
                      <div className="text-warning mb-1">⭐⭐⭐⭐⭐</div>
                      <p className="mb-2">"Great service and fair pricing. Will definitely call again!"</p>
                      <small className="text-muted">1 week ago</small>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button className="btn btn-outline-primary btn-sm">Reply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Section */}
      {activeSection === 'profile' && (
        <div className="container-fluid py-4">
          <h2 className="mb-4">Provider Profile</h2>
          <div className="card">
            <div className="card-body">
              <form onSubmit={(e) => { e.preventDefault(); alert('Provider profile updated successfully!'); }}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control" defaultValue="Mike" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control" defaultValue="Johnson" required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Business Name</label>
                  <input type="text" className="form-control" defaultValue="Mike's Plumbing Services" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" defaultValue="mike@mikesplumbing.com" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input type="tel" className="form-control" defaultValue="(555) 987-6543" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Business Address</label>
                  <input type="text" className="form-control" defaultValue="456 Main Street" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">License Number</label>
                  <input type="text" className="form-control" defaultValue="PL-2024-5678" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Years of Experience</label>
                  <input type="number" className="form-control" defaultValue="15" required />
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