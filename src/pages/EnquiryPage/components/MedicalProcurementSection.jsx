import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './EnquirySection.css';

const MedicalProcurementSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [medicalData, setMedicalData] = useState({
    icon: '🏥',
    heading: 'Medical Procurement',
    audienceLabel: 'For Hospitals & OB-GYN Practices',
    audienceDescription: 'We offer medical-grade procurement for hospital systems looking to upgrade their standard-of-care discharge kits.',
    email: 'medical@neomediusa.com',
    emailLabel: 'Email'
  });
  const [savedMedicalData, setSavedMedicalData] = useState(null);

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
      const docRef = doc(db, 'enquirypage', 'medicalprocurement');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.medicalData) {
          setMedicalData(data.medicalData);
          setSavedMedicalData(data.medicalData);
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
      setSaveStatus({ section: 'medical', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'medical', status: 'saving' });
      
      const docRef = doc(db, 'enquirypage', 'medicalprocurement');
      
      const dataToSave = {
        isEnabled,
        medicalData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedMedicalData({ ...medicalData });
      
      setSaveStatus({ section: 'medical', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'medical', status: 'error' });
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
           JSON.stringify(medicalData) !== JSON.stringify(savedMedicalData);
  };

  return (
    <div className="enquiry-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Medical Procurement Configuration</h2>
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
          <div className="section-header-title">Medical Procurement Content</div>
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
                  value={medicalData.icon}
                  onChange={(e) => setMedicalData(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="e.g., 🏥"
                  maxLength={2}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={medicalData.heading}
                  onChange={(e) => setMedicalData(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="e.g., Medical Procurement"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Audience Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={medicalData.audienceLabel}
                  onChange={(e) => setMedicalData(prev => ({ ...prev, audienceLabel: e.target.value }))}
                  placeholder="e.g., For Hospitals & OB-GYN Practices"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Audience Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={medicalData.audienceDescription}
                  onChange={(e) => setMedicalData(prev => ({ ...prev, audienceDescription: e.target.value }))}
                  placeholder="Enter description..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={medicalData.emailLabel}
                  onChange={(e) => setMedicalData(prev => ({ ...prev, emailLabel: e.target.value }))}
                  placeholder="e.g., Email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={medicalData.email}
                  onChange={(e) => setMedicalData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g., medical@neomediusa.com"
                />
              </div>
            </div>

            <div className="section-actions">
              <button
                className="btn-primary"
                onClick={saveToFirebase}
                disabled={loading || !hasUnsavedChanges()}
              >
                {saveStatus.section === 'medical' && saveStatus.status === 'saving'
                  ? 'Saving...'
                  : 'Save Medical Procurement Section'}
              </button>
              {saveStatus.section === 'medical' && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === 'medical' && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalProcurementSection;
