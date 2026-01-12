import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import './Reviews.css';

const Reviews = () => {
  const [reviewData, setReviewData] = useState({
    heading: '',
    label: '',
    descriptionOne: '',
    descriptionTwo: '',
    buttonLabel: '',
    images: []
  });
  const [savedReviewData, setSavedReviewData] = useState(null);

  const handleInputChange = (field, value) => {
    setReviewData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultipleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewData(prev => ({
          ...prev,
          images: [...prev.images, { id: Date.now() + Math.random(), url: reader.result, name: file.name }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setReviewData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const handleSave = () => {
    setSavedReviewData({ ...reviewData });
    console.log('Reviews Data Saved:', reviewData);
    // Add your API call here
  };

  const handleCancel = () => {
    if (savedReviewData) {
      setReviewData({ ...savedReviewData });
    } else {
      setReviewData({
        heading: '',
        label: '',
        descriptionOne: '',
        descriptionTwo: '',
        buttonLabel: '',
        images: []
      });
    }
  };

  return (
    <div className="reviews-container">
      <h2 className="section-main-title">Reviews Configuration</h2>

      <div className="config-section">
        <div className="section-content-area">
          <div className="form-group">
            <label className="form-label">Heading</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter heading"
              value={reviewData.heading}
              onChange={(e) => handleInputChange('heading', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Label</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter label"
              value={reviewData.label}
              onChange={(e) => handleInputChange('label', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description One</label>
            <textarea
              className="form-textarea"
              placeholder="Enter first description"
              rows="4"
              value={reviewData.descriptionOne}
              onChange={(e) => handleInputChange('descriptionOne', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description Two</label>
            <textarea
              className="form-textarea"
              placeholder="Enter second description"
              rows="4"
              value={reviewData.descriptionTwo}
              onChange={(e) => handleInputChange('descriptionTwo', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Button Label</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter button label"
              value={reviewData.buttonLabel}
              onChange={(e) => handleInputChange('buttonLabel', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Images</label>
            
            <label className="upload-button">
              <Upload size={18} />
              <span>Upload Images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleImageUpload}
                style={{ display: 'none' }}
              />
            </label>

            {reviewData.images.length > 0 && (
              <div className="images-grid">
                {reviewData.images.map((image) => (
                  <div key={image.id} className="image-item">
                    <img src={image.url} alt={image.name} />
                    <button 
                      className="remove-image-btn"
                      onClick={() => removeImage(image.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {reviewData.images.length === 0 && (
              <p className="empty-state">No images uploaded yet</p>
            )}
          </div>

          <div className="section-actions">
            <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
