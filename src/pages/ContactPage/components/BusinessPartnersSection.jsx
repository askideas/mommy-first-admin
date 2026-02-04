import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './ContactSection.css';

const BusinessPartnersSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [businessData, setBusinessData] = useState({
    globalInfra: {
      heading: 'Global Infrastructure. Local Care.',
      buttonText: 'BUSINESS ENQUIRIES',
      buttonLink: '/business'
    },
    partnerSection: {
      heading: 'Partner with the leader in premium postpartum solutions.',
      buttonText: 'BUSINESS ENQUIRIES',
      buttonLink: '/business'
    }
  });
  const [savedBusinessData, setSavedBusinessData] = useState(null);

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
      const docRef = doc(db, 'contactpage', 'businesspartners');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.businessData) {
          setBusinessData(data.businessData);
          setSavedBusinessData(data.businessData);
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
      setSaveStatus({ section: 'business', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'business', status: 'saving' });
      
      const docRef = doc(db, 'contactpage', 'businesspartners');
      
      const dataToSave = {
        isEnabled,
        businessData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedBusinessData({ ...businessData });
      
      setSaveStatus({ section: 'business', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'business', status: 'error' });
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
           JSON.stringify(businessData) !== JSON.stringify(savedBusinessData);
  };

  return (
    <div className="contact-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Business & Partners Configuration</h2>
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

      {/* Global Infrastructure Section */}
      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('global')}
        >
          <div className="section-header-title">Global Infrastructure</div>
          {expandedSection === 'global' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'global' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={businessData.globalInfra.heading}
                  onChange={(e) => setBusinessData(prev => ({
                    ...prev,
                    globalInfra: { ...prev.globalInfra, heading: e.target.value }
                  }))}
                  placeholder="e.g., Global Infrastructure. Local Care."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={businessData.globalInfra.buttonText}
                  onChange={(e) => setBusinessData(prev => ({
                    ...prev,
                    globalInfra: { ...prev.globalInfra, buttonText: e.target.value }
                  }))}
                  placeholder="e.g., BUSINESS ENQUIRIES"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Link</label>
                <input
                  type="text"
                  className="form-input"
                  value={businessData.globalInfra.buttonLink}
                  onChange={(e) => setBusinessData(prev => ({
                    ...prev,
                    globalInfra: { ...prev.globalInfra, buttonLink: e.target.value }
                  }))}
                  placeholder="e.g., /business"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Partner Section */}
      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('partner')}
        >
          <div className="section-header-title">Partner Section</div>
          {expandedSection === 'partner' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'partner' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Heading</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={businessData.partnerSection.heading}
                  onChange={(e) => setBusinessData(prev => ({
                    ...prev,
                    partnerSection: { ...prev.partnerSection, heading: e.target.value }
                  }))}
                  placeholder="e.g., Partner with the leader in premium postpartum solutions."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={businessData.partnerSection.buttonText}
                  onChange={(e) => setBusinessData(prev => ({
                    ...prev,
                    partnerSection: { ...prev.partnerSection, buttonText: e.target.value }
                  }))}
                  placeholder="e.g., BUSINESS ENQUIRIES"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Link</label>
                <input
                  type="text"
                  className="form-input"
                  value={businessData.partnerSection.buttonLink}
                  onChange={(e) => setBusinessData(prev => ({
                    ...prev,
                    partnerSection: { ...prev.partnerSection, buttonLink: e.target.value }
                  }))}
                  placeholder="e.g., /business"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="save-section">
        <button
          className="btn-primary"
          onClick={saveToFirebase}
          disabled={loading || !hasUnsavedChanges()}
        >
          {saveStatus.section === 'business' && saveStatus.status === 'saving'
            ? 'Saving...'
            : 'Save Business & Partners Section'}
        </button>
        {saveStatus.section === 'business' && saveStatus.status === 'success' && (
          <span className="save-status success">Saved successfully!</span>
        )}
        {saveStatus.section === 'business' && saveStatus.status === 'error' && (
          <span className="save-status error">Error saving data</span>
        )}
      </div>
    </div>
  );
};

export default BusinessPartnersSection;
