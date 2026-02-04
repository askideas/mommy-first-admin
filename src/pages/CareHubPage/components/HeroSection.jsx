import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './CareHubSection.css';

const HeroSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState(null);
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [heroData, setHeroData] = useState({
    topLabel: 'CARE HUB',
    heading: 'Support for every stage of motherhood',
    mainImage: '',
    infoBubbles: [],
    buttons: [
      { id: 1, text: 'Care Guides', link: '#care-guides', backgroundColor: '#DC5F92', textColor: '#FFFFFF' },
      { id: 2, text: 'The Journal', link: '/journal', backgroundColor: '#FFFFFF', textColor: '#DC5F92' },
      { id: 3, text: 'Get Support', link: '/support', backgroundColor: '#DC2626', textColor: '#FFFFFF' }
    ]
  });
  const [savedHeroData, setSavedHeroData] = useState(null);

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
      const docRef = doc(db, 'carehubpage', 'herosection');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.heroData) {
          setHeroData(data.heroData);
          setSavedHeroData(data.heroData);
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
      setSaveStatus({ section: 'hero', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'hero', status: 'saving' });
      
      const docRef = doc(db, 'carehubpage', 'herosection');
      
      const dataToSave = {
        isEnabled,
        heroData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedHeroData({ ...heroData });
      
      setSaveStatus({ section: 'hero', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'hero', status: 'error' });
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
           JSON.stringify(heroData) !== JSON.stringify(savedHeroData);
  };

  const handleSelectImage = (field) => {
    setCurrentImageField(field);
    setIsImageKitOpen(true);
  };

  const handleImageSelected = (imageData) => {
    if (currentImageField === 'mainImage') {
      setHeroData(prev => ({ ...prev, mainImage: imageData.url }));
    } else if (currentImageField?.startsWith('bubble-')) {
      const bubbleId = parseInt(currentImageField.split('-')[1]);
      setHeroData(prev => ({
        ...prev,
        infoBubbles: prev.infoBubbles.map(bubble =>
          bubble.id === bubbleId ? { ...bubble, image: imageData.url } : bubble
        )
      }));
    }
    setIsImageKitOpen(false);
    setCurrentImageField(null);
  };

  const addInfoBubble = () => {
    const newBubble = {
      id: Date.now(),
      image: '',
      text: ''
    };
    setHeroData(prev => ({
      ...prev,
      infoBubbles: [...prev.infoBubbles, newBubble]
    }));
  };

  const removeInfoBubble = (bubbleId) => {
    setHeroData(prev => ({
      ...prev,
      infoBubbles: prev.infoBubbles.filter(bubble => bubble.id !== bubbleId)
    }));
  };

  const updateInfoBubble = (bubbleId, field, value) => {
    setHeroData(prev => ({
      ...prev,
      infoBubbles: prev.infoBubbles.map(bubble =>
        bubble.id === bubbleId ? { ...bubble, [field]: value } : bubble
      )
    }));
  };

  const updateButton = (buttonId, field, value) => {
    setHeroData(prev => ({
      ...prev,
      buttons: prev.buttons.map(btn =>
        btn.id === buttonId ? { ...btn, [field]: value } : btn
      )
    }));
  };

  return (
    <div className="carehub-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Hero Section Configuration</h2>
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

      {/* Basic Content */}
      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('content')}
        >
          <div className="section-header-title">Hero Content</div>
          {expandedSection === 'content' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'content' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Top Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={heroData.topLabel}
                  onChange={(e) => setHeroData(prev => ({ ...prev, topLabel: e.target.value }))}
                  placeholder="e.g., CARE HUB"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={heroData.heading}
                  onChange={(e) => setHeroData(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="e.g., Support for every stage of motherhood"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Main Image</label>
                <div className="image-preview-container">
                  {heroData.mainImage ? (
                    <img src={heroData.mainImage} alt="Hero" className="image-preview" />
                  ) : (
                    <div className="image-placeholder">No image selected</div>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-secondary select-image-btn"
                  onClick={() => handleSelectImage('mainImage')}
                >
                  Select Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Bubbles */}
      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('bubbles')}
        >
          <div className="section-header-title">Info Bubbles</div>
          {expandedSection === 'bubbles' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'bubbles' && (
          <div className="section-content">
            <div className="cards-list">
              {heroData.infoBubbles.map((bubble, index) => (
                <div key={bubble.id} className="card-item">
                  <div className="card-item-header">
                    <span className="card-item-title">Bubble {index + 1}</span>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => removeInfoBubble(bubble.id)}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label className="form-label">Bubble Image</label>
                      <div className="image-preview-container" style={{ height: '120px' }}>
                        {bubble.image ? (
                          <img src={bubble.image} alt="Bubble" className="image-preview" />
                        ) : (
                          <div className="image-placeholder">No image selected</div>
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
                      <label className="form-label">Bubble Text</label>
                      <textarea
                        className="form-textarea"
                        rows={2}
                        value={bubble.text}
                        onChange={(e) => updateInfoBubble(bubble.id, 'text', e.target.value)}
                        placeholder="Enter bubble text..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn-secondary add-item-btn"
              onClick={addInfoBubble}
            >
              <Plus size={16} />
              Add Info Bubble
            </button>
          </div>
        )}
      </div>

      {/* CTA Buttons */}
      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('buttons')}
        >
          <div className="section-header-title">CTA Buttons</div>
          {expandedSection === 'buttons' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'buttons' && (
          <div className="section-content">
            <div className="cards-list">
              {heroData.buttons.map((button, index) => (
                <div key={button.id} className="card-item">
                  <div className="card-item-header">
                    <span className="card-item-title">Button {index + 1}</span>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Button Text</label>
                      <input
                        type="text"
                        className="form-input"
                        value={button.text}
                        onChange={(e) => updateButton(button.id, 'text', e.target.value)}
                        placeholder="e.g., Care Guides"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Button Link</label>
                      <input
                        type="text"
                        className="form-input"
                        value={button.link}
                        onChange={(e) => updateButton(button.id, 'link', e.target.value)}
                        placeholder="e.g., #care-guides"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Background Color</label>
                      <div className="color-input-group">
                        <input
                          type="color"
                          className="color-picker"
                          value={button.backgroundColor}
                          onChange={(e) => updateButton(button.id, 'backgroundColor', e.target.value)}
                        />
                        <input
                          type="text"
                          className="form-input"
                          value={button.backgroundColor}
                          onChange={(e) => updateButton(button.id, 'backgroundColor', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Text Color</label>
                      <div className="color-input-group">
                        <input
                          type="color"
                          className="color-picker"
                          value={button.textColor}
                          onChange={(e) => updateButton(button.id, 'textColor', e.target.value)}
                        />
                        <input
                          type="text"
                          className="form-input"
                          value={button.textColor}
                          onChange={(e) => updateButton(button.id, 'textColor', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Save Section */}
      <div className="section-actions">
        <button
          className="btn-primary"
          onClick={saveToFirebase}
          disabled={loading || !hasUnsavedChanges()}
        >
          {saveStatus.section === 'hero' && saveStatus.status === 'saving'
            ? 'Saving...'
            : 'Save Hero Section'}
        </button>
        {saveStatus.section === 'hero' && saveStatus.status === 'success' && (
          <span className="save-status success">Saved successfully!</span>
        )}
        {saveStatus.section === 'hero' && saveStatus.status === 'error' && (
          <span className="save-status error">Error saving data</span>
        )}
      </div>

      <ImageKitBrowser
        isOpen={isImageKitOpen}
        onClose={() => {
          setIsImageKitOpen(false);
          setCurrentImageField(null);
        }}
        onSelectImage={handleImageSelected}
      />
    </div>
  );
};

export default HeroSection;
