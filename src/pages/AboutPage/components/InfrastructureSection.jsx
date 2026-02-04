import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Image, Plus, Trash2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './InfrastructureSection.css';

const InfrastructureSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  // ImageKit Browser Modal State
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  const [imageKitTarget, setImageKitTarget] = useState(null);
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  // Infrastructure Data State
  const [infrastructureData, setInfrastructureData] = useState({
    heading: 'The 4th Trimester Infrastructure',
    description: 'We empower expectant+3 mothers to achieve their breastfeeding+1 goals by providing the safest ways to prepare for the baby-led experience and infant nutrition for all medical patients.',
    mainImage: null,
    features: [
      {
        id: 1,
        icon: '🌸',
        title: 'Clinically Designed',
        description: 'Evidence-based products and tools designed for real-world use and support.'
      },
      {
        id: 2,
        icon: '✓',
        title: 'Safe & Reassurance',
        description: 'When you make feeding simple and easy you prepare the body and the bond between the mom and the baby.'
      },
      {
        id: 3,
        icon: '💗',
        title: 'Proven by Moms',
        description: 'Tested and validated by real mothers in real-world scenarios.'
      }
    ]
  });
  const [savedInfrastructureData, setSavedInfrastructureData] = useState(null);

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
        
        if (data.infrastructureData) {
          setInfrastructureData(data.infrastructureData);
          setSavedInfrastructureData(data.infrastructureData);
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
      setSaveStatus({ section: 'infrastructure', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'infrastructure', status: 'saving' });
      
      const docRef = doc(db, 'aboutpage', 'infrastructure');
      
      const dataToSave = {
        isEnabled,
        infrastructureData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedInfrastructureData({ ...infrastructureData });
      
      setSaveStatus({ section: 'infrastructure', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'infrastructure', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleImageSelect = (imageUrl) => {
    if (imageKitTarget === 'mainImage') {
      setInfrastructureData(prev => ({ ...prev, mainImage: imageUrl }));
    }
    setIsImageKitOpen(false);
    setImageKitTarget(null);
  };

  const openImageKitBrowser = (target) => {
    setImageKitTarget(target);
    setIsImageKitOpen(true);
  };

  const addFeature = () => {
    const newFeature = {
      id: Date.now(),
      icon: '✓',
      title: '',
      description: ''
    };
    setInfrastructureData(prev => ({
      ...prev,
      features: [...prev.features, newFeature]
    }));
  };

  const removeFeature = (index) => {
    setInfrastructureData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index, field, value) => {
    const updatedFeatures = [...infrastructureData.features];
    updatedFeatures[index][field] = value;
    setInfrastructureData(prev => ({ ...prev, features: updatedFeatures }));
  };

  const hasUnsavedChanges = () => {
    return isEnabled !== savedIsEnabled || 
           JSON.stringify(infrastructureData) !== JSON.stringify(savedInfrastructureData);
  };

  return (
    <div className="infrastructure-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">4th Trimester Infrastructure Configuration</h2>
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

      {/* Main Content Section */}
      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('main')}
        >
          <div className="section-header-title">Main Content</div>
          {expandedSection === 'main' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'main' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={infrastructureData.heading}
                  onChange={(e) => setInfrastructureData(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="e.g., The 4th Trimester Infrastructure"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={infrastructureData.description}
                  onChange={(e) => setInfrastructureData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description..."
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Main Image</label>
                <div className="image-upload-group">
                  {infrastructureData.mainImage && (
                    <div className="image-preview">
                      <img src={infrastructureData.mainImage} alt="Infrastructure" />
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => openImageKitBrowser('mainImage')}
                  >
                    <Image size={16} />
                    {infrastructureData.mainImage ? 'Change Image' : 'Select Image'}
                  </button>
                  {infrastructureData.mainImage && (
                    <button
                      type="button"
                      className="btn-text"
                      onClick={() => setInfrastructureData(prev => ({ ...prev, mainImage: null }))}
                    >
                      Remove Image
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('features')}
        >
          <div className="section-header-title">Features ({infrastructureData.features.length})</div>
          {expandedSection === 'features' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'features' && (
          <div className="section-content">
            {infrastructureData.features.map((feature, index) => (
              <div key={feature.id} className="feature-item">
                <div className="feature-item-header">
                  <span className="feature-label">Feature {index + 1}</span>
                  {infrastructureData.features.length > 1 && (
                    <button
                      className="icon-btn-danger"
                      onClick={() => removeFeature(index)}
                      title="Remove Feature"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Icon (Emoji)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={feature.icon}
                      onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                      placeholder="e.g., 🌸"
                      maxLength={2}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={feature.title}
                      onChange={(e) => updateFeature(index, 'title', e.target.value)}
                      placeholder="e.g., Clinically Designed"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={feature.description}
                      onChange={(e) => updateFeature(index, 'description', e.target.value)}
                      placeholder="Enter feature description..."
                    />
                  </div>
                </div>
              </div>
            ))}

            <button className="btn-add-item" onClick={addFeature}>
              <Plus size={18} />
              Add Feature
            </button>
          </div>
        )}
      </div>

      {/* Save Section */}
      <div className="save-section">
        <button
          className="btn-primary"
          onClick={saveToFirebase}
          disabled={loading || !hasUnsavedChanges()}
        >
          {saveStatus.section === 'infrastructure' && saveStatus.status === 'saving'
            ? 'Saving...'
            : 'Save Infrastructure Section'}
        </button>
        {saveStatus.section === 'infrastructure' && saveStatus.status === 'success' && (
          <span className="save-status success">Saved successfully!</span>
        )}
        {saveStatus.section === 'infrastructure' && saveStatus.status === 'error' && (
          <span className="save-status error">Error saving data</span>
        )}
      </div>

      {/* ImageKit Browser Modal */}
      <ImageKitBrowser
        isOpen={isImageKitOpen}
        onSelect={handleImageSelect}
        onClose={() => {
          setIsImageKitOpen(false);
          setImageKitTarget(null);
        }}
      />
    </div>
  );
};

export default InfrastructureSection;
