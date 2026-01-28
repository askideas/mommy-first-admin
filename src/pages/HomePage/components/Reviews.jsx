import { useState, useEffect } from 'react';
import { X, Image, ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './Reviews.css';

const Reviews = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  // Heading Section State
  const [headingData, setHeadingData] = useState({
    heading: '',
    subheading: '',
    description: ''
  });
  const [savedHeadingData, setSavedHeadingData] = useState(null);
  
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
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.heading) {
          setHeadingData(data.heading);
          setSavedHeadingData(data.heading);
        }
        
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

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleEnableToggle = async (newState) => {
    setIsEnabled(newState);
    try {
      const docRef = doc(db, 'homepage', 'reviews');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        isEnabled: newState
      });
      
      setSavedIsEnabled(newState);
      console.log('Reviews enabled state:', newState);
    } catch (error) {
      console.error('Error saving enabled state:', error);
      setIsEnabled(!newState);
    }
  };

  const handleHeadingChange = (field, value) => {
    setHeadingData(prev => ({ ...prev, [field]: value }));
  };

  const handleHeadingSave = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'heading', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'reviews');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        heading: headingData
      });
      
      setSavedHeadingData({ ...headingData });
      setSaveStatus({ section: 'heading', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
      console.log('Heading Data Saved to Firebase:', headingData);
    } catch (error) {
      console.error('Error saving heading data:', error);
      setSaveStatus({ section: 'heading', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleHeadingCancel = () => {
    if (savedHeadingData) {
      setHeadingData({ ...savedHeadingData });
    } else {
      setHeadingData({ heading: '', subheading: '', description: '' });
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
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
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
      <div className="section-header-row">
        <h2 className="section-main-title">Reviews Configuration</h2>
        <div className="enable-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => handleEnableToggle(e.target.checked)}
              className="toggle-checkbox"
            />
            <span className="toggle-text">{isEnabled ? 'Enabled' : 'Disabled'}</span>
          </label>
        </div>
      </div>

      {/* Heading Section */}
      <div className="config-section">
        <button 
          className="section-header"
          onClick={() => toggleSection('heading')}
        >
          <span className="section-header-title">Heading Section</span>
          {expandedSection === 'heading' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSection === 'heading' && (
          <div className="section-content-area">
            <div className="form-group">
              <label className="form-label">Heading</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter heading"
                value={headingData.heading}
                onChange={(e) => handleHeadingChange('heading', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subheading</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter subheading"
                value={headingData.subheading}
                onChange={(e) => handleHeadingChange('subheading', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Enter description"
                rows="4"
                value={headingData.description}
                onChange={(e) => handleHeadingChange('description', e.target.value)}
              />
            </div>

            <div className="section-actions">
              <button className="btn-cancel" onClick={handleHeadingCancel}>Cancel</button>
              <button className="btn-save" onClick={handleHeadingSave} disabled={loading}>
                {loading && saveStatus.section === 'heading' ? 'Saving...' : 'Save'}
              </button>
              {saveStatus.section === 'heading' && saveStatus.status === 'success' && (
                <span className="save-success">✓ Saved successfully!</span>
              )}
              {saveStatus.section === 'heading' && saveStatus.status === 'error' && (
                <span className="save-error">✗ Error saving</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Review Content Section */}
      <div className="config-section">
        <button 
          className="section-header"
          onClick={() => toggleSection('content')}
        >
          <span className="section-header-title">Review Content</span>
          {expandedSection === 'content' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSection === 'content' && (
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
        )}
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
