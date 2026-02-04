import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './DonationSection.css';

const MomsActSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [sectionData, setSectionData] = useState({
    heading: 'Supporting Our Moms Act First Wellness Pamper',
    description: 'The MA First Wellness Pamper is an initiative designed for mothers experiencing any form of maternal distress - whether loss, health issues, or financial hardship. Through strategic partnerships with organizations supporting postpartum mothers, we provide curated self-care packages to mothers in need, offering them essential tools to begin healing and recovery.',
    backgroundColor: '#E8F5E9'
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
      const docRef = doc(db, 'donationpage', 'momsact');
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
      setSaveStatus({ section: 'moms', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'moms', status: 'saving' });
      
      const docRef = doc(db, 'donationpage', 'momsact');
      
      const dataToSave = {
        isEnabled,
        sectionData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedSectionData({ ...sectionData });
      
      setSaveStatus({ section: 'moms', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'moms', status: 'error' });
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
    <div className="donation-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Moms Act First Wellness Configuration</h2>
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
              <div className="form-group full-width">
                <label className="form-label">Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={sectionData.heading}
                  onChange={(e) => setSectionData(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="e.g., Supporting Our Moms Act First Wellness Pamper"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  value={sectionData.description}
                  onChange={(e) => setSectionData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description..."
                />
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
                    placeholder="#E8F5E9"
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
                {saveStatus.section === 'moms' && saveStatus.status === 'saving'
                  ? 'Saving...'
                  : 'Save Moms Act Section'}
              </button>
              {saveStatus.section === 'moms' && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === 'moms' && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MomsActSection;
