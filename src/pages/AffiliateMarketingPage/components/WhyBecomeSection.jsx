import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './AffiliateSection.css';

const WhyBecomeSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [sectionData, setSectionData] = useState({
    heading: 'Why Become an Influencing Figure?',
    cards: []
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

  const addCard = () => {
    const newCard = {
      id: Date.now(),
      icon: '📱',
      iconColor: '#DC5F92',
      title: '',
      description: ''
    };
    setSectionData(prev => ({
      ...prev,
      cards: [...prev.cards, newCard]
    }));
  };

  const removeCard = (cardId) => {
    setSectionData(prev => ({
      ...prev,
      cards: prev.cards.filter(card => card.id !== cardId)
    }));
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
          <div className="section-header-title">Section Heading</div>
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
            </div>
          </div>
        )}
      </div>

      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('cards')}
        >
          <div className="section-header-title">Feature Cards ({sectionData.cards.length})</div>
          {expandedSection === 'cards' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'cards' && (
          <div className="section-content">
            <div className="cards-list">
              {sectionData.cards.map((card, index) => (
                <div key={card.id} className="card-item">
                  <div className="card-item-header">
                    <span className="card-item-title">Card {index + 1}</span>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => removeCard(card.id)}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Icon (Emoji)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={card.icon}
                        onChange={(e) => updateCard(card.id, 'icon', e.target.value)}
                        placeholder="e.g., 📱"
                        maxLength={2}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Icon Color</label>
                      <div className="color-input-group">
                        <input
                          type="color"
                          className="color-picker"
                          value={card.iconColor}
                          onChange={(e) => updateCard(card.id, 'iconColor', e.target.value)}
                        />
                        <input
                          type="text"
                          className="form-input"
                          value={card.iconColor}
                          onChange={(e) => updateCard(card.id, 'iconColor', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Card Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={card.title}
                        onChange={(e) => updateCard(card.id, 'title', e.target.value)}
                        placeholder="Enter card title..."
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

            <button
              type="button"
              className="btn-secondary add-item-btn"
              onClick={addCard}
            >
              <Plus size={16} />
              Add Feature Card
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
