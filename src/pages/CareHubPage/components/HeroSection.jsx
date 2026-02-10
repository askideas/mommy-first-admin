import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './CareHubSection.css';

const HeroSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ status: null });
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState(null);

  // Hero Content
  const [heroContent, setHeroContent] = useState({
    heading: '',
    subheading: '',
    description: '',
    image: ''
  });

  // Three Label Items
  const [labelItems, setLabelItems] = useState([
    { id: 1, label1: '', label2: '' },
    { id: 2, label1: '', label2: '' },
    { id: 3, label1: '', label2: '' }
  ]);

  // Five Bubbles
  const [bubbles, setBubbles] = useState([
    { id: 1, image: '', description: '', location: '', time: '' },
    { id: 2, image: '', description: '', location: '', time: '' },
    { id: 3, image: '', description: '', location: '', time: '' },
    { id: 4, image: '', description: '', location: '', time: '' },
    { id: 5, image: '', description: '', location: '', time: '' }
  ]);

  // Three Buttons
  const [buttons, setButtons] = useState([
    { id: 1, label: '', link: '' },
    { id: 2, label: '', link: '' },
    { id: 3, label: '', link: '' }
  ]);

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
      const docRef = doc(db, 'carehubpage', 'herosection');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        if (data.heroContent) setHeroContent(data.heroContent);
        if (data.labelItems) setLabelItems(data.labelItems);
        if (data.bubbles) setBubbles(data.bubbles);
        if (data.buttons) setButtons(data.buttons);

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

      const docRef = doc(db, 'carehubpage', 'herosection');
      const dataToSave = {
        heroContent,
        labelItems,
        bubbles,
        buttons,
        updatedAt: new Date().toISOString()
      };

      await setDoc(docRef, dataToSave, { merge: true });
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
    const currentData = { heroContent, labelItems, bubbles, buttons };
    return JSON.stringify(currentData) !== JSON.stringify({
      heroContent: savedData.heroContent,
      labelItems: savedData.labelItems,
      bubbles: savedData.bubbles,
      buttons: savedData.buttons
    });
  };

  const handleSelectImage = (field) => {
    setCurrentImageField(field);
    setIsImageKitOpen(true);
  };

  const handleImageSelected = (imageUrl) => {
    if (currentImageField === 'heroImage') {
      setHeroContent(prev => ({ ...prev, image: imageUrl }));
    } else if (currentImageField?.startsWith('bubble-')) {
      const bubbleId = parseInt(currentImageField.split('-')[1]);
      setBubbles(prev => prev.map(b => b.id === bubbleId ? { ...b, image: imageUrl } : b));
    }
    setIsImageKitOpen(false);
    setCurrentImageField(null);
  };

  const updateLabelItem = (id, field, value) => {
    setLabelItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const updateBubble = (id, field, value) => {
    setBubbles(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const updateButton = (id, field, value) => {
    setButtons(prev => prev.map(btn => btn.id === id ? { ...btn, [field]: value } : btn));
  };

  return (
    <div className="carehub-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Hero Section</h2>
      </div>

      {/* Hero Content */}
      <div className="config-section">
        <button className="section-header" onClick={() => toggleSection('content')}>
          <div className="section-header-title">Hero Content</div>
          {expandedSection === 'content' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expandedSection === 'content' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={heroContent.heading}
                  onChange={(e) => setHeroContent(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="Enter heading"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Subheading</label>
                <input
                  type="text"
                  className="form-input"
                  value={heroContent.subheading}
                  onChange={(e) => setHeroContent(prev => ({ ...prev, subheading: e.target.value }))}
                  placeholder="Enter subheading"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={heroContent.description}
                  onChange={(e) => setHeroContent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Image</label>
                <div className="image-preview-container">
                  {heroContent.image ? (
                    <img src={heroContent.image} alt="Hero" className="image-preview" />
                  ) : (
                    <div className="image-placeholder">No image selected</div>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-secondary select-image-btn"
                  onClick={() => handleSelectImage('heroImage')}
                >
                  Select Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Label Items */}
      <div className="config-section">
        <button className="section-header" onClick={() => toggleSection('labels')}>
          <div className="section-header-title">Label Items (3)</div>
          {expandedSection === 'labels' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expandedSection === 'labels' && (
          <div className="section-content">
            <div className="cards-list">
              {labelItems.map((item, index) => (
                <div key={item.id} className="card-item">
                  <div className="card-item-header">
                    <span className="card-item-title">Label Item {index + 1}</span>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Label 1</label>
                      <input
                        type="text"
                        className="form-input"
                        value={item.label1}
                        onChange={(e) => updateLabelItem(item.id, 'label1', e.target.value)}
                        placeholder="Enter label 1"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Label 2</label>
                      <input
                        type="text"
                        className="form-input"
                        value={item.label2}
                        onChange={(e) => updateLabelItem(item.id, 'label2', e.target.value)}
                        placeholder="Enter label 2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bubbles */}
      <div className="config-section">
        <button className="section-header" onClick={() => toggleSection('bubbles')}>
          <div className="section-header-title">Bubbles (5)</div>
          {expandedSection === 'bubbles' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expandedSection === 'bubbles' && (
          <div className="section-content">
            <div className="cards-list">
              {bubbles.map((bubble, index) => (
                <div key={bubble.id} className="card-item">
                  <div className="card-item-header">
                    <span className="card-item-title">Bubble {index + 1}</span>
                  </div>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label className="form-label">Image</label>
                      <div className="image-preview-container" style={{ height: '100px' }}>
                        {bubble.image ? (
                          <img src={bubble.image} alt={`Bubble ${index + 1}`} className="image-preview" />
                        ) : (
                          <div className="image-placeholder">No image</div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="btn-secondary select-image-btn"
                        onClick={() => handleSelectImage(`bubble-${bubble.id}`)}
                      >
                        Select Image
                      </button>
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">Description</label>
                      <input
                        type="text"
                        className="form-input"
                        value={bubble.description}
                        onChange={(e) => updateBubble(bubble.id, 'description', e.target.value)}
                        placeholder="Enter description"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-input"
                        value={bubble.location}
                        onChange={(e) => updateBubble(bubble.id, 'location', e.target.value)}
                        placeholder="Enter location"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Time</label>
                      <input
                        type="text"
                        className="form-input"
                        value={bubble.time}
                        onChange={(e) => updateBubble(bubble.id, 'time', e.target.value)}
                        placeholder="Enter time"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="config-section">
        <button className="section-header" onClick={() => toggleSection('buttons')}>
          <div className="section-header-title">Buttons (3)</div>
          {expandedSection === 'buttons' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {expandedSection === 'buttons' && (
          <div className="section-content">
            <div className="cards-list">
              {buttons.map((btn, index) => (
                <div key={btn.id} className="card-item">
                  <div className="card-item-header">
                    <span className="card-item-title">Button {index + 1}</span>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Label</label>
                      <input
                        type="text"
                        className="form-input"
                        value={btn.label}
                        onChange={(e) => updateButton(btn.id, 'label', e.target.value)}
                        placeholder="Enter button label"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Link</label>
                      <input
                        type="text"
                        className="form-input"
                        value={btn.link}
                        onChange={(e) => updateButton(btn.id, 'link', e.target.value)}
                        placeholder="Enter button link"
                      />
                    </div>
                  </div>
                </div>
              ))}
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
          {saveStatus.status === 'saving' ? 'Saving...' : 'Save Hero Section'}
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
        onClose={() => {
          setIsImageKitOpen(false);
          setCurrentImageField(null);
        }}
        onSelect={handleImageSelected}
      />
    </div>
  );
};

export default HeroSection;
