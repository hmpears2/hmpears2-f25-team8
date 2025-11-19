import React, { useState } from 'react';
import customerApi from '../services/customerApi';
import type { Customer, UpdateCustomerRequest } from '../types/types';

interface CustomerProfileProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ customer, onUpdate }) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<UpdateCustomerRequest>({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phoneNumber: customer.phoneNumber,
    address: customer.address,
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (formData.password && formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Remove password if it's empty (not changing)
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }

      const updatedCustomer = await customerApi.updateProfile(customer.id, updateData);
      
      onUpdate(updatedCustomer);
      setSuccessMessage('Profile updated successfully!');
      setEditMode(false);
      setFormData({ ...formData, password: '' });
      setConfirmPassword('');
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
      password: ''
    });
    setConfirmPassword('');
    setError(null);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== customer.email) {
      setError('Please enter your email correctly to confirm deletion');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await customerApi.deleteAccount(customer.id);
      
      // This would normally redirect to login or home page
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      setSaving(false);
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-person-gear me-2"></i>
          Profile Settings
        </h2>
        {!editMode && (
          <button 
            className="btn btn-primary"
            onClick={() => setEditMode(true)}
          >
            <i className="bi bi-pencil me-2"></i>
            Edit Profile
          </button>
        )}
      </div>

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

      <div className="row">
        <div className="col-lg-8">
          {/* Profile Information Card */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Personal Information</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      required
                    />
                    <small className="text-muted">
                      {editMode ? 'Change your email address if needed' : 'Your email address'}
                    </small>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="(123) 456-7890"
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </div>

                  {editMode && (
                    <>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">New Password (optional)</label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={formData.password || ''}
                          onChange={handleInputChange}
                          placeholder="Leave blank to keep current"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          disabled={!formData.password}
                        />
                      </div>
                    </>
                  )}
                </div>

                {editMode && (
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-1"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Account Information Card */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Account Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="text-muted small d-block">Customer ID</label>
                  <p className="mb-0">#{customer.id}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small d-block">Account Status</label>
                  <p className="mb-0">
                    <span className="badge bg-success">Active</span>
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small d-block">Member Since</label>
                  <p className="mb-0">{formatDate(customer.createdAt)}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="text-muted small d-block">Last Updated</label>
                  <p className="mb-0">{formatDate(customer.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Security Settings Card */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                <i className="bi bi-shield-lock me-2"></i>
                Security
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted small">
                Keep your account secure by using a strong password and updating it regularly.
              </p>
              <div className="d-grid">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => setEditMode(true)}
                >
                  <i className="bi bi-key me-2"></i>
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone Card */}
          <div className="card border-danger shadow-sm">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Danger Zone
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted small">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <div className="d-grid">
                <button 
                  className="btn btn-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <i className="bi bi-trash me-2"></i>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Delete Account
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation('');
                  }}
                  disabled={saving}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-danger">
                  <strong>Warning!</strong> This action cannot be undone. All your data will be permanently deleted.
                </div>
                
                <p>Please type your email address <strong>{customer.email}</strong> to confirm:</p>
                
                <input
                  type="text"
                  className="form-control"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Enter your email to confirm"
                  disabled={saving}
                />
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation('');
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                  disabled={saving || deleteConfirmation !== customer.email}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash me-1"></i>
                      Delete Account
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;