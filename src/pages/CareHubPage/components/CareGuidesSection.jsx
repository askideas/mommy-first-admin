import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './CareHubSection.css';

const CareGuidesSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ status: null });
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  
  // Enable/Disable
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);

  // Left Section
  const [leftSection, setLeftSection] = useState({
    label1: '',
    label2: '',
    label3: '',
    heading: '',
    subheading: '',
    description: '',
    buttonLabel: '',
    buttonText: '',
    buttonLink: ''
  });

  // Middle Section - 3 items
  const [middleSection, setMiddleSection] = useState([
    { id: 1, label1: '', label2: '', heading: '', description: '', pdfLink: '' },
    { id: 2, label1: '', label2: '', heading: '', description: '', pdfLink: '' },
    { id: 3, label1: '', label2: '', heading: '', description: '', pdfLink: '' }
  ]);

  // Right Section
  const [rightSection, setRightSection] = useState({
    image: ''
  });

  const [savedData, setSavedData] = useState(null);

  useEffect(() => {
    if (db) {
      loadDataFromFirebase();
    }
  }, []);

  const loadDataFromFirebase = async () => {
    if (!db) return;

    try {
      setLoading(true);
      const docRef = doc(db, 'carehubpage', 'careguides');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        if (data.leftSection) setLeftSection(data.leftSection);
        if (data.middleSection) setMiddleSection(data.middleSection);
        if (data.rightSection) setRightSection(data.rightSection);

        setSavedData(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveToFirebase = async () => {
    if (!db) {
      setSaveStatus({ status: 'error' });
      setTimeout(() => setSaveStatus({ status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ status: 'saving' });

      const docRef = doc(db, 'carehubpage', 'careguides');
      const dataToSave = {
        isEnabled,
        leftSection,
        middleSection,
        rightSection,
        updatedAt: new Date().toISOString()
      };

      await setDoc(docRef, dataToSave, { merge: true });
      setSavedIsEnabled(isEnabled);
      setSavedData(dataToSave);
      setSaveStatus({ status: 'success' });
      setTimeout(() => setSaveStatus({ status: null }), 3000);
    } catch (error) {
      console.error('Error saving:', error);
      setSaveStatus({ status: 'error' });
      setTimeout(() => setSaveStatus({ status: null }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const hasUnsavedChanges = () => {
    if (!savedData) return true;
    if (isEnabled !== savedIsEnabled) return true;
    const currentData = { leftSection, middleSection, rightSection };
    return JSON.stringify(currentData) !== JSON.stringify({
      leftSection: savedData.leftSection,
      middleSection: savedData.middleSection,
      rightSection: savedData.rightSection
    });
  };

  const updateMiddleItem = (id, field, value) => {
    setMiddleSection(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleImageSelected = (imageUrl) => {
    setRightSection(prev => ({ ...prev, image: imageUrl }));
    setIsImageKitOpen(false);
  };

  return (
    <div className="carehub-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Care Guides Section</h2>
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

      {/* Left Section */}
      <div className="config-section">
        <button className="section-header" onClick={() => toggleSection('left')}>
          <div className="section-header-title">Left Section</div>
          {expandedSection === 'left' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expandedSection === 'left' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Label 1</label>
                <input
                  type="text"
                  className="form-input"
                  value={leftSection.label1}
                  onChange={(e) => setLeftSection(prev => ({ ...prev, label1: e.target.value }))}
                  placeholder="Enter label 1"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Label 2</label>
                <input
                  type="text"
                  className="form-input"
                  value={leftSection.label2}
                  onChange={(e) => setLeftSection(prev => ({ ...prev, label2: e.target.value }))}
                  placeholder="Enter label 2"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Label 3</label>
                <input
                  type="text"
                  className="form-input"
                  value={leftSection.label3}
                  onChange={(e) => setLeftSection(prev => ({ ...prev, label3: e.target.value }))}
                  placeholder="Enter label 3"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={leftSection.heading}
                  onChange={(e) => setLeftSection(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="Enter heading"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Subheading</label>
                <input
                  type="text"
                  className="form-input"
                  value={leftSection.subheading}
                  onChange={(e) => setLeftSection(prev => ({ ...prev, subheading: e.target.value }))}
                  placeholder="Enter subheading"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={leftSection.description}
                  onChange={(e) => setLeftSection(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Button Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={leftSection.buttonLabel}
                  onChange={(e) => setLeftSection(prev => ({ ...prev, buttonLabel: e.target.value }))}
                  placeholder="Enter button label"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={leftSection.buttonText}
                  onChange={(e) => setLeftSection(prev => ({ ...prev, buttonText: e.target.value }))}
                  placeholder="Enter button text"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Button Link</label>
                <input
                  type="text"
                  className="form-input"
                  value={leftSection.buttonLink}
                  onChange={(e) => setLeftSection(prev => ({ ...prev, buttonLink: e.target.value }))}
                  placeholder="Enter button link"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Middle Section */}
      <div className="config-section">
        <button className="section-header" onClick={() => toggleSection('middle')}>
          <div className="section-header-title">Middle Section (3 Items)</div>
          {expandedSection === 'middle' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expandedSection === 'middle' && (
          <div className="section-content">
            <div className="cards-list">
              {middleSection.map((item, index) => (
                <div key={item.id} className="card-item">
                  <div className="card-item-header">
                    <span className="card-item-title">Item {index + 1}</span>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Label 1</label>
                      <input
                        type="text"
                        className="form-input"
                        value={item.label1}
                        onChange={(e) => updateMiddleItem(item.id, 'label1', e.target.value)}
                        placeholder="Enter label 1"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Label 2</label>
                      <input
                        type="text"
                        className="form-input"
                        value={item.label2}
                        onChange={(e) => updateMiddleItem(item.id, 'label2', e.target.value)}
                        placeholder="Enter label 2"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">Heading</label>
                      <input
                        type="text"
                        className="form-input"
                        value={item.heading}
                        onChange={(e) => updateMiddleItem(item.id, 'heading', e.target.value)}
                        placeholder="Enter heading"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-textarea"
                        rows={2}
                        value={item.description}
                        onChange={(e) => updateMiddleItem(item.id, 'description', e.target.value)}
                        placeholder="Enter description"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">PDF Link</label>
                      <input
                        type="text"
                        className="form-input"
                        value={item.pdfLink}
                        onChange={(e) => updateMiddleItem(item.id, 'pdfLink', e.target.value)}
                        placeholder="Enter PDF link"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="config-section">
        <button className="section-header" onClick={() => toggleSection('right')}>
          <div className="section-header-title">Right Section (Image)</div>
          {expandedSection === 'right' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expandedSection === 'right' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Image</label>
                <div className="image-preview-container">
                  {rightSection.image ? (
                    <img src={rightSection.image} alt="Right Section" className="image-preview" />
                  ) : (
                    <div className="image-placeholder">No image selected</div>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-secondary select-image-btn"
                  onClick={() => setIsImageKitOpen(true)}
                >
                  Select Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="section-actions">
        <button
          className="btn-primary"
          onClick={saveToFirebase}
          disabled={loading || !hasUnsavedChanges()}
        >
          {saveStatus.status === 'saving' ? 'Saving...' : 'Save Care Guides Section'}
        </button>
        {saveStatus.status === 'success' && (
          <span className="save-status success">Saved successfully!</span>
        )}
        {saveStatus.status === 'error' && (
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

export default CareGuidesSection;
