import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './AffiliateSection.css';

const HeroSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  const [showImagePicker, setShowImagePicker] = useState(false);
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [heroData, setHeroData] = useState({
    heading: 'Elevate the Fourth Trimester.',
    subheading: 'Join the Mommy First™ Pro-Circle.',
    description: 'An exclusive circle of childbirth educators, perinatal specialists, labor-birth doulas, postpartum doulas, and lactation consultants co-elevating the 4th Trimester with Mommy First™.',
    buttonText: 'Become an Affiliate',
    buttonLink: '#apply',
    image: '',
    backgroundColor: '#FFF5F8'
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
      const docRef = doc(db, 'affiliatemarketingpage', 'herosection');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
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

  const saveToFirebase = async () => {
    if (!db) {
      console.error('Firebase not initialized');
      setSaveStatus({ section: 'hero', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'hero', status: 'saving' });
      
      const docRef = doc(db, 'affiliatemarketingpage', 'herosection');
      
      const dataToSave = {
        isEnabled,
        heroData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedHeroData({ ...heroData });
      
      setSaveStatus({ section: 'hero', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'hero', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const hasUnsavedChanges = () => {
    return isEnabled !== savedIsEnabled || 
           JSON.stringify(heroData) !== JSON.stringify(savedHeroData);
  };

  return (
    <div className="affiliate-section-container">
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

      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('content')}
        >
          <div className="section-header-title">Hero Content</div>
          {expandedSection === 'content' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'content' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={heroData.heading}
                  onChange={(e) => setHeroData(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="e.g., Elevate the Fourth Trimester."
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Subheading</label>
                <input
                  type="text"
                  className="form-input"
                  value={heroData.subheading}
                  onChange={(e) => setHeroData(prev => ({ ...prev, subheading: e.target.value }))}
                  placeholder="e.g., Join the Mommy First™ Pro-Circle."
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={heroData.description}
                  onChange={(e) => setHeroData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={heroData.buttonText}
                  onChange={(e) => setHeroData(prev => ({ ...prev, buttonText: e.target.value }))}
                  placeholder="e.g., Become an Affiliate"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Link</label>
                <input
                  type="text"
                  className="form-input"
                  value={heroData.buttonLink}
                  onChange={(e) => setHeroData(prev => ({ ...prev, buttonLink: e.target.value }))}
                  placeholder="e.g., #apply"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Background Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    className="color-picker"
                    value={heroData.backgroundColor}
                    onChange={(e) => setHeroData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={heroData.backgroundColor}
                    onChange={(e) => setHeroData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    placeholder="#FFF5F8"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Hero Image</label>
                <div className="image-upload-group">
                  {heroData.image && (
                    <img src={heroData.image} alt="Hero" className="preview-image" />
                  )}
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowImagePicker(true)}
                  >
                    {heroData.image ? 'Change Image' : 'Select Image'}
                  </button>
                  {heroData.image && (
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => setHeroData(prev => ({ ...prev, image: '' }))}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <ImageKitBrowser
              isOpen={showImagePicker}
              onSelect={(url) => {
                setHeroData(prev => ({ ...prev, image: url }));
                setShowImagePicker(false);
              }}
              onClose={() => setShowImagePicker(false)}
            />

            <div className="section-actions">
              <button
                className="btn-primary"
                onClick={saveToFirebase}
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
    </div>
  );
};

export default HeroSection;
