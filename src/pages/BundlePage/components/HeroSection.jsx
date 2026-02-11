import { useState, useEffect } from 'react';
import { Image } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './BundleSection.css';

const HeroSection = () => {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  const [imageKitTarget, setImageKitTarget] = useState(null);
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [heroData, setHeroData] = useState({
    backgroundImage: null,
    label: '',
    heading: '',
    description: '',
    labelDescription: '',
    labels: [
      { image: null, label1: '', label2: '' },
      { image: null, label1: '', label2: '' },
      { image: null, label1: '', label2: '' },
      { image: null, label1: '', label2: '' }
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
      const docRef = doc(db, 'bundlepage', 'herosection');
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

  const handleInputChange = (field, value) => {
    setHeroData(prev => ({ ...prev, [field]: value }));
  };

  const handleLabelChange = (index, field, value) => {
    setHeroData(prev => {
      const newLabels = [...prev.labels];
      newLabels[index] = { ...newLabels[index], [field]: value };
      return { ...prev, labels: newLabels };
    });
  };

  const openImageKitBrowser = (target) => {
    setImageKitTarget(target);
    setIsImageKitOpen(true);
  };

  const handleImageKitSelect = (imageUrl) => {
    if (imageKitTarget === 'backgroundImage') {
      setHeroData(prev => ({ ...prev, backgroundImage: imageUrl }));
    } else if (imageKitTarget?.startsWith('label-')) {
      const index = parseInt(imageKitTarget.split('-')[1]);
      handleLabelChange(index, 'image', imageUrl);
    }
    setIsImageKitOpen(false);
    setImageKitTarget(null);
  };

  const removeImage = (target) => {
    if (target === 'backgroundImage') {
      setHeroData(prev => ({ ...prev, backgroundImage: null }));
    } else if (target?.startsWith('label-')) {
      const index = parseInt(target.split('-')[1]);
      handleLabelChange(index, 'image', null);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveStatus('saving');
      
      const docRef = doc(db, 'bundlepage', 'herosection');
      
      await setDoc(docRef, {
        isEnabled: isEnabled,
        heroData: heroData
      });
      
      setSavedIsEnabled(isEnabled);
      setSavedHeroData({ ...heroData });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Error saving hero data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEnabled(savedIsEnabled);
    if (savedHeroData) {
      setHeroData({ ...savedHeroData });
    } else {
      setHeroData({
        backgroundImage: null,
        label: '',
        heading: '',
        description: '',
        labelDescription: '',
        labels: [
          { image: null, label1: '', label2: '' },
          { image: null, label1: '', label2: '' },
          { image: null, label1: '', label2: '' },
          { image: null, label1: '', label2: '' }
        ]
      });
    }
  };

  return (
    <div className="bundle-section-container">
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

      <div className="config-section">
        <div className="section-content-area">
          {/* Background Image */}
          <div className="form-group">
            <label className="form-label">Background Image</label>
            <div className="image-upload-area">
              {heroData.backgroundImage ? (
                <div className="image-selected-container">
                  <div className="image-preview">
                    <img src={heroData.backgroundImage} alt="Background" />
                  </div>
                  <div className="image-actions">
                    <button 
                      type="button"
                      className="btn-change"
                      onClick={() => openImageKitBrowser('backgroundImage')}
                    >
                      Change
                    </button>
                    <button 
                      type="button"
                      className="btn-remove"
                      onClick={() => removeImage('backgroundImage')}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  type="button"
                  className="choose-image-btn"
                  onClick={() => openImageKitBrowser('backgroundImage')}
                >
                  <Image size={24} />
                  <span>Choose Background Image</span>
                </button>
              )}
            </div>
          </div>

          {/* Label */}
          <div className="form-group">
            <label className="form-label">Label</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter label"
              value={heroData.label}
              onChange={(e) => handleInputChange('label', e.target.value)}
            />
          </div>

          {/* Heading */}
          <div className="form-group">
            <label className="form-label">Heading</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter heading"
              value={heroData.heading}
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
              value={heroData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          {/* Label Description */}
          <div className="form-group">
            <label className="form-label">Label Description</label>
            <textarea
              className="form-textarea"
              placeholder="Enter label description"
              rows={3}
              value={heroData.labelDescription}
              onChange={(e) => handleInputChange('labelDescription', e.target.value)}
            />
          </div>

          {/* Labels Section */}
          <div className="form-group">
            <label className="form-label">Labels Section (4 Labels)</label>
            <div className="labels-grid">
              {heroData.labels.map((label, index) => (
                <div key={index} className="label-card">
                  <h4 className="label-card-title">Label {index + 1}</h4>
                  
                  {/* Label Image */}
                  <div className="label-image-area">
                    {label.image ? (
                      <div className="label-image-preview">
                        <img src={label.image} alt={`Label ${index + 1}`} />
                        <div className="label-image-actions">
                          <button 
                            type="button"
                            className="btn-change-small"
                            onClick={() => openImageKitBrowser(`label-${index}`)}
                          >
                            Change
                          </button>
                          <button 
                            type="button"
                            className="btn-remove-small"
                            onClick={() => removeImage(`label-${index}`)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        type="button"
                        className="choose-image-btn-small"
                        onClick={() => openImageKitBrowser(`label-${index}`)}
                      >
                        <Image size={18} />
                        <span>Choose Image</span>
                      </button>
                    )}
                  </div>

                  {/* Label 1 */}
                  <div className="label-input-group">
                    <label className="label-input-label">Label 1</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter label 1"
                      value={label.label1}
                      onChange={(e) => handleLabelChange(index, 'label1', e.target.value)}
                    />
                  </div>

                  {/* Label 2 */}
                  <div className="label-input-group">
                    <label className="label-input-label">Label 2</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter label 2"
                      value={label.label2}
                      onChange={(e) => handleLabelChange(index, 'label2', e.target.value)}
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

export default HeroSection;
