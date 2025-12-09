import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { providerService } from '../services/providerApi';

const ProviderSignup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    primaryService: '',
    email: '',
    phone: '',
    businessAddress: '',
    licenseNumber: '',
    yearsExperience: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    confirmLicense: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.businessName || 
        !formData.primaryService || !formData.email || !formData.phone || 
        !formData.businessAddress || !formData.licenseNumber || 
        !formData.yearsExperience || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreeTerms || !formData.confirmLicense) {
      setError('Please agree to the terms and confirm your license status');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const providerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        businessName: formData.businessName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.businessAddress,
        licenseNumber: formData.licenseNumber,
        primaryService: formData.primaryService,
        yearsExperience: parseInt(formData.yearsExperience),
        userType: 'provider'
      };

      const result = await providerService.register(providerData);
      localStorage.setItem('providerId', result.id?.toString() || '');
      localStorage.setItem('provider', JSON.stringify(result));
      navigate('/provider-dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-light">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-primary" href="#">
            <i className="bi bi-tools me-2"></i>HOMECONNECT PRO
          </a>
          <div className="d-flex gap-2">
            <button 
              onClick={() => navigate('/customer-signup')} 
              className="btn btn-primary btn-sm"
            >
              CUSTOMER SIGN UP
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="btn btn-outline-warning btn-sm"
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
                    className="rounded-circle bg-warning d-inline-flex align-items-center justify-content-center" 
                    style={{ width: '80px', height: '80px' }}
                  >
                    <i className="bi bi-tools fs-1 text-dark"></i>
                  </div>
                  <h2 className="mt-3 text-dark">Create Provider Profile</h2>
                </div>

                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
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
                        type="text" 
                        className="form-control" 
                        placeholder="BUSINESS NAME" 
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        required 
                      />
                      <span className="input-group-text">
                        <i className="bi bi-building"></i>
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="input-group">
                      <select 
                        className="form-select" 
                        name="primaryService"
                        value={formData.primaryService}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">SELECT PRIMARY SERVICE</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="electrical">Electrical</option>
                        <option value="carpentry">Carpentry</option>
                        <option value="painting">Painting</option>
                        <option value="hvac">HVAC</option>
                        <option value="landscaping">Landscaping</option>
                        <option value="other">Other</option>
                      </select>
                      <span className="input-group-text">
                        <i className="bi bi-tools"></i>
                      </span>
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
                        placeholder="BUSINESS ADDRESS" 
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleInputChange}
                        required 
                      />
                      <span className="input-group-text">
                        <i className="bi bi-geo-alt"></i>
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="LICENSE NUMBER" 
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        required 
                      />
                      <span className="input-group-text">
                        <i className="bi bi-award"></i>
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="input-group">
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="YEARS OF EXPERIENCE" 
                        name="yearsExperience"
                        value={formData.yearsExperience}
                        onChange={handleInputChange}
                        required 
                      />
                      <span className="input-group-text">
                        <i className="bi bi-calendar-check"></i>
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

                  <div className="mb-3">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="confirmLicense" 
                        name="confirmLicense"
                        checked={formData.confirmLicense}
                        onChange={handleInputChange}
                        required 
                      />
                      <label className="form-check-label small" htmlFor="confirmLicense">
                        I confirm that I am properly licensed and insured
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-warning btn-lg w-100 mb-3 text-dark fw-bold" disabled={isLoading}>
                    {isLoading ? 'CREATING PROFILE...' : 'CREATE PROVIDER PROFILE'}
                  </button>
                </form>

                <p className="text-center text-muted">
                  Already have an account? 
                  <button 
                    onClick={() => navigate('/')} 
                    className="btn btn-link text-warning text-decoration-none fw-bold p-0 ms-1"
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

export default ProviderSignup;