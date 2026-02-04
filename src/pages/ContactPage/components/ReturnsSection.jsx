import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './ContactSection.css';

const ReturnsSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [returnsData, setReturnsData] = useState({
    heading: 'Returns & Exchanges',
    description: 'The Perfect Fit Promise: Wrong size? Damaged box? Don\'t stress. We prioritize exchanges and replacements to get you the right care, fast.',
    buttonText: 'LOGIN TO YOUR ACCOUNT',
    buttonLink: '/login'
  });
  const [savedReturnsData, setSavedReturnsData] = useState(null);

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
      const docRef = doc(db, 'contactpage', 'returnssection');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.returnsData) {
          setReturnsData(data.returnsData);
          setSavedReturnsData(data.returnsData);
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
      setSaveStatus({ section: 'returns', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'returns', status: 'saving' });
      
      const docRef = doc(db, 'contactpage', 'returnssection');
      
      const dataToSave = {
        isEnabled,
        returnsData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedReturnsData({ ...returnsData });
      
      setSaveStatus({ section: 'returns', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'returns', status: 'error' });
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
           JSON.stringify(returnsData) !== JSON.stringify(savedReturnsData);
  };

  return (
    <div className="contact-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Returns & Exchanges Configuration</h2>
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
          <div className="section-header-title">Returns Content</div>
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
                  value={returnsData.heading}
                  onChange={(e) => setReturnsData(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="e.g., Returns & Exchanges"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={returnsData.description}
                  onChange={(e) => setReturnsData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={returnsData.buttonText}
                  onChange={(e) => setReturnsData(prev => ({ ...prev, buttonText: e.target.value }))}
                  placeholder="e.g., LOGIN TO YOUR ACCOUNT"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Link</label>
                <input
                  type="text"
                  className="form-input"
                  value={returnsData.buttonLink}
                  onChange={(e) => setReturnsData(prev => ({ ...prev, buttonLink: e.target.value }))}
                  placeholder="e.g., /login"
                />
              </div>
            </div>

            <div className="section-actions">
              <button
                className="btn-primary"
                onClick={saveToFirebase}
                disabled={loading || !hasUnsavedChanges()}
              >
                {saveStatus.section === 'returns' && saveStatus.status === 'saving'
                  ? 'Saving...'
                  : 'Save Returns Section'}
              </button>
              {saveStatus.section === 'returns' && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === 'returns' && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnsSection;
