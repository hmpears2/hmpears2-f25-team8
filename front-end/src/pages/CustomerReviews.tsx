import React, { useState, useEffect } from 'react';
import customerApi from '../services/customerApi';
import type{ Review, Subscription, CreateReviewRequest } from '../types/types';

interface CustomerReviewsProps {
  customerId: number;
  onUpdate: () => void;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ customerId, onUpdate }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState<CreateReviewRequest>({ rating: 5, comment: '' });
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [createForm, setCreateForm] = useState<CreateReviewRequest>({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, [customerId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [reviewsData, subscriptionsData] = await Promise.all([
        customerApi.getMyReviews(customerId),
        customerApi.getMySubscriptions(customerId)
      ]);

      setReviews(reviewsData);
      setSubscriptions(subscriptionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const getUnreviewedServices = (): Subscription[] => {
    const reviewedServiceIds = new Set(reviews.map(r => r.service.id));
    return subscriptions.filter(sub => !reviewedServiceIds.has(sub.service.id));
  };

  const handleCreateReview = async () => {
    if (!selectedServiceId || !createForm.comment.trim()) {
      setError('Please select a service and provide a comment');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await customerApi.createReview(customerId, selectedServiceId, createForm);
      
      setSuccessMessage('Review created successfully!');
      setShowCreateModal(false);
      setSelectedServiceId(null);
      setCreateForm({ rating: 5, comment: '' });
      loadData();
      onUpdate();
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = async () => {
    if (!editingReview || !editForm.comment.trim()) {
      setError('Please provide a comment for your review');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await customerApi.updateReview(editingReview.id, editForm);
      
      setSuccessMessage('Review updated successfully!');
      setEditingReview(null);
      setEditForm({ rating: 5, comment: '' });
      loadData();
      onUpdate();
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    const confirm = window.confirm('Are you sure you want to delete this review?');
    if (!confirm) return;

    try {
      setDeletingReviewId(reviewId);
      setError(null);

      await customerApi.deleteReview(reviewId);
      
      setSuccessMessage('Review deleted successfully!');
      loadData();
      onUpdate();
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
    } finally {
      setDeletingReviewId(null);
    }
  };

  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const closeEditModal = () => {
    setEditingReview(null);
    setEditForm({ rating: 5, comment: '' });
  };

  const openCreateModal = () => {
    const unreviewedServices = getUnreviewedServices();
    if (unreviewedServices.length === 0) {
      setError('You have already reviewed all your subscribed services');
      return;
    }
    setShowCreateModal(true);
    setCreateForm({ rating: 5, comment: '' });
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setSelectedServiceId(null);
    setCreateForm({ rating: 5, comment: '' });
  };

  const renderStarRating = (rating: number, isInteractive: boolean = false, onChange?: (rating: number) => void) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (isInteractive && onChange) {
        stars.push(
          <button
            key={i}
            type="button"
            className="btn btn-link p-0 text-decoration-none"
            onClick={() => onChange(i)}
          >
            <i className={`bi bi-star${rating >= i ? '-fill' : ''} fs-5 text-warning`}></i>
          </button>
        );
      } else {
        stars.push(
          <i key={i} className={`bi bi-star${rating >= i ? '-fill' : ''} text-warning`}></i>
        );
      }
    }
    return stars;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading reviews...</span>
        </div>
      </div>
    );
  }

  const unreviewedServices = getUnreviewedServices();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-star me-2"></i>
          My Reviews
        </h2>
        {unreviewedServices.length > 0 && (
          <button className="btn btn-primary" onClick={openCreateModal}>
            <i className="bi bi-plus-circle me-2"></i>
            Write New Review
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

      {/* Statistics */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h3 className="text-primary">{reviews.length}</h3>
              <p className="text-muted mb-0">Total Reviews</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h3 className="text-warning">
                {reviews.length > 0 
                  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                  : '0'}
              </h3>
              <p className="text-muted mb-0">Average Rating</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h3 className="text-success">{subscriptions.length}</h3>
              <p className="text-muted mb-0">Services Subscribed</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h3 className="text-info">{unreviewedServices.length}</h3>
              <p className="text-muted mb-0">Pending Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="row">
          {reviews.map(review => (
            <div key={review.id} className="col-lg-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title mb-1">{review.service.name}</h5>
                      <p className="text-muted small mb-0">
                        Provider: {review.service.provider?.businessName || review.service.provider?.companyName || 'Unknown Provider'}
                      </p>
                    </div>
                    <div className="text-end">
                      <div>{renderStarRating(review.rating)}</div>
                      <small className="text-muted">{review.rating}/5</small>
                    </div>
                  </div>

                  <p className="card-text">{review.comment}</p>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">
                      <i className="bi bi-calendar me-1"></i>
                      {formatDate(review.createdAt)}
                    </small>
                    <div>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openEditModal(review)}
                        disabled={deletingReviewId === review.id}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={deletingReviewId === review.id}
                      >
                        {deletingReviewId === review.id ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          <i className="bi bi-trash"></i>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          You haven't written any reviews yet. 
          {unreviewedServices.length > 0 && (
            <span>
              {' '}You have {unreviewedServices.length} service(s) waiting for your review.
              <button className="btn btn-link alert-link p-0 ms-1" onClick={openCreateModal}>
                Write your first review now
              </button>
            </span>
          )}
        </div>
      )}

      {/* Create Review Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-star me-2"></i>
                  Write a New Review
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeCreateModal}
                  disabled={submitting}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Select Service</label>
                  <select
                    className="form-select"
                    value={selectedServiceId || ''}
                    onChange={(e) => setSelectedServiceId(parseInt(e.target.value))}
                    disabled={submitting}
                  >
                    <option value="">Choose a service...</option>
                    {unreviewedServices.map(sub => (
                      <option key={sub.service.id} value={sub.service.id}>
                        {sub.service.name} - {sub.service.provider?.businessName || sub.service.provider?.companyName || 'Unknown Provider'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <div className="d-flex gap-2">
                    {renderStarRating(
                      createForm.rating, 
                      true, 
                      (rating) => setCreateForm({ ...createForm, rating })
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Your Review</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Share your experience with this service..."
                    value={createForm.comment}
                    onChange={(e) => setCreateForm({ ...createForm, comment: e.target.value })}
                    disabled={submitting}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={closeCreateModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleCreateReview}
                  disabled={submitting || !selectedServiceId || !createForm.comment.trim()}
                >
                  {submitting ? (
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

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-pencil me-2"></i>
                  Edit Review
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeEditModal}
                  disabled={submitting}
                ></button>
              </div>
              <div className="modal-body">
                <h6 className="mb-3">{editingReview.service.name}</h6>
                
                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <div className="d-flex gap-2">
                    {renderStarRating(
                      editForm.rating, 
                      true, 
                      (rating) => setEditForm({ ...editForm, rating })
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Your Review</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Update your review..."
                    value={editForm.comment}
                    onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                    disabled={submitting}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={closeEditModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleEditReview}
                  disabled={submitting || !editForm.comment.trim()}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-1"></i>
                      Update Review
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

export default CustomerReviews;