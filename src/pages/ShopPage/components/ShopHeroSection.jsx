import { useState, useEffect } from 'react';
import { X, Image } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './ShopHeroSection.css';

const ShopHeroSection = () => {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  
  const [heroData, setHeroData] = useState({
    image: null,
    heading: ''
  });
  const [savedHeroData, setSavedHeroData] = useState(null);

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
      const docRef = doc(db, 'shoppage', 'herosection');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.heroData) {
          setHeroData(data.heroData);
          setSavedHeroData(data.heroData);
        }
      }
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHeadingChange = (value) => {
    setHeroData(prev => ({ ...prev, heading: value }));
  };

  const openImageKitBrowser = () => {
    setIsImageKitOpen(true);
  };

  const handleImageKitSelect = (imageUrl) => {
    setHeroData(prev => ({ ...prev, image: imageUrl }));
  };

  const removeImage = () => {
    setHeroData(prev => ({ ...prev, image: null }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveStatus('saving');
      
      const docRef = doc(db, 'shoppage', 'herosection');
      
      await setDoc(docRef, {
        heroData: heroData
      });
      
      setSavedHeroData({ ...heroData });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
      console.log('Shop Hero Data Saved to Firebase:', heroData);
    } catch (error) {
      console.error('Error saving shop hero data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (savedHeroData) {
      setHeroData({ ...savedHeroData });
    } else {
      setHeroData({ image: null, heading: '' });
    }
  };

  return (
    <div className="shop-hero-container">
      <h2 className="section-main-title">Hero Section Configuration</h2>

      <div className="config-section">
        <div className="section-content-area">
          <div className="form-group">
            <label className="form-label">Image</label>
            <div className="image-upload-area">
              {heroData.image ? (
                <div className="image-selected-container">
                  <div className="image-preview">
                    <img src={heroData.image} alt="Shop Hero" />
                  </div>
                  <div className="image-actions">
                    <button 
                      type="button"
                      className="btn-change"
                      onClick={openImageKitBrowser}
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
                  onClick={openImageKitBrowser}
                >
                  <Image size={24} />
                  <span>Choose Image</span>
                </button>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Heading</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter heading"
              value={heroData.heading}
              onChange={(e) => handleHeadingChange(e.target.value)}
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

export default ShopHeroSection;
