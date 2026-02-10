import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './DonationSection.css';

const MeaningfulImpactSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [impactData, setImpactData] = useState({
    authorName: 'Sarah Azikwe',
    role: 'Meaningful Impact',
    description: '',
    images: []
  });
  const [savedImpactData, setSavedImpactData] = useState(null);

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
      const docRef = doc(db, 'donationpage', 'meaningfulimpact');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.impactData) {
          setImpactData(data.impactData);
          setSavedImpactData(data.impactData);
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
      setSaveStatus({ section: 'impact', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'impact', status: 'saving' });
      
      const docRef = doc(db, 'donationpage', 'meaningfulimpact');
      
      const dataToSave = {
        isEnabled,
        impactData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedImpactData({ ...impactData });
      
      setSaveStatus({ section: 'impact', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'impact', status: 'error' });
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
           JSON.stringify(impactData) !== JSON.stringify(savedImpactData);
  };

  const handleSelectImage = (index) => {
    setCurrentImageIndex(index);
    setIsImageKitOpen(true);
  };

  const handleImageSelected = (imageUrl) => {
    if (currentImageIndex !== null) {
      setImpactData(prev => ({
        ...prev,
        images: prev.images.map((img, idx) =>
          idx === currentImageIndex ? { ...img, url: imageUrl } : img
        )
      }));
    }
    setIsImageKitOpen(false);
    setCurrentImageIndex(null);
  };

  const addImage = () => {
    setImpactData(prev => ({
      ...prev,
      images: [...prev.images, { id: Date.now(), url: '' }]
    }));
  };

  const removeImage = (imageId) => {
    setImpactData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  return (
    <div className="donation-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Meaningful Impact Configuration</h2>
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
              <div className="form-group">
                <label className="form-label">Author Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={impactData.authorName}
                  onChange={(e) => setImpactData(prev => ({ ...prev, authorName: e.target.value }))}
                  placeholder="e.g., Sarah Azikwe"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role/Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={impactData.role}
                  onChange={(e) => setImpactData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Meaningful Impact"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={impactData.description}
                  onChange={(e) => setImpactData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter impact story or description..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('images')}
        >
          <div className="section-header-title">Impact Images ({impactData.images.length})</div>
          {expandedSection === 'images' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'images' && (
          <div className="section-content">
            <div className="cards-list">
              {impactData.images.map((image, index) => (
                <div key={image.id} className="card-item">
                  <div className="card-item-header">
                    <span className="card-item-title">Image {index + 1}</span>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => removeImage(image.id)}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                  
                  <div className="form-group full-width">
                    <div className="image-preview-container">
                      {image.url ? (
                        <img src={image.url} alt={`Impact ${index + 1}`} className="image-preview" />
                      ) : (
                        <div className="image-placeholder">No image selected</div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn-secondary select-image-btn"
                      onClick={() => handleSelectImage(index)}
                    >
                      Select Image
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn-secondary add-item-btn"
              onClick={addImage}
            >
              <Plus size={16} />
              Add Image
            </button>
          </div>
        )}
      </div>

      <div className="section-actions">
        <button
          className="btn-primary"
          onClick={saveToFirebase}
          disabled={loading || !hasUnsavedChanges()}
        >
          {saveStatus.section === 'impact' && saveStatus.status === 'saving'
            ? 'Saving...'
            : 'Save Meaningful Impact Section'}
        </button>
        {saveStatus.section === 'impact' && saveStatus.status === 'success' && (
          <span className="save-status success">Saved successfully!</span>
        )}
        {saveStatus.section === 'impact' && saveStatus.status === 'error' && (
          <span className="save-status error">Error saving data</span>
        )}
      </div>

      <ImageKitBrowser
        isOpen={isImageKitOpen}
        onClose={() => {
          setIsImageKitOpen(false);
          setCurrentImageIndex(null);
        }}
        onSelect={handleImageSelected}
      />
    </div>
  );
};

export default MeaningfulImpactSection;
