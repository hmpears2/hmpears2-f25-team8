import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { providerService } from '../services/providerApi';

/// <reference types="react" />
/// <reference types="react-router-dom" />

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !userType) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      if (userType === 'customer') {
        navigate('/customer-dashboard');
      } else if (userType === 'provider') {
        const result = await providerService.login({ email, password });
        localStorage.setItem('providerId', result.id?.toString() || '');
        localStorage.setItem('providerData', JSON.stringify(result));
        navigate('/provider-dashboard');
      }
    } catch (err: any) {
      setError(err.response?.status === 404 ? 'Invalid email or password' : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-primary" href="#">
            <i className="bi bi-house-fill me-2"></i>HOMECONNECT PRO
          </a>
          <div className="d-flex gap-2">
            <button 
              onClick={() => navigate('/customer-signup')} 
              className="btn btn-primary btn-sm"
            >
              CUSTOMER SIGN UP
            </button>
            <button 
              onClick={() => navigate('/provider-signup')} 
              className="btn btn-warning btn-sm"
            >
              PROVIDER SIGN-UP
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div 
        className="container-fluid vh-100 bg-gradient" 
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <div className="row h-100">
          {/* Login Form Section */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '400px' }}>
              <div className="card-body p-5">
                {/* User Icon */}
                <div className="text-center mb-4">
                  <div 
                    className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center" 
                    style={{ width: '80px', height: '80px' }}
                  >
                    <i className="bi bi-person-fill fs-1 text-white"></i>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="mb-3">
                    <div className="input-group">
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="EMAIL" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                      />
                      <span className="input-group-text">
                        <i className="bi bi-person"></i>
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="input-group">
                      <input 
                        type="password" 
                        className="form-control" 
                        placeholder="PASSWORD" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                      />
                      <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="input-group">
                      <select 
                        className="form-select" 
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        required
                      >
                        <option value="">SELECT USER TYPE</option>
                        <option value="customer">Customer</option>
                        <option value="provider">Service Provider</option>
                      </select>
                      <span className="input-group-text">
                        <i className="bi bi-house"></i>
                      </span>
                    </div>
                  </div>
                  
                  <button type="submit" className="btn btn-primary w-100 mb-3 btn-lg" disabled={isLoading}>
                    {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <div className="text-center p-5 text-black">
              <h1 className="display-4 fw-bold mb-4">Welcome to HomeConnect Pro</h1>
              <p className="lead mb-4">
                Connect customers with trusted service providers.<br />
                Manage profiles, services, and reviews in one place.
              </p>
              
              <div className="text-center">
                <p className="text-black mb-2">
                  New customer? 
                  <button 
                    onClick={() => navigate('/customer-signup')}
                    className="btn btn-link text-warning text-decoration-none fw-bold p-0 ms-1"
                  >
                    Sign up here
                  </button>
                </p>
                <p className="text-black">
                  Service provider? 
                  <button 
                    onClick={() => navigate('/provider-signup')}
                    className="btn btn-link text-success text-decoration-none fw-bold p-0 ms-1"
                  >
                    Join our network
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

export default LoginPage;