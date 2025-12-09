import React, { useState, useEffect } from 'react';
import customerApi from '../services/customerApi';
import type{ Subscription, Review } from '../types/types';

interface CustomerSubscriptionsProps {
  customerId: number;
  onUpdate: () => void;
}

const CustomerSubscriptions: React.FC<CustomerSubscriptionsProps> = ({ customerId, onUpdate }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [unsubscribing, setUnsubscribing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [serviceReviews, setServiceReviews] = useState<Map<number, Review[]>>(new Map());

  useEffect(() => {
    loadSubscriptions();
  }, [customerId]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const subs = await customerApi.getMySubscriptions(customerId);
      setSubscriptions(subs);

      // Load existing reviews for each subscribed service
      const reviewsMap = new Map<number, Review[]>();
      await Promise.all(
        subs.map(async (sub) => {
          try {
            const reviews = await customerApi.getServiceReviews(sub.service.id);
            const userReviews = reviews.filter(r => r.customer.id === customerId);
            reviewsMap.set(sub.service.id, userReviews);
          } catch (err) {
            console.error(`Failed to load reviews for service ${sub.service.id}:`, err);
          }
        })
      );
      setServiceReviews(reviewsMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (subscription: Subscription) => {
    const confirm = window.confirm(
      `Are you sure you want to unsubscribe from "${subscription.service.name}"?`
    );
    
    if (!confirm) return;

    try {
      setUnsubscribing(subscription.id);
      setError(null);
      setSuccessMessage(null);

      await customerApi.unsubscribeFromService(customerId, subscription.service.id);
      
      setSubscriptions(prev => prev.filter(sub => sub.id !== subscription.id));
      setSuccessMessage(`Successfully unsubscribed from ${subscription.service.name}`);
      
      setTimeout(() => setSuccessMessage(null), 3000);
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unsubscribe');
    } finally {
      setUnsubscribing(null);
    }
  };

  const openReviewModal = (service: any) => {
    setSelectedService(service);
    setReviewForm({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedService(null);
    setReviewForm({ rating: 5, comment: '' });
  };

  const handleSubmitReview = async () => {
    if (!selectedService || !reviewForm.comment.trim()) {
      setError('Please provide a comment for your review');
      return;
    }

    try {
      setSubmittingReview(true);
      setError(null);

      await customerApi.createReview(
        customerId, 
        selectedService.id, 
        reviewForm
      );

      setSuccessMessage(`Review submitted for ${selectedService.name}!`);
      closeReviewModal();
      loadSubscriptions(); // Reload to show the new review
      onUpdate();
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateTotalMonthlySpend = (): number => {
    return subscriptions.reduce((total, sub) => total + sub.service.price, 0);
  };

  const hasReviewedService = (serviceId: number): boolean => {
    return (serviceReviews.get(serviceId) || []).length > 0;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading subscriptions...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-bookmark-star me-2"></i>
          My Subscriptions
        </h2>
        <div className="text-end">
          <p className="mb-0 text-muted">Total Monthly Spend</p>
          <h3 className="text-primary">{formatCurrency(calculateTotalMonthlySpend())}</h3>
        </div>
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

      {/* Subscriptions List */}
      {subscriptions.length > 0 ? (
        <div className="row">
          {subscriptions.map(subscription => (
            <div key={subscription.id} className="col-lg-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title mb-1">{subscription.service.name}</h5>
                      <p className="text-muted small mb-0">
                        by {subscription.service.provider?.businessName || 'Unknown Provider'}
                      </p>
                    </div>
                    <span className="badge bg-success">Active</span>
                  </div>

                  <p className="card-text text-muted small">
                    {subscription.service.description || 'No description available'}
                  </p>

                  <div className="row mb-3">
                    <div className="col-6">
                      <small className="text-muted d-block">Service Type</small>
                      <strong>{subscription.service.serviceType || 'General'}</strong>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Monthly Cost</small>
                      <strong className="text-primary">
                        {formatCurrency(subscription.service.price)}
                      </strong>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6">
                      <small className="text-muted d-block">Subscribed On</small>
                      <strong>{formatDate(subscription.subscribedAt)}</strong>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Status</small>
                      {hasReviewedService(subscription.service.id) ? (
                        <span className="text-success">
                          <i className="bi bi-check-circle me-1"></i>
                          Reviewed
                        </span>
                      ) : (
                        <span className="text-warning">
                          <i className="bi bi-clock me-1"></i>
                          Pending Review
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Provider Contact Info */}
                  <div className="p-2 bg-light rounded mb-3">
                    <small className="text-muted d-block mb-1">Provider Contact:</small>
                    <div className="small">
                      <i className="bi bi-person me-1"></i>
                      {subscription.service.provider?.firstName} {subscription.service.provider?.lastName}<br />
                      <i className="bi bi-envelope me-1"></i>
                      {subscription.service.provider?.email}<br />
                      <i className="bi bi-telephone me-1"></i>
                      {subscription.service.provider?.phone || subscription.service.provider?.phoneNumber || 'N/A'}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    {!hasReviewedService(subscription.service.id) && (
                      <button 
                        className="btn btn-outline-primary flex-fill"
                        onClick={() => openReviewModal(subscription.service)}
                      >
                        <i className="bi bi-star me-1"></i>
                        Write Review
                      </button>
                    )}
                    <button
                      className="btn btn-outline-danger flex-fill"
                      onClick={() => handleUnsubscribe(subscription)}
                      disabled={unsubscribing === subscription.id}
                    >
                      {unsubscribing === subscription.id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1"></span>
                          Unsubscribing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-x-circle me-1"></i>
                          Unsubscribe
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          You don't have any active subscriptions yet. 
          <a 
            href="#" 
            className="alert-link ms-1"
            onClick={(e) => {
              e.preventDefault();
              // This would normally navigate to services page
              // In a real app, you'd use React Router or emit an event
            }}
          >
            Browse available services
          </a> to get started.
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedService && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-star me-2"></i>
                  Write a Review
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeReviewModal}
                  disabled={submittingReview}
                ></button>
              </div>
              <div className="modal-body">
                <h6 className="mb-3">{selectedService.name}</h6>
                
                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <div className="d-flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      >
                        <i 
                          className={`bi bi-star${reviewForm.rating >= star ? '-fill' : ''} fs-3 text-warning`}
                        ></i>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Your Review</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Share your experience with this service..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    disabled={submittingReview}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={closeReviewModal}
                  disabled={submittingReview}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleSubmitReview}
                  disabled={submittingReview || !reviewForm.comment.trim()}
                >
                  {submittingReview ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-1"></i>
                      Submit Review
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

export default CustomerSubscriptions;