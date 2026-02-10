import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './AffiliateSection.css';

const ProgramFeaturesSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  const [activeImagePicker, setActiveImagePicker] = useState(null);
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [featuresData, setFeaturesData] = useState({
    cards: [
      { id: 1, heading: '', label: '', iconImage: '', points: [] },
      { id: 2, heading: '', label: '', iconImage: '', points: [] },
      { id: 3, heading: '', label: '', iconImage: '', points: [] }
    ]
  });
  const [savedFeaturesData, setSavedFeaturesData] = useState(null);

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
      const docRef = doc(db, 'affiliatemarketingpage', 'programfeatures');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.featuresData) {
          setFeaturesData(data.featuresData);
          setSavedFeaturesData(data.featuresData);
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
      setSaveStatus({ section: 'features', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'features', status: 'saving' });
      
      const docRef = doc(db, 'affiliatemarketingpage', 'programfeatures');
      
      const dataToSave = {
        isEnabled,
        featuresData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedFeaturesData({ ...featuresData });
      
      setSaveStatus({ section: 'features', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'features', status: 'error' });
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
           JSON.stringify(featuresData) !== JSON.stringify(savedFeaturesData);
  };

  const updateCard = (cardId, field, value) => {
    setFeaturesData(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === cardId ? { ...card, [field]: value } : card
      )
    }));
  };

  const addPoint = (cardId) => {
    setFeaturesData(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === cardId 
          ? { ...card, points: [...card.points, { id: Date.now(), text: '' }] }
          : card
      )
    }));
  };

  const removePoint = (cardId, pointId) => {
    setFeaturesData(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === cardId 
          ? { ...card, points: card.points.filter(p => p.id !== pointId) }
          : card
      )
    }));
  };

  const updatePoint = (cardId, pointId, value) => {
    setFeaturesData(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === cardId 
          ? { 
              ...card, 
              points: card.points.map(p => 
                p.id === pointId ? { ...p, text: value } : p
              ) 
            }
          : card
      )
    }));
  };

  return (
    <div className="affiliate-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Program Features Configuration</h2>
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
          onClick={() => toggleSection('features')}
        >
          <div className="section-header-title">Feature Cards (3)</div>
          {expandedSection === 'features' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'features' && (
          <div className="section-content">
            <div className="cards-list">
              {featuresData.cards.map((card, index) => (
                <div key={card.id} className="card-item">
                  <div className="card-item-header">
                    <span className="card-item-title">Card {index + 1}</span>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label className="form-label">Icon Image</label>
                      <div className="image-upload-group">
                        {card.iconImage && (
                          <img src={card.iconImage} alt={`Card ${index + 1} Icon`} className="preview-image" />
                        )}
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setActiveImagePicker(card.id)}
                        >
                          {card.iconImage ? 'Change Image' : 'Select Image'}
                        </button>
                        {card.iconImage && (
                          <button
                            type="button"
                            className="btn-danger"
                            onClick={() => updateCard(card.id, 'iconImage', '')}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Card Heading</label>
                      <input
                        type="text"
                        className="form-input"
                        value={card.heading}
                        onChange={(e) => updateCard(card.id, 'heading', e.target.value)}
                        placeholder="Enter card heading..."
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Card Label</label>
                      <input
                        type="text"
                        className="form-input"
                        value={card.label}
                        onChange={(e) => updateCard(card.id, 'label', e.target.value)}
                        placeholder="Enter card label..."
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Feature Points</label>
                      {card.points.map((point, pIndex) => (
                        <div key={point.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <input
                            type="text"
                            className="form-input"
                            value={point.text}
                            onChange={(e) => updatePoint(card.id, point.id, e.target.value)}
                            placeholder={`Point ${pIndex + 1}`}
                            style={{ flex: 1 }}
                          />
                          <button
                            type="button"
                            className="btn-danger"
                            onClick={() => removePoint(card.id, point.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => addPoint(card.id)}
                        style={{ marginTop: '8px' }}
                      >
                        <Plus size={16} />
                        Add Point
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <ImageKitBrowser
              isOpen={activeImagePicker !== null}
              onSelect={(url) => {
                updateCard(activeImagePicker, 'iconImage', url);
                setActiveImagePicker(null);
              }}
              onClose={() => setActiveImagePicker(null)}
            />
          </div>
        )}
      </div>

      <div className="section-actions">
        <button
          className="btn-primary"
          onClick={saveToFirebase}
          disabled={loading || !hasUnsavedChanges()}
        >
          {saveStatus.section === 'features' && saveStatus.status === 'saving'
            ? 'Saving...'
            : 'Save Program Features Section'}
        </button>
        {saveStatus.section === 'features' && saveStatus.status === 'success' && (
          <span className="save-status success">Saved successfully!</span>
        )}
        {saveStatus.section === 'features' && saveStatus.status === 'error' && (
          <span className="save-status error">Error saving data</span>
        )}
      </div>
    </div>
  );
};

export default ProgramFeaturesSection;
