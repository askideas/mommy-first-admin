import { useState, useEffect } from 'react';
import { Image } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './AboutSection.css';

const InfrastructureSection = () => {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  const [imageKitTarget, setImageKitTarget] = useState(null);
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [sectionData, setSectionData] = useState({
    heading: '',
    description: '',
    image: null,
    cards: [
      { iconImage: null, heading: '', description: '' },
      { iconImage: null, heading: '', description: '' },
      { iconImage: null, heading: '', description: '' }
    ]
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
      const docRef = doc(db, 'aboutpage', 'infrastructure');
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

  const handleCardChange = (index, field, value) => {
    setSectionData(prev => {
      const newCards = [...prev.cards];
      newCards[index] = { ...newCards[index], [field]: value };
      return { ...prev, cards: newCards };
    });
  };

  const openImageKitBrowser = (target) => {
    setImageKitTarget(target);
    setIsImageKitOpen(true);
  };

  const handleImageKitSelect = (imageUrl) => {
    if (imageKitTarget === 'mainImage') {
      setSectionData(prev => ({ ...prev, image: imageUrl }));
    } else if (imageKitTarget?.startsWith('card-')) {
      const index = parseInt(imageKitTarget.split('-')[1]);
      handleCardChange(index, 'iconImage', imageUrl);
    }
    setIsImageKitOpen(false);
    setImageKitTarget(null);
  };

  const removeImage = (target) => {
    if (target === 'mainImage') {
      setSectionData(prev => ({ ...prev, image: null }));
    } else if (target?.startsWith('card-')) {
      const index = parseInt(target.split('-')[1]);
      handleCardChange(index, 'iconImage', null);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveStatus('saving');
      
      const docRef = doc(db, 'aboutpage', 'infrastructure');
      
      await setDoc(docRef, {
        isEnabled: isEnabled,
        sectionData: sectionData
      });
      
      setSavedIsEnabled(isEnabled);
      setSavedSectionData(JSON.parse(JSON.stringify(sectionData)));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Error saving infrastructure section:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEnabled(savedIsEnabled);
    if (savedSectionData) {
      setSectionData(JSON.parse(JSON.stringify(savedSectionData)));
    } else {
      setSectionData({
        heading: '',
        description: '',
        image: null,
        cards: [
          { iconImage: null, heading: '', description: '' },
          { iconImage: null, heading: '', description: '' },
          { iconImage: null, heading: '', description: '' }
        ]
      });
    }
  };

  return (
    <div className="about-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Infrastructure Section Configuration</h2>
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

          {/* Main Image */}
          <div className="form-group">
            <label className="form-label">Image</label>
            <div className="image-upload-area">
              {sectionData.image ? (
                <div className="image-selected-container">
                  <div className="image-preview">
                    <img src={sectionData.image} alt="Infrastructure" />
                  </div>
                  <div className="image-actions">
                    <button 
                      type="button"
                      className="btn-change"
                      onClick={() => openImageKitBrowser('mainImage')}
                    >
                      Change
                    </button>
                    <button 
                      type="button"
                      className="btn-remove"
                      onClick={() => removeImage('mainImage')}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  type="button"
                  className="choose-image-btn"
                  onClick={() => openImageKitBrowser('mainImage')}
                >
                  <Image size={24} />
                  <span>Choose Image</span>
                </button>
              )}
            </div>
          </div>

          {/* Cards Section */}
          <div className="form-group">
            <label className="form-label">Cards (3 Cards)</label>
            <div className="cards-grid cards-grid-3">
              {sectionData.cards.map((card, index) => (
                <div key={index} className="card-item">
                  <h4 className="card-item-title">Card {index + 1}</h4>
                  
                  {/* Icon Image */}
                  <div className="card-image-area">
                    {card.iconImage ? (
                      <div className="card-image-preview icon-preview">
                        <img src={card.iconImage} alt={`Card ${index + 1} Icon`} />
                        <div className="card-image-actions">
                          <button 
                            type="button"
                            className="btn-change-small"
                            onClick={() => openImageKitBrowser(`card-${index}`)}
                          >
                            Change
                          </button>
                          <button 
                            type="button"
                            className="btn-remove-small"
                            onClick={() => removeImage(`card-${index}`)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        type="button"
                        className="choose-image-btn-small icon-btn"
                        onClick={() => openImageKitBrowser(`card-${index}`)}
                      >
                        <Image size={18} />
                        <span>Choose Icon</span>
                      </button>
                    )}
                  </div>

                  {/* Card Heading */}
                  <div className="card-input-group">
                    <label className="card-input-label">Heading</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter heading"
                      value={card.heading}
                      onChange={(e) => handleCardChange(index, 'heading', e.target.value)}
                    />
                  </div>

                  {/* Card Description */}
                  <div className="card-input-group">
                    <label className="card-input-label">Description</label>
                    <textarea
                      className="form-textarea-small"
                      placeholder="Enter description"
                      rows={3}
                      value={card.description}
                      onChange={(e) => handleCardChange(index, 'description', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
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

      {/* ImageKit Browser Modal */}
      <ImageKitBrowser
        isOpen={isImageKitOpen}
        onClose={() => {
          setIsImageKitOpen(false);
          setImageKitTarget(null);
        }}
        onSelect={handleImageKitSelect}
      />
    </div>
  );
};

export default InfrastructureSection;
