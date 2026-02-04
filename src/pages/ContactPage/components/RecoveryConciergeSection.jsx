import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './ContactSection.css';

const RecoveryConciergeSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [recoveryData, setRecoveryData] = useState({
    heading: 'The Recovery Concierge: Whether you are building your hospital bag or need help easing your kit, our team is on standby to help you prepare.',
    highlightText: 'If you are currently in labor or experiencing a medical emergency, please contact your healthcare provider immediately.',
    highlightColor: '#FFF9C4'
  });
  const [savedRecoveryData, setSavedRecoveryData] = useState(null);

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
      const docRef = doc(db, 'contactpage', 'recoveryconcierge');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.recoveryData) {
          setRecoveryData(data.recoveryData);
          setSavedRecoveryData(data.recoveryData);
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
      setSaveStatus({ section: 'recovery', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'recovery', status: 'saving' });
      
      const docRef = doc(db, 'contactpage', 'recoveryconcierge');
      
      const dataToSave = {
        isEnabled,
        recoveryData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedRecoveryData({ ...recoveryData });
      
      setSaveStatus({ section: 'recovery', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'recovery', status: 'error' });
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
           JSON.stringify(recoveryData) !== JSON.stringify(savedRecoveryData);
  };

  return (
    <div className="contact-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Recovery Concierge Configuration</h2>
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
          <div className="section-header-title">Recovery Content</div>
          {expandedSection === 'content' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'content' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Heading</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={recoveryData.heading}
                  onChange={(e) => setRecoveryData(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="Enter heading text..."
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Highlighted Emergency Text</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={recoveryData.highlightText}
                  onChange={(e) => setRecoveryData(prev => ({ ...prev, highlightText: e.target.value }))}
                  placeholder="Enter emergency notice text..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Highlight Background Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    className="color-picker"
                    value={recoveryData.highlightColor}
                    onChange={(e) => setRecoveryData(prev => ({ ...prev, highlightColor: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={recoveryData.highlightColor}
                    onChange={(e) => setRecoveryData(prev => ({ ...prev, highlightColor: e.target.value }))}
                    placeholder="#FFF9C4"
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
                {saveStatus.section === 'recovery' && saveStatus.status === 'saving'
                  ? 'Saving...'
                  : 'Save Recovery Concierge Section'}
              </button>
              {saveStatus.section === 'recovery' && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === 'recovery' && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecoveryConciergeSection;
