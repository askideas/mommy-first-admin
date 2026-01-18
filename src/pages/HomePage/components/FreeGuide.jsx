import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './FreeGuide.css';

const FreeGuide = () => {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  const [guideData, setGuideData] = useState({
    headingOne: '',
    headingTwo: '',
    description: '',
    buttonLabel: '',
    flashLabelText: ''
  });
  const [savedGuideData, setSavedGuideData] = useState(null);

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
      const docRef = doc(db, 'homepage', 'freeguide');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.guideData) {
          setGuideData(data.guideData);
          setSavedGuideData(data.guideData);
        }
      }
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setGuideData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'guide', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'freeguide');
      
      await setDoc(docRef, {
        guideData: guideData
      });
      
      setSavedGuideData({ ...guideData });
      setSaveStatus({ section: 'guide', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
      console.log('Free Guide Data Saved to Firebase:', guideData);
    } catch (error) {
      console.error('Error saving free guide data:', error);
      setSaveStatus({ section: 'guide', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (savedGuideData) {
      setGuideData({ ...savedGuideData });
    } else {
      setGuideData({
        headingOne: '',
        headingTwo: '',
        description: '',
        buttonLabel: '',
        flashLabelText: ''
      });
    }
  };

  return (
    <div className="free-guide-container">
      <h2 className="section-main-title">Free Guide Configuration</h2>

      <div className="config-section">
        <div className="section-content-area">
          <div className="form-group">
            <label className="form-label">Heading One</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter first heading"
              value={guideData.headingOne}
              onChange={(e) => handleInputChange('headingOne', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Heading Two</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter second heading"
              value={guideData.headingTwo}
              onChange={(e) => handleInputChange('headingTwo', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Enter description"
              rows="4"
              value={guideData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Button Label</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter button label"
              value={guideData.buttonLabel}
              onChange={(e) => handleInputChange('buttonLabel', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Flash Label Text</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter flash label text"
              value={guideData.flashLabelText}
              onChange={(e) => handleInputChange('flashLabelText', e.target.value)}
            />
          </div>

          <div className="section-actions">
            {saveStatus.section === 'guide' && saveStatus.status === 'success' && (
              <span className="save-status success">Saved successfully!</span>
            )}
            {saveStatus.section === 'guide' && saveStatus.status === 'error' && (
              <span className="save-status error">Error saving data</span>
            )}
            <button className="btn-cancel" onClick={handleCancel} disabled={loading}>Cancel</button>
            <button className="btn-save" onClick={handleSave} disabled={loading}>
              {loading && saveStatus.section === 'guide' ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeGuide;
