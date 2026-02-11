import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './AboutSection.css';

const WhatDriveUsSection = () => {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [sectionData, setSectionData] = useState({
    heading: '',
    label1: '',
    label2: '',
    description: ''
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
      const docRef = doc(db, 'aboutpage', 'whatdriveus');
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

  const handleInputChange = (field, value) => {
    setSectionData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveStatus('saving');
      
      const docRef = doc(db, 'aboutpage', 'whatdriveus');
      
      await setDoc(docRef, {
        isEnabled: isEnabled,
        sectionData: sectionData
      });
      
      setSavedIsEnabled(isEnabled);
      setSavedSectionData({ ...sectionData });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Error saving what drive us section:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEnabled(savedIsEnabled);
    if (savedSectionData) {
      setSectionData({ ...savedSectionData });
    } else {
      setSectionData({
        heading: '',
        label1: '',
        label2: '',
        description: ''
      });
    }
  };

  return (
    <div className="about-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">What Drive Us Section Configuration</h2>
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
        <div className="section-content-area">
          {/* Heading */}
          <div className="form-group">
            <label className="form-label">Heading</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter heading"
              value={sectionData.heading}
              onChange={(e) => handleInputChange('heading', e.target.value)}
            />
          </div>

          {/* Label 1 */}
          <div className="form-group">
            <label className="form-label">Label 1</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter label 1"
              value={sectionData.label1}
              onChange={(e) => handleInputChange('label1', e.target.value)}
            />
          </div>

          {/* Label 2 */}
          <div className="form-group">
            <label className="form-label">Label 2</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter label 2"
              value={sectionData.label2}
              onChange={(e) => handleInputChange('label2', e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Enter description"
              rows={4}
              value={sectionData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <div className="section-actions">
            <button className="btn-cancel" onClick={handleCancel} disabled={loading}>Cancel</button>
            <button className="btn-save" onClick={handleSave} disabled={loading}>
              {loading && saveStatus === 'saving' ? 'Saving...' : 'Save'}
            </button>
            {saveStatus === 'success' && (
              <span className="save-success">✓ Saved successfully!</span>
            )}
            {saveStatus === 'error' && (
              <span className="save-error">✗ Error saving</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatDriveUsSection;
