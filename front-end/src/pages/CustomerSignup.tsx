import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerSignup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.address || !formData.password || 
        !formData.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!formData.agreeTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    alert('Customer profile created successfully! Redirecting to dashboard...');
    setTimeout(() => {
      navigate('/customer-dashboard');
    }, 1500);
  };

  return (
    <div className="bg-light">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-primary" href="#">
            <i className="bi bi-house-fill me-2"></i>HOMECONNECT PRO
          </a>
          <div className="d-flex gap-2">
            <button 
              onClick={() => navigate('/provider-signup')} 
              className="btn btn-warning btn-sm"
            >
              PROVIDER SIGN-UP
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="btn btn-outline-primary btn-sm"
            >
              LOGIN
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid min-vh-100 py-4 bg-light">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                {/* User Icon */}
                <div className="text-center mb-4">
                  <div 
                    className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center" 
                    style={{ width: '80px', height: '80px' }}
                  >
                    <i className="bi bi-house-fill fs-1 text-white"></i>
                  </div>
                  <h2 className="mt-3 text-dark">Create Customer Profile</h2>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="input-group">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="FIRST NAME" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required 
                        />
                        <span className="input-group-text">
                          <i className="bi bi-person"></i>
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="input-group">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="LAST NAME" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required 
                        />
                        <span className="input-group-text">
                          <i className="bi bi-person"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="input-group">
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="EMAIL ADDRESS" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                      />
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="input-group">
                      <input 
                        type="tel" 
                        className="form-control" 
                        placeholder="PHONE NUMBER" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required 
                      />
                      <span className="input-group-text">
                        <i className="bi bi-telephone"></i>
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="ADDRESS" 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required 
                      />
                      <span className="input-group-text">
                        <i className="bi bi-house"></i>
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="input-group">
                      <input 
                        type="password" 
                        className="form-control" 
                        placeholder="PASSWORD" 
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required 
                      />
                      <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="input-group">
                      <input 
                        type="password" 
                        className="form-control" 
                        placeholder="CONFIRM PASSWORD" 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required 
                      />
                      <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="agreeTerms" 
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        required 
                      />
                      <label className="form-check-label small" htmlFor="agreeTerms">
                        I agree to the Terms of Service and Privacy Policy
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">
                    CREATE CUSTOMER PROFILE
                  </button>
                </form>

                <p className="text-center text-muted">
                  Already have an account? 
                  <button 
                    onClick={() => navigate('/')} 
                    className="btn btn-link text-primary text-decoration-none fw-bold p-0 ms-1"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSignup;