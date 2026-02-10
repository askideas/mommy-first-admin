import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Image } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './FreeGuide.css';

const FreeGuide = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  // ImageKit Browser Modal State
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  
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
  
  const [guideData, setGuideData] = useState({
    headingOne: '',
    headingTwo: '',
    description: '',
    buttonLabel: '',
    flashLabelText: '',
    url: '',
    backgroundImage: ''
  });
  const [savedGuideData, setSavedGuideData] = useState(null);

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
      const docRef = doc(db, 'homepage', 'freeguide');
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
        
        if (data.guideData) {
          setGuideData(data.guideData);
          setSavedGuideData(data.guideData);
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
      const docRef = doc(db, 'homepage', 'freeguide');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        isEnabled: newState
      });
      
      setSavedIsEnabled(newState);
      console.log('Free Guide enabled state:', newState);
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
      
      const docRef = doc(db, 'homepage', 'freeguide');
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
    setGuideData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'guide', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'freeguide');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        guideData: guideData
      });
      
      setSavedGuideData({ ...guideData });
      setSaveStatus({ section: 'guide', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
      console.log('Free Guide Data Saved to Firebase:', guideData);
    } catch (error) {
      console.error('Error saving free guide data:', error);
      setSaveStatus({ section: 'guide', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (savedGuideData) {
      setGuideData({ ...savedGuideData });
    } else {
      setGuideData({
        headingOne: '',
        headingTwo: '',
        description: '',
        buttonLabel: '',
        flashLabelText: '',
        url: '',
        backgroundImage: ''
      });
    }
  };

  // ImageKit Browser Handlers
  const openImageKitBrowser = () => {
    setIsImageKitOpen(true);
  };

  const handleImageKitSelect = (imageUrl) => {
    console.log('FreeGuide - Background Image selected:', imageUrl);
    setGuideData(prev => ({ ...prev, backgroundImage: imageUrl }));
  };

  const removeBackgroundImage = () => {
    setGuideData(prev => ({ ...prev, backgroundImage: '' }));
  };

  return (
    <div className="free-guide-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Free Guide Configuration</h2>
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

      {/* Guide Content Section */}
      <div className="config-section">
        <button 
          className="section-header"
          onClick={() => toggleSection('guide')}
        >
          <span className="section-header-title">Guide Content</span>
          {expandedSection === 'guide' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSection === 'guide' && (
          <div className="section-content-area">
          <div className="form-group">
            <label className="form-label">Heading One</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter first heading"
              value={guideData.headingOne}
              onChange={(e) => handleInputChange('headingOne', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Heading Two</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter second heading"
              value={guideData.headingTwo}
              onChange={(e) => handleInputChange('headingTwo', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Enter description"
              rows="4"
              value={guideData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Button Label</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter button label"
              value={guideData.buttonLabel}
              onChange={(e) => handleInputChange('buttonLabel', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Flash Label Text</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter flash label text"
              value={guideData.flashLabelText}
              onChange={(e) => handleInputChange('flashLabelText', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Background Image</label>
            <div className="image-upload-area">
              {guideData.backgroundImage ? (
                <div className="image-selected-container">
                  <div className="image-preview">
                    <img src={guideData.backgroundImage} alt="Background preview" />
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
                      onClick={removeBackgroundImage}
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
                  <span>Choose Background Image</span>
                </button>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Redirection URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="Enter URL (e.g., https://example.com or /guide)"
              value={guideData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
            />
          </div>

          <div className="section-actions">
            {saveStatus.section === 'guide' && saveStatus.status === 'success' && (
              <span className="save-status success">Saved successfully!</span>
            )}
            {saveStatus.section === 'guide' && saveStatus.status === 'error' && (
              <span className="save-status error">Error saving data</span>
            )}
            <button className="btn-cancel" onClick={handleCancel} disabled={loading}>Cancel</button>
            <button className="btn-save" onClick={handleSave} disabled={loading}>
              {loading && saveStatus.section === 'guide' ? 'Saving...' : 'Save'}
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

export default FreeGuide;
