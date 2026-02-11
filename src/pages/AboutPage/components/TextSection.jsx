import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './AboutSection.css';

const TextSection = () => {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [textContent, setTextContent] = useState('');
  const [savedTextContent, setSavedTextContent] = useState('');

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
      const docRef = doc(db, 'aboutpage', 'textsection');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        if (data.textContent !== undefined) {
          setTextContent(data.textContent);
          setSavedTextContent(data.textContent);
        }
      }
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveStatus('saving');
      
      const docRef = doc(db, 'aboutpage', 'textsection');
      
      await setDoc(docRef, {
        isEnabled: isEnabled,
        textContent: textContent
      });
      
      setSavedIsEnabled(isEnabled);
      setSavedTextContent(textContent);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Error saving text section:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEnabled(savedIsEnabled);
    setTextContent(savedTextContent);
  };

  return (
    <div className="about-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Text Section Configuration</h2>
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
          {/* Text Content */}
          <div className="form-group">
            <label className="form-label">Text Content</label>
            <textarea
              className="form-textarea large"
              placeholder="Enter your text content here..."
              rows={10}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
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

export default TextSection;
