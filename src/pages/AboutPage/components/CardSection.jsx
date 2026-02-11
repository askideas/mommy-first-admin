import { useState, useEffect } from 'react';
import { Image } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './AboutSection.css';

const CardSection = () => {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [cardData, setCardData] = useState({
    image: null,
    heading: '',
    description: ''
  });
  const [savedCardData, setSavedCardData] = useState(null);

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
      const docRef = doc(db, 'aboutpage', 'cardsection');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        if (data.cardData) {
          setCardData(data.cardData);
          setSavedCardData(data.cardData);
        }
      }
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageKitSelect = (imageUrl) => {
    setCardData(prev => ({ ...prev, image: imageUrl }));
    setIsImageKitOpen(false);
  };

  const removeImage = () => {
    setCardData(prev => ({ ...prev, image: null }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveStatus('saving');
      
      const docRef = doc(db, 'aboutpage', 'cardsection');
      
      await setDoc(docRef, {
        isEnabled: isEnabled,
        cardData: cardData
      });
      
      setSavedIsEnabled(isEnabled);
      setSavedCardData({ ...cardData });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Error saving card section:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEnabled(savedIsEnabled);
    if (savedCardData) {
      setCardData({ ...savedCardData });
    } else {
      setCardData({
        image: null,
        heading: '',
        description: ''
      });
    }
  };

  return (
    <div className="about-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Card Section Configuration</h2>
        <div className="enable-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              className="toggle-checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
            />
            <span className="toggle-text">{isEnabled ? 'Enabled' : 'Disabled'}</span>
          </label>
        </div>
      </div>

      <div className="config-section">
        <div className="section-content-area">
          {/* Image */}
          <div className="form-group">
            <label className="form-label">Image</label>
            <div className="image-upload-area">
              {cardData.image ? (
                <div className="image-selected-container">
                  <div className="image-preview">
                    <img src={cardData.image} alt="Card" />
                  </div>
                  <div className="image-actions">
                    <button 
                      type="button"
                      className="btn-change"
                      onClick={() => setIsImageKitOpen(true)}
                    >
                      Change
                    </button>
                    <button 
                      type="button"
                      className="btn-remove"
                      onClick={removeImage}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  type="button"
                  className="choose-image-btn"
                  onClick={() => setIsImageKitOpen(true)}
                >
                  <Image size={24} />
                  <span>Choose Image</span>
                </button>
              )}
            </div>
          </div>

          {/* Heading */}
          <div className="form-group">
            <label className="form-label">Heading</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter heading"
              value={cardData.heading}
              onChange={(e) => handleInputChange('heading', e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Enter description"
              rows={4}
              value={cardData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <div className="section-actions">
            <button className="btn-cancel" onClick={handleCancel} disabled={loading}>Cancel</button>
            <button className="btn-save" onClick={handleSave} disabled={loading}>
              {loading && saveStatus === 'saving' ? 'Saving...' : 'Save'}
            </button>
            {saveStatus === 'success' && (
              <span className="save-success">✓ Saved successfully!</span>
            )}
            {saveStatus === 'error' && (
              <span className="save-error">✗ Error saving</span>
            )}
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

export default CardSection;
