import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Image } from 'lucide-react';
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
  const [imageKitTarget, setImageKitTarget] = useState(null);
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  // Hero Content State
  const [heroData, setHeroData] = useState({
    topText: 'ALL AT MOMS',
    mainHeading: 'The Science of Safety,',
    subHeading: 'The Heart of a Mother.',
    description: 'When you have someone trusted, who truly cares and experts with certifications in Lactation & Newborn Care by Dr. Vandana Chint and Dr. Ritika Rai here\'s what you get....',
    backgroundImage: null
  });
  const [savedHeroData, setSavedHeroData] = useState(null);

  // Content Section State
  const [contentSection, setContentSection] = useState({
    enabled: true,
    content: ''
  });
  const [savedContentSection, setSavedContentSection] = useState({ enabled: true, content: '' });

  // Load data from Firebase on component mount
  useEffect(() => {
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
      const docRef = doc(db, 'aboutpage', 'herosection');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Load enable/disable state
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        // Load hero data
        if (data.heroData) {
          setHeroData(data.heroData);
          setSavedHeroData(data.heroData);
        }
        
        // Load content section
        if (data.contentSection) {
          setContentSection(data.contentSection);
          setSavedContentSection(data.contentSection);
        }
      }
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveToFirebase = async (section) => {
    if (!db) {
      console.error('Firebase not initialized');
      setSaveStatus({ section, status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section, status: 'saving' });
      
      const docRef = doc(db, 'aboutpage', 'herosection');
      
      const dataToSave = {
        isEnabled,
        heroData,
        contentSection,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      // Update saved states
      setSavedIsEnabled(isEnabled);
      setSavedHeroData({ ...heroData });
      setSavedContentSection({ ...contentSection });
      
      setSaveStatus({ section, status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section, status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleImageSelect = (imageUrl) => {
    if (imageKitTarget === 'background') {
      setHeroData(prev => ({ ...prev, backgroundImage: imageUrl }));
    }
    setIsImageKitOpen(false);
    setImageKitTarget(null);
  };

  const openImageKitBrowser = (target) => {
    setImageKitTarget(target);
    setIsImageKitOpen(true);
  };

  const hasUnsavedChanges = () => {
    return isEnabled !== savedIsEnabled || 
           JSON.stringify(heroData) !== JSON.stringify(savedHeroData) ||
           JSON.stringify(contentSection) !== JSON.stringify(savedContentSection);
  };

  return (
    <div className="about-hero-section-container">
      {/* Section Header with Enable/Disable Toggle */}
      <div className="section-header-row">
        <h2 className="section-main-title">Hero Section Configuration</h2>
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

      {/* Hero Content Section */}
      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('hero')}
        >
          <div className="section-header-title">Hero Content</div>
          {expandedSection === 'hero' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'hero' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Top Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={heroData.topText}
                  onChange={(e) => setHeroData(prev => ({ ...prev, topText: e.target.value }))}
                  placeholder="e.g., ALL AT MOMS"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Main Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={heroData.mainHeading}
                  onChange={(e) => setHeroData(prev => ({ ...prev, mainHeading: e.target.value }))}
                  placeholder="e.g., The Science of Safety,"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Sub Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={heroData.subHeading}
                  onChange={(e) => setHeroData(prev => ({ ...prev, subHeading: e.target.value }))}
                  placeholder="e.g., The Heart of a Mother."
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={heroData.description}
                  onChange={(e) => setHeroData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description text..."
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Background Image</label>
                <div className="image-upload-group">
                  {heroData.backgroundImage && (
                    <div className="image-preview">
                      <img src={heroData.backgroundImage} alt="Background" />
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => openImageKitBrowser('background')}
                  >
                    <Image size={16} />
                    {heroData.backgroundImage ? 'Change Image' : 'Select Image'}
                  </button>
                  {heroData.backgroundImage && (
                    <button
                      type="button"
                      className="btn-text"
                      onClick={() => setHeroData(prev => ({ ...prev, backgroundImage: null }))}
                    >
                      Remove Image
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="section-actions">
              <button
                className="btn-primary"
                onClick={() => saveToFirebase('hero')}
                disabled={loading || !hasUnsavedChanges()}
              >
                {saveStatus.section === 'hero' && saveStatus.status === 'saving'
                  ? 'Saving...'
                  : 'Save Hero Section'}
              </button>
              {saveStatus.section === 'hero' && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === 'hero' && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('content')}
        >
          <div className="section-header-title">Content Section</div>
          {expandedSection === 'content' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'content' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Enable Content Section</label>
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    className="toggle-checkbox"
                    checked={contentSection.enabled}
                    onChange={(e) => setContentSection(prev => ({ ...prev, enabled: e.target.checked }))}
                  />
                  <span className="toggle-text">{contentSection.enabled ? 'Enabled' : 'Disabled'}</span>
                </label>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Content</label>
                <textarea
                  className="form-textarea"
                  rows={6}
                  value={contentSection.content}
                  onChange={(e) => setContentSection(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter content text..."
                />
              </div>
            </div>

            <div className="section-actions">
              <button
                className="btn-primary"
                onClick={() => saveToFirebase('content')}
                disabled={loading || !hasUnsavedChanges()}
              >
                {saveStatus.section === 'content' && saveStatus.status === 'saving'
                  ? 'Saving...'
                  : 'Save Content Section'}
              </button>
              {saveStatus.section === 'content' && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === 'content' && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ImageKit Browser Modal */}
      <ImageKitBrowser
        isOpen={isImageKitOpen}
        onSelect={handleImageSelect}
        onClose={() => {
          setIsImageKitOpen(false);
          setImageKitTarget(null);
        }}
      />
    </div>
  );
};

export default HeroSection;
