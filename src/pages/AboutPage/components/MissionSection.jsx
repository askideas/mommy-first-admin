import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './MissionSection.css';

const MissionSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  // Mission Data State
  const [missionData, setMissionData] = useState({
    heading: 'What Drives Us',
    subheading: 'Redefining The \'After\'',
    tagline: 'WE BELIEVE FIRMLY: It is a mothers Specialty.',
    descriptionLine1: 'What truly surprises you is that you used to be the center of 24 hours',
    descriptionLine2: 'active shifts, you halt toward due heartbeat of a newness.',
    color: '#DC5F92'
  });
  const [savedMissionData, setSavedMissionData] = useState(null);

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
      const docRef = doc(db, 'aboutpage', 'mission');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.missionData) {
          setMissionData(data.missionData);
          setSavedMissionData(data.missionData);
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
      setSaveStatus({ section: 'mission', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'mission', status: 'saving' });
      
      const docRef = doc(db, 'aboutpage', 'mission');
      
      const dataToSave = {
        isEnabled,
        missionData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedMissionData({ ...missionData });
      
      setSaveStatus({ section: 'mission', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'mission', status: 'error' });
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
           JSON.stringify(missionData) !== JSON.stringify(savedMissionData);
  };

  return (
    <div className="mission-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Mission Section Configuration</h2>
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
          <div className="section-header-title">Mission Content</div>
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
                  value={missionData.heading}
                  onChange={(e) => setMissionData(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="e.g., What Drives Us"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Subheading</label>
                <input
                  type="text"
                  className="form-input"
                  value={missionData.subheading}
                  onChange={(e) => setMissionData(prev => ({ ...prev, subheading: e.target.value }))}
                  placeholder="e.g., Redefining The 'After'"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  value={missionData.tagline}
                  onChange={(e) => setMissionData(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="e.g., WE BELIEVE FIRMLY: It is a mothers Specialty."
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description Line 1</label>
                <input
                  type="text"
                  className="form-input"
                  value={missionData.descriptionLine1}
                  onChange={(e) => setMissionData(prev => ({ ...prev, descriptionLine1: e.target.value }))}
                  placeholder="First line of description"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description Line 2</label>
                <input
                  type="text"
                  className="form-input"
                  value={missionData.descriptionLine2}
                  onChange={(e) => setMissionData(prev => ({ ...prev, descriptionLine2: e.target.value }))}
                  placeholder="Second line of description"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Accent Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    className="color-picker"
                    value={missionData.color}
                    onChange={(e) => setMissionData(prev => ({ ...prev, color: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={missionData.color}
                    onChange={(e) => setMissionData(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="#DC5F92"
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
                {saveStatus.section === 'mission' && saveStatus.status === 'saving'
                  ? 'Saving...'
                  : 'Save Mission Section'}
              </button>
              {saveStatus.section === 'mission' && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === 'mission' && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionSection;
