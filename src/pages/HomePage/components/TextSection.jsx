import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './TextSection.css';

const TextSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  // Content Data State
  const [contentData, setContentData] = useState({
    content: ''
  });
  const [savedContentData, setSavedContentData] = useState(null);

  // Load data from Firebase on component mount
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
      const docRef = doc(db, 'homepage', 'textsection');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.contentData) {
          setContentData(data.contentData);
          setSavedContentData(data.contentData);
        }
      }
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleEnableToggle = async (newState) => {
    setIsEnabled(newState);
    try {
      const docRef = doc(db, 'homepage', 'textsection');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        isEnabled: newState
      });
      
      setSavedIsEnabled(newState);
      console.log('Text Section enabled state:', newState);
    } catch (error) {
      console.error('Error saving enabled state:', error);
      setIsEnabled(!newState);
    }
  };

  const handleContentChange = (value) => {
    setContentData(prev => ({ ...prev, content: value }));
  };

  const handleContentSave = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'content', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'textsection');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        contentData: contentData
      });
      
      setSavedContentData({ ...contentData });
      setSaveStatus({ section: 'content', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
      console.log('Text Section Content Data Saved to Firebase:', contentData);
    } catch (error) {
      console.error('Error saving content data:', error);
      setSaveStatus({ section: 'content', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleContentCancel = () => {
    if (savedContentData) {
      setContentData({ ...savedContentData });
    } else {
      setContentData({ content: '' });
    }
  };

  return (
    <div className="text-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Text Section Configuration</h2>
        <div className="enable-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => handleEnableToggle(e.target.checked)}
              className="toggle-checkbox"
            />
            <span className="toggle-text">{isEnabled ? 'Enabled' : 'Disabled'}</span>
          </label>
        </div>
      </div>

      {/* Content Section */}
      <div className="config-section">
        <button 
          className="section-header"
          onClick={() => toggleSection('content')}
        >
          <span className="section-header-title">Text Content</span>
          {expandedSection === 'content' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSection === 'content' && (
          <div className="section-content-area">
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                className="form-textarea"
                placeholder="Enter text content"
                rows="6"
                value={contentData.content}
                onChange={(e) => handleContentChange(e.target.value)}
              />
            </div>

            <div className="section-actions">
              {saveStatus.section === 'content' && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === 'content' && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
              <button className="btn-cancel" onClick={handleContentCancel} disabled={loading}>Cancel</button>
              <button className="btn-save" onClick={handleContentSave} disabled={loading}>
                {loading && saveStatus.section === 'content' ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextSection;
