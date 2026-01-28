import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Image } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './HeroSection.css';

const HeroSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  const [firebaseReady, setFirebaseReady] = useState(false);
  
  // ImageKit Browser Modal State
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  const [imageKitTarget, setImageKitTarget] = useState(null); // 'leftSideBg', 'rightSide', 'rightSideBg', or 'slider'
  
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
  
  // Left Side Section State
  const [leftSideData, setLeftSideData] = useState({
    labelText: '',
    description: '',
    buttonLabel: '',
    backgroundImage: null
  });
  const [savedLeftSideData, setSavedLeftSideData] = useState(null);
  
  // Right Side Section State
  const [rightSideData, setRightSideData] = useState({
    heading: '',
    image: null,
    buttonLabel: '',
    backgroundImage: null
  });
  const [savedRightSideData, setSavedRightSideData] = useState(null);
  
  // Slider Section State
  const [sliderImages, setSliderImages] = useState([]);
  const [savedSliderImages, setSavedSliderImages] = useState([]);

  // Load data from Firebase on component mount
  useEffect(() => {
    // Check if db is ready
    if (db) {
      setFirebaseReady(true);
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
      const docRef = doc(db, 'homepage', 'herosection');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Load enable/disable state
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        // Load heading data
        if (data.heading) {
          setHeadingData(data.heading);
          setSavedHeadingData(data.heading);
        }
        
        // Load left side data
        if (data.leftside) {
          setLeftSideData(data.leftside);
          setSavedLeftSideData(data.leftside);
        }
        
        // Load right side data
        if (data.rightside) {
          setRightSideData(data.rightside);
          setSavedRightSideData(data.rightside);
        }
        
        // Load slider data
        if (data.slider && data.slider.images) {
          setSliderImages(data.slider.images);
          setSavedSliderImages(data.slider.images);
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

  // Enable/Disable Handlers
  const handleEnableToggle = async (newState) => {
    setIsEnabled(newState);
    try {
      const docRef = doc(db, 'homepage', 'herosection');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        isEnabled: newState
      });
      
      setSavedIsEnabled(newState);
      console.log('Hero Section enabled state:', newState);
    } catch (error) {
      console.error('Error saving enabled state:', error);
      setIsEnabled(!newState); // Revert on error
    }
  };

  // Heading Section Handlers
  const handleHeadingChange = (field, value) => {
    setHeadingData(prev => ({ ...prev, [field]: value }));
  };

  const handleHeadingSave = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'heading', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'herosection');
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

  // Left Side Section Handlers
  const handleLeftSideChange = (field, value) => {
    setLeftSideData(prev => ({ ...prev, [field]: value }));
  };

  const removeLeftSideBackgroundImage = () => {
    setLeftSideData(prev => ({ ...prev, backgroundImage: null }));
  };

  const handleLeftSideSave = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'left', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'herosection');
      const docSnap = await getDoc(docRef);
      
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        leftside: leftSideData
      });
      
      setSavedLeftSideData({ ...leftSideData });
      setSaveStatus({ section: 'left', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
      console.log('Left Side Data Saved to Firebase:', leftSideData);
    } catch (error) {
      console.error('Error saving left side data:', error);
      setSaveStatus({ section: 'left', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleLeftSideCancel = () => {
    if (savedLeftSideData) {
      setLeftSideData({ ...savedLeftSideData });
    } else {
      setLeftSideData({ labelText: '', description: '', buttonLabel: '', backgroundImage: null });
    }
  };

  // Right Side Section Handlers
  const handleRightSideChange = (field, value) => {
    setRightSideData(prev => ({ ...prev, [field]: value }));
  };

  const removeRightSideImage = () => {
    setRightSideData(prev => ({ ...prev, image: null }));
  };

  const removeRightSideBackgroundImage = () => {
    setRightSideData(prev => ({ ...prev, backgroundImage: null }));
  };

  // ImageKit Browser Handlers
  const openImageKitBrowser = (target) => {
    setImageKitTarget(target);
    setIsImageKitOpen(true);
  };

  const handleImageKitSelect = (imageUrl) => {
    console.log('HeroSection - Image selected:', imageUrl, 'Target:', imageKitTarget);
    if (imageKitTarget === 'leftSideBg') {
      setLeftSideData(prev => ({ ...prev, backgroundImage: imageUrl }));
    } else if (imageKitTarget === 'rightSide') {
      setRightSideData(prev => ({ ...prev, image: imageUrl }));
    } else if (imageKitTarget === 'rightSideBg') {
      setRightSideData(prev => ({ ...prev, backgroundImage: imageUrl }));
    } else if (imageKitTarget === 'slider') {
      setSliderImages(prev => [...prev, { id: Date.now() + Math.random(), url: imageUrl }]);
    }
    setImageKitTarget(null);
  };

  const handleRightSideSave = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'right', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'herosection');
      const docSnap = await getDoc(docRef);
      
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        rightside: rightSideData
      });
      
      setSavedRightSideData({ ...rightSideData });
      setSaveStatus({ section: 'right', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
      console.log('Right Side Data Saved to Firebase:', rightSideData);
    } catch (error) {
      console.error('Error saving right side data:', error);
      setSaveStatus({ section: 'right', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleRightSideCancel = () => {
    if (savedRightSideData) {
      setRightSideData({ ...savedRightSideData });
    } else {
      setRightSideData({ heading: '', image: null, buttonLabel: '', backgroundImage: null });
    }
  };

  // Slider Section Handlers
  const removeSliderImage = (id) => {
    setSliderImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSliderSave = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'slider', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'herosection');
      const docSnap = await getDoc(docRef);
      
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        slider: {
          images: sliderImages
        }
      });
      
      setSavedSliderImages([...sliderImages]);
      setSaveStatus({ section: 'slider', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
      console.log('Slider Images Saved to Firebase:', sliderImages);
    } catch (error) {
      console.error('Error saving slider data:', error);
      setSaveStatus({ section: 'slider', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleSliderCancel = () => {
    if (savedSliderImages.length > 0) {
      setSliderImages([...savedSliderImages]);
    } else {
      setSliderImages([]);
    }
  };

  return (
    <div className="hero-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Hero Section Configuration</h2>
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

      {/* Left Side Section */}
      <div className="config-section">
        <button 
          className="section-header"
          onClick={() => toggleSection('left')}
        >
          <span className="section-header-title">Left Side Section</span>
          {expandedSection === 'left' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSection === 'left' && (
          <div className="section-content-area">
            <div className="form-group">
              <label className="form-label">Label Text</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter label text"
                value={leftSideData.labelText}
                onChange={(e) => handleLeftSideChange('labelText', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Enter description"
                rows="4"
                value={leftSideData.description}
                onChange={(e) => handleLeftSideChange('description', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Button Label</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter button label"
                value={leftSideData.buttonLabel}
                onChange={(e) => handleLeftSideChange('buttonLabel', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Background Image</label>
              <div className="image-upload-area">
                {leftSideData.backgroundImage ? (
                  <div className="image-selected-container">
                    <div className="image-preview">
                      <img src={leftSideData.backgroundImage} alt="Left side background preview" />
                    </div>
                    <div className="image-actions">
                      <button 
                        type="button"
                        className="btn-change"
                        onClick={() => openImageKitBrowser('leftSideBg')}
                      >
                        Change
                      </button>
                      <button 
                        type="button"
                        className="btn-remove"
                        onClick={removeLeftSideBackgroundImage}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    type="button"
                    className="choose-image-btn"
                    onClick={() => openImageKitBrowser('leftSideBg')}
                  >
                    <Image size={24} />
                    <span>Choose Background Image</span>
                  </button>
                )}
              </div>
            </div>

            <div className="section-actions">
              <button className="btn-cancel" onClick={handleLeftSideCancel}>Cancel</button>
              <button className="btn-save" onClick={handleLeftSideSave} disabled={loading}>
                {loading && saveStatus.section === 'left' ? 'Saving...' : 'Save'}
              </button>
              {saveStatus.section === 'left' && saveStatus.status === 'success' && (
                <span className="save-success">✓ Saved successfully!</span>
              )}
              {saveStatus.section === 'left' && saveStatus.status === 'error' && (
                <span className="save-error">✗ Error saving</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Side Section */}
      <div className="config-section">
        <button 
          className="section-header"
          onClick={() => toggleSection('right')}
        >
          <span className="section-header-title">Right Side Section</span>
          {expandedSection === 'right' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSection === 'right' && (
          <div className="section-content-area">
            <div className="form-group">
              <label className="form-label">Heading</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter heading"
                value={rightSideData.heading}
                onChange={(e) => handleRightSideChange('heading', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image</label>
              <div className="image-upload-area">
                {rightSideData.image ? (
                  <div className="image-selected-container">
                    <div className="image-preview">
                      <img src={rightSideData.image} alt="Right side preview" />
                    </div>
                    <div className="image-actions">
                      <button 
                        type="button"
                        className="btn-change"
                        onClick={() => openImageKitBrowser('rightSide')}
                      >
                        Change
                      </button>
                      <button 
                        type="button"
                        className="btn-remove"
                        onClick={removeRightSideImage}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    type="button"
                    className="choose-image-btn"
                    onClick={() => openImageKitBrowser('rightSide')}
                  >
                    <Image size={24} />
                    <span>Choose Image</span>
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Button Label</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter button label"
                value={rightSideData.buttonLabel}
                onChange={(e) => handleRightSideChange('buttonLabel', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Background Image</label>
              <div className="image-upload-area">
                {rightSideData.backgroundImage ? (
                  <div className="image-selected-container">
                    <div className="image-preview">
                      <img src={rightSideData.backgroundImage} alt="Right side background preview" />
                    </div>
                    <div className="image-actions">
                      <button 
                        type="button"
                        className="btn-change"
                        onClick={() => openImageKitBrowser('rightSideBg')}
                      >
                        Change
                      </button>
                      <button 
                        type="button"
                        className="btn-remove"
                        onClick={removeRightSideBackgroundImage}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    type="button"
                    className="choose-image-btn"
                    onClick={() => openImageKitBrowser('rightSideBg')}
                  >
                    <Image size={24} />
                    <span>Choose Background Image</span>
                  </button>
                )}
              </div>
            </div>

            <div className="section-actions">
              <button className="btn-cancel" onClick={handleRightSideCancel}>Cancel</button>
              <button className="btn-save" onClick={handleRightSideSave} disabled={loading}>
                {loading && saveStatus.section === 'right' ? 'Saving...' : 'Save'}
              </button>
              {saveStatus.section === 'right' && saveStatus.status === 'success' && (
                <span className="save-success">✓ Saved successfully!</span>
              )}
              {saveStatus.section === 'right' && saveStatus.status === 'error' && (
                <span className="save-error">✗ Error saving</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Slider Section */}
      <div className="config-section">
        <button 
          className="section-header"
          onClick={() => toggleSection('slider')}
        >
          <span className="section-header-title">Slider Section</span>
          {expandedSection === 'slider' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSection === 'slider' && (
          <div className="section-content-area">
            <div className="form-group">
              <label className="form-label">Slider Images</label>
              
              <button 
                type="button"
                className="choose-image-button"
                onClick={() => openImageKitBrowser('slider')}
              >
                <Image size={18} />
                <span>Choose Image</span>
              </button>

              {sliderImages.length > 0 && (
                <div className="slider-images-grid">
                  {sliderImages.map((image) => (
                    <div key={image.id} className="slider-image-item">
                      <img src={image.url} alt="Slider" />
                      <div className="slider-image-actions">
                        <button 
                          type="button"
                          className="btn-change-small"
                          onClick={() => {
                            // Remove this image and open modal to select new one
                            removeSliderImage(image.id);
                            openImageKitBrowser('slider');
                          }}
                        >
                          Change
                        </button>
                        <button 
                          type="button"
                          className="btn-remove-small"
                          onClick={() => removeSliderImage(image.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {sliderImages.length === 0 && (
                <p className="empty-state">No images uploaded yet</p>
              )}
            </div>

            <div className="section-actions">
              <button className="btn-cancel" onClick={handleSliderCancel}>Cancel</button>
              <button className="btn-save" onClick={handleSliderSave} disabled={loading}>
                {loading && saveStatus.section === 'slider' ? 'Saving...' : 'Save'}
              </button>
              {saveStatus.section === 'slider' && saveStatus.status === 'success' && (
                <span className="save-success">✓ Saved successfully!</span>
              )}
              {saveStatus.section === 'slider' && saveStatus.status === 'error' && (
                <span className="save-error">✗ Error saving</span>
              )}
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

export default HeroSection;
