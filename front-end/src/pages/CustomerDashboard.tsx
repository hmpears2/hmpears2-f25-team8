import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [subscriptions, setSubscriptions] = useState<string[]>([]);

  const showSection = (section: string) => {
    setActiveSection(section);
  };

  const subscribeService = (serviceName: string) => {
    if (!subscriptions.includes(serviceName)) {
      setSubscriptions(prev => [...prev, serviceName]);
      alert(`Successfully subscribed to ${serviceName}!`);
    } else {
      alert(`You are already subscribed to ${serviceName}.`);
    }
  };

  const showReviews = () => {
    if (subscriptions.length === 0) {
      alert('You need to subscribe to services before writing reviews.');
      return;
    }
    
    const reviewService = prompt('Which service would you like to review?\n' + subscriptions.join('\n'));
    if (reviewService && subscriptions.includes(reviewService)) {
      const rating = prompt('Rate the service (1-5 stars):');
      const comment = prompt('Write your review:');
      if (rating && comment) {
        alert(`Review submitted for ${reviewService}!\nRating: ${rating} stars\nComment: ${comment}`);
      }
    }
  };

  const updateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  return (
    <div className="bg-light">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-primary" href="#">
            <i className="bi bi-house-fill me-2"></i>HOMECONNECT PRO
          </a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'dashboard' ? 'active bg-primary text-white' : 'text-dark'} rounded px-3 btn btn-link`}
                  onClick={() => showSection('dashboard')}
                >
                  DASHBOARD
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'services' ? 'active bg-primary text-white' : 'text-dark'} btn btn-link`}
                  onClick={() => showSection('services')}
                >
                  VIEW SERVICES
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeSection === 'subscriptions' ? 'active bg-primary text-white' : 'text-dark'} btn btn-link`}
                  onClick={() => showSection('subscriptions')}
                >
                  MY SUBSCRIPTIONS
                </button>
              </li>
            </ul>
            <div className="dropdown">
              <button className="btn btn-outline-primary dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                <i className="bi bi-person-circle fs-5 me-2"></i>John Smith
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
          <div className="alert alert-primary bg-gradient border-0 mb-4">
            <h1 className="alert-heading h2 mb-2">Welcome back, John!</h1>
            <p className="mb-0">Manage your profile, view services, and write reviews</p>
          </div>

          {/* Quick Actions */}
          <div className="mb-5">
            <h2 className="mb-3 text-dark">Quick Actions</h2>
            <div className="row g-3">
              <div className="col-md-6 col-lg-3">
                <div className="card text-decoration-none h-100 border-primary bg-white shadow-sm" onClick={() => showSection('services')} style={{cursor: 'pointer'}}>
                  <div className="card-body text-center">
                    <i className="bi bi-search fs-1 text-primary mb-3"></i>
                    <h5 className="card-title text-dark">View Available Services</h5>
                    <p className="card-text text-muted small">Browse and subscribe to services</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card text-decoration-none h-100 border-success bg-white shadow-sm" onClick={() => showSection('subscriptions')} style={{cursor: 'pointer'}}>
                  <div className="card-body text-center">
                    <i className="bi bi-bookmark-check fs-1 text-success mb-3"></i>
                    <h5 className="card-title text-dark">My Subscriptions</h5>
                    <p className="card-text text-muted small">Manage subscribed services</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card text-decoration-none h-100 border-warning bg-white shadow-sm" onClick={() => showSection('profile')} style={{cursor: 'pointer'}}>
                  <div className="card-body text-center">
                    <i className="bi bi-person-gear fs-1 text-warning mb-3"></i>
                    <h5 className="card-title text-dark">Modify Profile</h5>
                    <p className="card-text text-muted small">Update your customer profile</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card text-decoration-none h-100 border-info bg-white shadow-sm" onClick={showReviews} style={{cursor: 'pointer'}}>
                  <div className="card-body text-center">
                    <i className="bi bi-star fs-1 text-info mb-3"></i>
                    <h5 className="card-title text-dark">Write Reviews</h5>
                    <p className="card-text text-muted small">Review subscribed services</p>
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
          <h2 className="mb-4">Available Services</h2>
          <div className="row g-3">
            <div className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Plumbing Services</h5>
                  <p className="card-text">Professional plumbing repairs and installations</p>
                  <p className="text-primary fw-bold">$50/hour</p>
                  <button className="btn btn-primary" onClick={() => subscribeService('Plumbing Services')}>Subscribe</button>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Electrical Services</h5>
                  <p className="card-text">Licensed electrical work and troubleshooting</p>
                  <p className="text-primary fw-bold">$75/hour</p>
                  <button className="btn btn-primary" onClick={() => subscribeService('Electrical Services')}>Subscribe</button>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Painting Services</h5>
                  <p className="card-text">Interior and exterior painting solutions</p>
                  <p className="text-primary fw-bold">$40/hour</p>
                  <button className="btn btn-primary" onClick={() => subscribeService('Painting Services')}>Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscriptions Section */}
      {activeSection === 'subscriptions' && (
        <div className="container-fluid py-4">
          <h2 className="mb-4">My Subscriptions</h2>
          <div>
            {subscriptions.length === 0 ? (
              <p className="text-muted">
                No subscriptions yet. 
                <button 
                  className="btn btn-link p-0 text-decoration-none" 
                  onClick={() => showSection('services')}
                >
                  Browse available services
                </button>
              </p>
            ) : (
              <div className="row g-3">
                {subscriptions.map((service, index) => (
                  <div key={index} className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{service}</h5>
                        <p className="card-text">Subscribed service</p>
                        <button className="btn btn-success btn-sm" onClick={showReviews}>Write Review</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Section */}
      {activeSection === 'profile' && (
        <div className="container-fluid py-4">
          <h2 className="mb-4">Customer Profile</h2>
          <div className="card">
            <div className="card-body">
              <form onSubmit={updateProfile}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control" defaultValue="John" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control" defaultValue="Smith" required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" defaultValue="john.smith@email.com" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input type="tel" className="form-control" defaultValue="(555) 123-4567" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" defaultValue="123 Oak Street" required />
                </div>
                <button type="submit" className="btn btn-primary">Update Profile</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;