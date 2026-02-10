import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './AffiliateSection.css';

const WhyBecomeSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  const [activeImagePicker, setActiveImagePicker] = useState(null);
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [sectionData, setSectionData] = useState({
    heading: 'Why Become an Influencing Figure?',
    buttonLabel: '',
    buttonText: '',
    cards: [
      { id: 1, image: '', heading: '', description: '' },
      { id: 2, image: '', heading: '', description: '' },
      { id: 3, image: '', heading: '', description: '' }
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
      const docRef = doc(db, 'affiliatemarketingpage', 'whybecome');
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

  const saveToFirebase = async () => {
    if (!db) {
      console.error('Firebase not initialized');
      setSaveStatus({ section: 'why', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'why', status: 'saving' });
      
      const docRef = doc(db, 'affiliatemarketingpage', 'whybecome');
      
      const dataToSave = {
        isEnabled,
        sectionData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedSectionData({ ...sectionData });
      
      setSaveStatus({ section: 'why', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'why', status: 'error' });
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
           JSON.stringify(sectionData) !== JSON.stringify(savedSectionData);
  };

  const updateCard = (cardId, field, value) => {
    setSectionData(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === cardId ? { ...card, [field]: value } : card
      )
    }));
  };

  return (
    <div className="affiliate-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Why Become Configuration</h2>
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
                <label className="form-label">Section Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={sectionData.heading}
                  onChange={(e) => setSectionData(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="e.g., Why Become an Influencing Figure?"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={sectionData.buttonLabel}
                  onChange={(e) => setSectionData(prev => ({ ...prev, buttonLabel: e.target.value }))}
                  placeholder="e.g., Learn More"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={sectionData.buttonText}
                  onChange={(e) => setSectionData(prev => ({ ...prev, buttonText: e.target.value }))}
                  placeholder="e.g., Get Started"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('cards')}
        >
          <div className="section-header-title">Feature Cards (3)</div>
          {expandedSection === 'cards' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'cards' && (
          <div className="section-content">
            <div className="cards-list">
              {sectionData.cards.map((card, index) => (
                <div key={card.id} className="card-item">
                  <div className="card-item-header">
                    <span className="card-item-title">Card {index + 1}</span>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label className="form-label">Card Image</label>
                      <div className="image-upload-group">
                        {card.image && (
                          <img src={card.image} alt={`Card ${index + 1}`} className="preview-image" />
                        )}
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setActiveImagePicker(card.id)}
                        >
                          {card.image ? 'Change Image' : 'Select Image'}
                        </button>
                        {card.image && (
                          <button
                            type="button"
                            className="btn-danger"
                            onClick={() => updateCard(card.id, 'image', '')}
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
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-textarea"
                        rows={3}
                        value={card.description}
                        onChange={(e) => updateCard(card.id, 'description', e.target.value)}
                        placeholder="Enter description..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <ImageKitBrowser
              isOpen={activeImagePicker !== null}
              onSelect={(url) => {
                updateCard(activeImagePicker, 'image', url);
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
          {saveStatus.section === 'why' && saveStatus.status === 'saving'
            ? 'Saving...'
            : 'Save Why Become Section'}
        </button>
        {saveStatus.section === 'why' && saveStatus.status === 'success' && (
          <span className="save-status success">Saved successfully!</span>
        )}
        {saveStatus.section === 'why' && saveStatus.status === 'error' && (
          <span className="save-status error">Error saving data</span>
        )}
      </div>
    </div>
  );
};

export default WhyBecomeSection;
