import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './EnquirySection.css';

const PartnershipPitchSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [partnershipData, setPartnershipData] = useState({
    icon: '🎯',
    heading: 'The Partnership Pitch',
    responseTime: 'Response time: within 24 hours',
    responseTimeColor: '#E8F5E9',
    subheading: 'Why Partner with Mommy First™?',
    description: 'We are the only postpartum brand backed by the global logistics and medical expertise of NeoMedi USA. With distribution hubs in New York (Global HQ), Bucharest (EU), Qatar (GCC) and Mumbai (India), we offer unshakeable supply chain reliability for major retailers and hospital networks.'
  });
  const [savedPartnershipData, setSavedPartnershipData] = useState(null);

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
      const docRef = doc(db, 'enquirypage', 'partnershippitch');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.partnershipData) {
          setPartnershipData(data.partnershipData);
          setSavedPartnershipData(data.partnershipData);
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
      setSaveStatus({ section: 'partnership', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'partnership', status: 'saving' });
      
      const docRef = doc(db, 'enquirypage', 'partnershippitch');
      
      const dataToSave = {
        isEnabled,
        partnershipData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedPartnershipData({ ...partnershipData });
      
      setSaveStatus({ section: 'partnership', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'partnership', status: 'error' });
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
           JSON.stringify(partnershipData) !== JSON.stringify(savedPartnershipData);
  };

  return (
    <div className="enquiry-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Partnership Pitch Configuration</h2>
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
          <div className="section-header-title">Partnership Content</div>
          {expandedSection === 'content' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'content' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Icon (Emoji)</label>
                <input
                  type="text"
                  className="form-input"
                  value={partnershipData.icon}
                  onChange={(e) => setPartnershipData(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="e.g., 🎯"
                  maxLength={2}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={partnershipData.heading}
                  onChange={(e) => setPartnershipData(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="e.g., The Partnership Pitch"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Response Time</label>
                <input
                  type="text"
                  className="form-input"
                  value={partnershipData.responseTime}
                  onChange={(e) => setPartnershipData(prev => ({ ...prev, responseTime: e.target.value }))}
                  placeholder="e.g., Response time: within 24 hours"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Response Time Badge Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    className="color-picker"
                    value={partnershipData.responseTimeColor}
                    onChange={(e) => setPartnershipData(prev => ({ ...prev, responseTimeColor: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={partnershipData.responseTimeColor}
                    onChange={(e) => setPartnershipData(prev => ({ ...prev, responseTimeColor: e.target.value }))}
                    placeholder="#E8F5E9"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Subheading</label>
                <input
                  type="text"
                  className="form-input"
                  value={partnershipData.subheading}
                  onChange={(e) => setPartnershipData(prev => ({ ...prev, subheading: e.target.value }))}
                  placeholder="e.g., Why Partner with Mommy First™?"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  value={partnershipData.description}
                  onChange={(e) => setPartnershipData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description..."
                />
              </div>
            </div>

            <div className="section-actions">
              <button
                className="btn-primary"
                onClick={saveToFirebase}
                disabled={loading || !hasUnsavedChanges()}
              >
                {saveStatus.section === 'partnership' && saveStatus.status === 'saving'
                  ? 'Saving...'
                  : 'Save Partnership Pitch Section'}
              </button>
              {saveStatus.section === 'partnership' && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === 'partnership' && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnershipPitchSection;
