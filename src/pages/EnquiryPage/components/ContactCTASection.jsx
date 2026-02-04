import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './EnquirySection.css';

const ContactCTASection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [ctaData, setCtaData] = useState({
    heading: 'Still have questions? We\'re happy to help 👋',
    buttonText: 'CONTACT US',
    buttonLink: '/contact',
    backgroundColor: '#F5F5F5'
  });
  const [savedCtaData, setSavedCtaData] = useState(null);

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
      const docRef = doc(db, 'enquirypage', 'contactcta');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.ctaData) {
          setCtaData(data.ctaData);
          setSavedCtaData(data.ctaData);
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
      setSaveStatus({ section: 'cta', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'cta', status: 'saving' });
      
      const docRef = doc(db, 'enquirypage', 'contactcta');
      
      const dataToSave = {
        isEnabled,
        ctaData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedCtaData({ ...ctaData });
      
      setSaveStatus({ section: 'cta', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'cta', status: 'error' });
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
           JSON.stringify(ctaData) !== JSON.stringify(savedCtaData);
  };

  return (
    <div className="enquiry-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Contact CTA Configuration</h2>
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
          <div className="section-header-title">CTA Content</div>
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
                  value={ctaData.heading}
                  onChange={(e) => setCtaData(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="e.g., Still have questions? We're happy to help 👋"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={ctaData.buttonText}
                  onChange={(e) => setCtaData(prev => ({ ...prev, buttonText: e.target.value }))}
                  placeholder="e.g., CONTACT US"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Link</label>
                <input
                  type="text"
                  className="form-input"
                  value={ctaData.buttonLink}
                  onChange={(e) => setCtaData(prev => ({ ...prev, buttonLink: e.target.value }))}
                  placeholder="e.g., /contact"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Background Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    className="color-picker"
                    value={ctaData.backgroundColor}
                    onChange={(e) => setCtaData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={ctaData.backgroundColor}
                    onChange={(e) => setCtaData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    placeholder="#F5F5F5"
                  />
                </div>
              </div>
            </div>

            <div className="section-actions">
              <button
                className="btn-primary"
                onClick={saveToFirebase}
                disabled={loading || !hasUnsavedChanges()}
              >
                {saveStatus.section === 'cta' && saveStatus.status === 'saving'
                  ? 'Saving...'
                  : 'Save Contact CTA Section'}
              </button>
              {saveStatus.section === 'cta' && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === 'cta' && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactCTASection;
