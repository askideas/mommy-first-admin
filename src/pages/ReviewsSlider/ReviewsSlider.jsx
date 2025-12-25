import { useState } from 'react';
import { Plus, Upload, Save, Edit, Trash2, X, Star } from 'lucide-react';
import './ReviewsSlider.css';

const ReviewsSlider = () => {
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    text: '',
    rating: 5,
    reviewerName: '',
    photo: '',
    status: 'active'
  });

  const handleAddReviewClick = () => {
    setShowReviewForm(true);
    setEditingReview(null);
    setReviewForm({ text: '', rating: 5, reviewerName: '', photo: '', status: 'active' });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewForm({ ...reviewForm, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveReview = () => {
    if (!reviewForm.text || !reviewForm.reviewerName || !reviewForm.photo) {
      alert('Please fill in all fields');
      return;
    }

    if (editingReview !== null) {
      const updatedReviews = [...reviews];
      updatedReviews[editingReview] = { ...reviewForm };
      setReviews(updatedReviews);
    } else {
      setReviews([...reviews, { ...reviewForm }]);
    }

    setShowReviewForm(false);
    setReviewForm({ text: '', rating: 5, reviewerName: '', photo: '', status: 'active' });
    setEditingReview(null);
  };

  const handleEditReview = (index) => {
    setEditingReview(index);
    setReviewForm({ ...reviews[index] });
    setShowReviewForm(true);
  };

  const handleDeleteReview = (index) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter((_, i) => i !== index));
    }
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
    setReviewForm({ text: '', rating: 5, reviewerName: '', photo: '', status: 'active' });
    setEditingReview(null);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < rating ? '#FD8CBB' : 'none'}
        stroke={i < rating ? '#FD8CBB' : '#e0e0e0'}
      />
    ));
  };

  return (
    <div className="reviews-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reviews In Slider</h1>
          <p className="page-subtitle">Manage customer reviews for slider</p>
        </div>
      </div>

      <div className="reviews-container">
        <div className="section-header">
          <h2 className="section-title">Reviews</h2>
          {!showReviewForm && (
            <button className="btn-add-item" onClick={handleAddReviewClick}>
              <Plus size={16} />
              <span>Add Review</span>
            </button>
          )}
        </div>

        {showReviewForm && (
          <div className="review-form">
            <div className="form-header">
              <h3>{editingReview !== null ? 'Edit Review' : 'Add New Review'}</h3>
              <button className="close-button" onClick={handleCancelReview}>
                <X size={18} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Review Text</label>
              <textarea
                className="text-input"
                rows="4"
                value={reviewForm.text}
                onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                placeholder="Enter review text..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Rating (out of 5)</label>
                <select
                  className="select-input"
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Reviewer Name</label>
                <input
                  type="text"
                  className="text-input"
                  value={reviewForm.reviewerName}
                  onChange={(e) => setReviewForm({ ...reviewForm, reviewerName: e.target.value })}
                  placeholder="Enter reviewer name..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Reviewer Photo</label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="file-input"
                    id="reviewer-photo"
                  />
                  <label htmlFor="reviewer-photo" className="upload-button">
                    <Upload size={16} />
                    <span>Choose Photo</span>
                  </label>
                  {reviewForm.photo && (
                    <div className="photo-preview">
                      <img src={reviewForm.photo} alt="Reviewer" />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="select-input"
                  value={reviewForm.status}
                  onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button className="cancel-button" onClick={handleCancelReview}>
                Cancel
              </button>
              <button className="save-button" onClick={handleSaveReview}>
                <Save size={16} />
                <span>Save Review</span>
              </button>
            </div>
          </div>
        )}

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <div className="empty-state">
              <p>No reviews added yet. Click "Add Review" to create one.</p>
            </div>
          ) : (
            <div className="reviews-grid">
              {reviews.map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-photo">
                        <img src={review.photo} alt={review.reviewerName} />
                      </div>
                      <div className="reviewer-details">
                        <h4 className="reviewer-name">{review.reviewerName}</h4>
                        <div className="review-rating">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <div className="header-actions">
                      <span className={`status-badge ${review.status}`}>
                        {review.status}
                      </span>
                      <button
                        className="btn-icon-sm"
                        onClick={() => handleEditReview(index)}
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn-icon-sm btn-danger"
                        onClick={() => handleDeleteReview(index)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="review-text">
                    <p>{review.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsSlider;
