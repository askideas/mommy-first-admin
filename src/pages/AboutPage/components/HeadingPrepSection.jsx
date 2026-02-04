import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './HeadingPrepSection.css';

const HeadingPrepSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  // Heading Prep Data State
  const [headingPrepData, setHeadingPrepData] = useState({
    mainText: 'Heading Prep',
    statisticLabel: 'Pre Vaccinated by',
    statisticValue: '6',
    statisticSuffix: 'Maa Yaa by',
    descriptionLine1: 'Dr. Vandana Chint and Dr. Ritika Rai where you',
    descriptionLine2: 'can learn the Ecommerce Diaper Hospital Instrument',
    descriptionLine3: 'and frequency of disease.'
  });
  const [savedHeadingPrepData, setSavedHeadingPrepData] = useState(null);

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
      const docRef = doc(db, 'aboutpage', 'headingprep');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.headingPrepData) {
          setHeadingPrepData(data.headingPrepData);
          setSavedHeadingPrepData(data.headingPrepData);
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
      setSaveStatus({ section: 'headingprep', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'headingprep', status: 'saving' });
      
      const docRef = doc(db, 'aboutpage', 'headingprep');
      
      const dataToSave = {
        isEnabled,
        headingPrepData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedHeadingPrepData({ ...headingPrepData });
      
      setSaveStatus({ section: 'headingprep', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'headingprep', status: 'error' });
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
           JSON.stringify(headingPrepData) !== JSON.stringify(savedHeadingPrepData);
  };

  return (
    <div className="heading-prep-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Heading Prep Section Configuration</h2>
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
          <div className="section-header-title">Heading Prep Content</div>
          {expandedSection === 'content' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'content' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Main Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={headingPrepData.mainText}
                  onChange={(e) => setHeadingPrepData(prev => ({ ...prev, mainText: e.target.value }))}
                  placeholder="e.g., Heading Prep"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Statistic Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={headingPrepData.statisticLabel}
                  onChange={(e) => setHeadingPrepData(prev => ({ ...prev, statisticLabel: e.target.value }))}
                  placeholder="e.g., Pre Vaccinated by"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Statistic Value</label>
                <input
                  type="text"
                  className="form-input"
                  value={headingPrepData.statisticValue}
                  onChange={(e) => setHeadingPrepData(prev => ({ ...prev, statisticValue: e.target.value }))}
                  placeholder="e.g., 6"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Statistic Suffix</label>
                <input
                  type="text"
                  className="form-input"
                  value={headingPrepData.statisticSuffix}
                  onChange={(e) => setHeadingPrepData(prev => ({ ...prev, statisticSuffix: e.target.value }))}
                  placeholder="e.g., Maa Yaa by"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description Line 1</label>
                <input
                  type="text"
                  className="form-input"
                  value={headingPrepData.descriptionLine1}
                  onChange={(e) => setHeadingPrepData(prev => ({ ...prev, descriptionLine1: e.target.value }))}
                  placeholder="First line of description"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description Line 2</label>
                <input
                  type="text"
                  className="form-input"
                  value={headingPrepData.descriptionLine2}
                  onChange={(e) => setHeadingPrepData(prev => ({ ...prev, descriptionLine2: e.target.value }))}
                  placeholder="Second line of description"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description Line 3</label>
                <input
                  type="text"
                  className="form-input"
                  value={headingPrepData.descriptionLine3}
                  onChange={(e) => setHeadingPrepData(prev => ({ ...prev, descriptionLine3: e.target.value }))}
                  placeholder="Third line of description"
                />
              </div>
            </div>

            <div className="section-actions">
              <button
                className="btn-primary"
                onClick={saveToFirebase}
                disabled={loading || !hasUnsavedChanges()}
              >
                {saveStatus.section === 'headingprep' && saveStatus.status === 'saving'
                  ? 'Saving...'
                  : 'Save Heading Prep Section'}
              </button>
              {saveStatus.section === 'headingprep' && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === 'headingprep' && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeadingPrepSection;
