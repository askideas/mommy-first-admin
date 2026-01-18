import { useState, useEffect } from 'react';
import { X, Image } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './Reviews.css';

const Reviews = () => {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  // ImageKit Browser Modal State
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  
  const [reviewData, setReviewData] = useState({
    heading: '',
    label: '',
    descriptionOne: '',
    descriptionTwo: '',
    buttonLabel: '',
    images: []
  });
  const [savedReviewData, setSavedReviewData] = useState(null);

  // Load data from Firebase on component mount
  useEffect(() => {
    if (db) {
      loadDataFromFirebase();
    }
  }, []);

  const loadDataFromFirebase = async () => {
    if (!db) {
      console.error('Firebase not initialized');
      return;
    }
    
    try {
      setLoading(true);
      const docRef = doc(db, 'homepage', 'reviews');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.reviewData) {
          setReviewData(data.reviewData);
          setSavedReviewData(data.reviewData);
        }
      }
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setReviewData(prev => ({ ...prev, [field]: value }));
  };

  // ImageKit Browser Handlers
  const openImageKitBrowser = () => {
    setIsImageKitOpen(true);
  };

  const handleImageKitSelect = (imageUrl) => {
    console.log('Reviews - Image selected:', imageUrl);
    setReviewData(prev => ({
      ...prev,
      images: [...prev.images, { id: Date.now() + Math.random(), url: imageUrl }]
    }));
  };

  const removeImage = (id) => {
    setReviewData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'reviews', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'reviews');
      
      await setDoc(docRef, {
        reviewData: reviewData
      });
      
      setSavedReviewData({ ...reviewData });
      setSaveStatus({ section: 'reviews', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
      console.log('Reviews Data Saved to Firebase:', reviewData);
    } catch (error) {
      console.error('Error saving reviews data:', error);
      setSaveStatus({ section: 'reviews', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
    } finally {
      setLoading(false);
    }
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
            
            <button className="upload-button" onClick={openImageKitBrowser}>
              <Image size={18} />
              <span>Browse ImageKit</span>
            </button>

            {reviewData.images.length > 0 && (
              <div className="images-grid">
                {reviewData.images.map((image) => (
                  <div key={image.id} className="image-item">
                    <img src={image.url} alt="Review" />
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
            {saveStatus.section === 'reviews' && saveStatus.status === 'success' && (
              <span className="save-status success">Saved successfully!</span>
            )}
            {saveStatus.section === 'reviews' && saveStatus.status === 'error' && (
              <span className="save-status error">Error saving data</span>
            )}
            <button className="btn-cancel" onClick={handleCancel} disabled={loading}>Cancel</button>
            <button className="btn-save" onClick={handleSave} disabled={loading}>
              {loading && saveStatus.section === 'reviews' ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* ImageKit Browser Modal */}
      <ImageKitBrowser
        isOpen={isImageKitOpen}
        onClose={() => setIsImageKitOpen(false)}
        onSelect={handleImageKitSelect}
      />
    </div>
  );
};

export default Reviews;
