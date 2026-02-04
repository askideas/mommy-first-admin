import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './EnquirySection.css';

const HealthPlansSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [healthPlansData, setHealthPlansData] = useState({
    icon: '💗',
    heading: 'Health Plans & Payers',
    audienceLabel: 'For Insurance Providers & Corporate Benefit Platforms (FSA/HSA)',
    audienceDescription: 'We partner with forward-thinking Health Plans and Employee Benefit Platforms to offer Mommy First™ recovery kits as a covered member benefit.',
    supportText: 'Help your members navigate the Fourth Trimester with the only recovery system backed by a Clinical Pharmacist and a Quality Specialist.',
    email: 'partnerships@neomediusa.com',
    emailLabel: 'Email'
  });
  const [savedHealthPlansData, setSavedHealthPlansData] = useState(null);

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
      const docRef = doc(db, 'enquirypage', 'healthplans');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.healthPlansData) {
          setHealthPlansData(data.healthPlansData);
          setSavedHealthPlansData(data.healthPlansData);
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
      setSaveStatus({ section: 'health', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'health', status: 'saving' });
      
      const docRef = doc(db, 'enquirypage', 'healthplans');
      
      const dataToSave = {
        isEnabled,
        healthPlansData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedHealthPlansData({ ...healthPlansData });
      
      setSaveStatus({ section: 'health', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'health', status: 'error' });
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
           JSON.stringify(healthPlansData) !== JSON.stringify(savedHealthPlansData);
  };

  return (
    <div className="enquiry-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Health Plans & Payers Configuration</h2>
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
          <div className="section-header-title">Health Plans Content</div>
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
                  value={healthPlansData.icon}
                  onChange={(e) => setHealthPlansData(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="e.g., 💗"
                  maxLength={2}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={healthPlansData.heading}
                  onChange={(e) => setHealthPlansData(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="e.g., Health Plans & Payers"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Audience Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={healthPlansData.audienceLabel}
                  onChange={(e) => setHealthPlansData(prev => ({ ...prev, audienceLabel: e.target.value }))}
                  placeholder="e.g., For Insurance Providers & Corporate Benefit Platforms"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Audience Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={healthPlansData.audienceDescription}
                  onChange={(e) => setHealthPlansData(prev => ({ ...prev, audienceDescription: e.target.value }))}
                  placeholder="Enter description..."
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Support Text</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={healthPlansData.supportText}
                  onChange={(e) => setHealthPlansData(prev => ({ ...prev, supportText: e.target.value }))}
                  placeholder="Additional support text..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={healthPlansData.emailLabel}
                  onChange={(e) => setHealthPlansData(prev => ({ ...prev, emailLabel: e.target.value }))}
                  placeholder="e.g., Email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={healthPlansData.email}
                  onChange={(e) => setHealthPlansData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g., partnerships@neomediusa.com"
                />
              </div>
            </div>

            <div className="section-actions">
              <button
                className="btn-primary"
                onClick={saveToFirebase}
                disabled={loading || !hasUnsavedChanges()}
              >
                {saveStatus.section === 'health' && saveStatus.status === 'saving'
                  ? 'Saving...'
                  : 'Save Health Plans Section'}
              </button>
              {saveStatus.section === 'health' && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === 'health' && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthPlansSection;
