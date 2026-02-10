import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './DonationSection.css';

const PostpartumSupportSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [supportData, setSupportData] = useState({
    heading: 'Supporting Postpartum Support International',
    logo: '',
    description: 'Postpartum Support International is a global leader in perinatal mental health resources, advocacy, and support for mothers experiencing postpartum depression, anxiety, and mood disorders.',
    checkpoints: [],
    backgroundColor: '#E3F2FD'
  });
  const [savedSupportData, setSavedSupportData] = useState(null);

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
      const docRef = doc(db, 'donationpage', 'postpartumsupport');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.supportData) {
          setSupportData(data.supportData);
          setSavedSupportData(data.supportData);
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
      setSaveStatus({ section: 'support', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'support', status: 'saving' });
      
      const docRef = doc(db, 'donationpage', 'postpartumsupport');
      
      const dataToSave = {
        isEnabled,
        supportData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedSupportData({ ...supportData });
      
      setSaveStatus({ section: 'support', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'support', status: 'error' });
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
           JSON.stringify(supportData) !== JSON.stringify(savedSupportData);
  };

  const handleImageSelected = (imageUrl) => {
    setSupportData(prev => ({ ...prev, logo: imageUrl }));
    setIsImageKitOpen(false);
  };

  const addCheckpoint = () => {
    setSupportData(prev => ({
      ...prev,
      checkpoints: [...prev.checkpoints, { id: Date.now(), text: '' }]
    }));
  };

  const removeCheckpoint = (checkpointId) => {
    setSupportData(prev => ({
      ...prev,
      checkpoints: prev.checkpoints.filter(cp => cp.id !== checkpointId)
    }));
  };

  const updateCheckpoint = (checkpointId, value) => {
    setSupportData(prev => ({
      ...prev,
      checkpoints: prev.checkpoints.map(cp =>
        cp.id === checkpointId ? { ...cp, text: value } : cp
      )
    }));
  };

  return (
    <div className="donation-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Postpartum Support International Configuration</h2>
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
                  value={supportData.heading}
                  onChange={(e) => setSupportData(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="e.g., Supporting Postpartum Support International"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Organization Logo</label>
                <div className="image-preview-container" style={{ height: '120px' }}>
                  {supportData.logo ? (
                    <img src={supportData.logo} alt="Logo" className="image-preview" style={{ objectFit: 'contain' }} />
                  ) : (
                    <div className="image-placeholder">No logo selected</div>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-secondary select-image-btn"
                  onClick={() => setIsImageKitOpen(true)}
                >
                  Select Logo
                </button>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={supportData.description}
                  onChange={(e) => setSupportData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Background Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    className="color-picker"
                    value={supportData.backgroundColor}
                    onChange={(e) => setSupportData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={supportData.backgroundColor}
                    onChange={(e) => setSupportData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    placeholder="#E3F2FD"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('checkpoints')}
        >
          <div className="section-header-title">Checkpoints ({supportData.checkpoints.length})</div>
          {expandedSection === 'checkpoints' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'checkpoints' && (
          <div className="section-content">
            <div className="form-group full-width">
              <label className="form-label">Checkpoint Items</label>
              {supportData.checkpoints.map((checkpoint, index) => (
                <div key={checkpoint.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={checkpoint.text}
                    onChange={(e) => updateCheckpoint(checkpoint.id, e.target.value)}
                    placeholder={`Checkpoint ${index + 1}`}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => removeCheckpoint(checkpoint.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary"
                onClick={addCheckpoint}
                style={{ marginTop: '8px' }}
              >
                <Plus size={16} />
                Add Checkpoint
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="section-actions">
        <button
          className="btn-primary"
          onClick={saveToFirebase}
          disabled={loading || !hasUnsavedChanges()}
        >
          {saveStatus.section === 'support' && saveStatus.status === 'saving'
            ? 'Saving...'
            : 'Save Postpartum Support Section'}
        </button>
        {saveStatus.section === 'support' && saveStatus.status === 'success' && (
          <span className="save-status success">Saved successfully!</span>
        )}
        {saveStatus.section === 'support' && saveStatus.status === 'error' && (
          <span className="save-status error">Error saving data</span>
        )}
      </div>

      <ImageKitBrowser
        isOpen={isImageKitOpen}
        onClose={() => setIsImageKitOpen(false)}
        onSelect={handleImageSelected}
      />
    </div>
  );
};

export default PostpartumSupportSection;
