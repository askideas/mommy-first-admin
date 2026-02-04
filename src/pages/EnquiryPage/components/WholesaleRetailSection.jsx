import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './EnquirySection.css';

const WholesaleRetailSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [wholesaleData, setWholesaleData] = useState({
    icon: '💼',
    heading: 'Wholesale & Retail',
    audienceLabel: 'For Boutiques & Major Retailers',
    audienceDescription: 'Modern mothers are trading generic drugstore supplies for premium, effective recovery tools. Join us in elevating the category.',
    email: 'wholesale@neomediusa.com',
    emailLabel: 'Email',
    territories: 'North America, EMEA, APAC',
    territoriesLabel: 'Territories'
  });
  const [savedWholesaleData, setSavedWholesaleData] = useState(null);

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
      const docRef = doc(db, 'enquirypage', 'wholesaleretail');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.wholesaleData) {
          setWholesaleData(data.wholesaleData);
          setSavedWholesaleData(data.wholesaleData);
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
      setSaveStatus({ section: 'wholesale', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'wholesale', status: 'saving' });
      
      const docRef = doc(db, 'enquirypage', 'wholesaleretail');
      
      const dataToSave = {
        isEnabled,
        wholesaleData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedWholesaleData({ ...wholesaleData });
      
      setSaveStatus({ section: 'wholesale', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'wholesale', status: 'error' });
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
           JSON.stringify(wholesaleData) !== JSON.stringify(savedWholesaleData);
  };

  return (
    <div className="enquiry-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Wholesale & Retail Configuration</h2>
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
          <div className="section-header-title">Wholesale & Retail Content</div>
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
                  value={wholesaleData.icon}
                  onChange={(e) => setWholesaleData(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="e.g., 💼"
                  maxLength={2}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={wholesaleData.heading}
                  onChange={(e) => setWholesaleData(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="e.g., Wholesale & Retail"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Audience Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={wholesaleData.audienceLabel}
                  onChange={(e) => setWholesaleData(prev => ({ ...prev, audienceLabel: e.target.value }))}
                  placeholder="e.g., For Boutiques & Major Retailers"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Audience Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={wholesaleData.audienceDescription}
                  onChange={(e) => setWholesaleData(prev => ({ ...prev, audienceDescription: e.target.value }))}
                  placeholder="Enter description..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={wholesaleData.emailLabel}
                  onChange={(e) => setWholesaleData(prev => ({ ...prev, emailLabel: e.target.value }))}
                  placeholder="e.g., Email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={wholesaleData.email}
                  onChange={(e) => setWholesaleData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g., wholesale@neomediusa.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Territories Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={wholesaleData.territoriesLabel}
                  onChange={(e) => setWholesaleData(prev => ({ ...prev, territoriesLabel: e.target.value }))}
                  placeholder="e.g., Territories"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Territories</label>
                <input
                  type="text"
                  className="form-input"
                  value={wholesaleData.territories}
                  onChange={(e) => setWholesaleData(prev => ({ ...prev, territories: e.target.value }))}
                  placeholder="e.g., North America, EMEA, APAC"
                />
              </div>
            </div>

            <div className="section-actions">
              <button
                className="btn-primary"
                onClick={saveToFirebase}
                disabled={loading || !hasUnsavedChanges()}
              >
                {saveStatus.section === 'wholesale' && saveStatus.status === 'saving'
                  ? 'Saving...'
                  : 'Save Wholesale & Retail Section'}
              </button>
              {saveStatus.section === 'wholesale' && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === 'wholesale' && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WholesaleRetailSection;
