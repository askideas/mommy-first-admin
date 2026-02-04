import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './AffiliateSection.css';

const ApplyAccessEarnSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [sectionData, setSectionData] = useState({
    applyText: 'APPLY',
    accessText: 'ACCESS',
    earnText: 'EARN',
    applyColor: '#DC5F92',
    accessColor: '#9C27B0',
    earnColor: '#F9A825',
    backgroundColor: '#FFFFFF'
  });
  const [savedSectionData, setSavedSectionData] = useState(null);

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
      const docRef = doc(db, 'affiliatemarketingpage', 'applyaccessearn');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.sectionData) {
          setSectionData(data.sectionData);
          setSavedSectionData(data.sectionData);
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
      setSaveStatus({ section: 'apply', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'apply', status: 'saving' });
      
      const docRef = doc(db, 'affiliatemarketingpage', 'applyaccessearn');
      
      const dataToSave = {
        isEnabled,
        sectionData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedSectionData({ ...sectionData });
      
      setSaveStatus({ section: 'apply', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'apply', status: 'error' });
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
           JSON.stringify(sectionData) !== JSON.stringify(savedSectionData);
  };

  return (
    <div className="affiliate-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Apply Access Earn Configuration</h2>
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
          <div className="section-header-title">Section Content</div>
          {expandedSection === 'content' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'content' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Apply Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={sectionData.applyText}
                  onChange={(e) => setSectionData(prev => ({ ...prev, applyText: e.target.value }))}
                  placeholder="e.g., APPLY"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Apply Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    className="color-picker"
                    value={sectionData.applyColor}
                    onChange={(e) => setSectionData(prev => ({ ...prev, applyColor: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={sectionData.applyColor}
                    onChange={(e) => setSectionData(prev => ({ ...prev, applyColor: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Access Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={sectionData.accessText}
                  onChange={(e) => setSectionData(prev => ({ ...prev, accessText: e.target.value }))}
                  placeholder="e.g., ACCESS"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Access Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    className="color-picker"
                    value={sectionData.accessColor}
                    onChange={(e) => setSectionData(prev => ({ ...prev, accessColor: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={sectionData.accessColor}
                    onChange={(e) => setSectionData(prev => ({ ...prev, accessColor: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Earn Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={sectionData.earnText}
                  onChange={(e) => setSectionData(prev => ({ ...prev, earnText: e.target.value }))}
                  placeholder="e.g., EARN"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Earn Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    className="color-picker"
                    value={sectionData.earnColor}
                    onChange={(e) => setSectionData(prev => ({ ...prev, earnColor: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={sectionData.earnColor}
                    onChange={(e) => setSectionData(prev => ({ ...prev, earnColor: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Background Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    className="color-picker"
                    value={sectionData.backgroundColor}
                    onChange={(e) => setSectionData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={sectionData.backgroundColor}
                    onChange={(e) => setSectionData(prev => ({ ...prev, backgroundColor: e.target.value }))}
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
                {saveStatus.section === 'apply' && saveStatus.status === 'saving'
                  ? 'Saving...'
                  : 'Save Apply Access Earn Section'}
              </button>
              {saveStatus.section === 'apply' && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === 'apply' && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyAccessEarnSection;
