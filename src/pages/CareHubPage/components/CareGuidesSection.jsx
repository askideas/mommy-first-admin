import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './CareHubSection.css';

const CareGuidesSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [guidesData, setGuidesData] = useState({
    sectionTitle: 'Care Guides',
    sectionDescription: 'Research-led, consultant-grade, expert-led educational and clinically-validated resources by Mommy First™',
    guides: []
  });
  const [savedGuidesData, setSavedGuidesData] = useState(null);

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
      const docRef = doc(db, 'carehubpage', 'careguides');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.guidesData) {
          setGuidesData(data.guidesData);
          setSavedGuidesData(data.guidesData);
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
      setSaveStatus({ section: 'guides', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'guides', status: 'saving' });
      
      const docRef = doc(db, 'carehubpage', 'careguides');
      
      const dataToSave = {
        isEnabled,
        guidesData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedGuidesData({ ...guidesData });
      
      setSaveStatus({ section: 'guides', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'guides', status: 'error' });
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
           JSON.stringify(guidesData) !== JSON.stringify(savedGuidesData);
  };

  const addGuide = () => {
    const newGuide = {
      id: Date.now(),
      tag: 'FREE',
      tagColor: '#4CAF50',
      badge: 'Full Download',
      badgeColor: '#E8F5E9',
      title: '',
      description: '',
      buttonText: 'Shop for $0.00',
      buttonLink: '#'
    };
    setGuidesData(prev => ({
      ...prev,
      guides: [...prev.guides, newGuide]
    }));
  };

  const removeGuide = (guideId) => {
    setGuidesData(prev => ({
      ...prev,
      guides: prev.guides.filter(guide => guide.id !== guideId)
    }));
  };

  const updateGuide = (guideId, field, value) => {
    setGuidesData(prev => ({
      ...prev,
      guides: prev.guides.map(guide =>
        guide.id === guideId ? { ...guide, [field]: value } : guide
      )
    }));
  };

  return (
    <div className="carehub-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Care Guides Configuration</h2>
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

      {/* Section Info */}
      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('section-info')}
        >
          <div className="section-header-title">Section Information</div>
          {expandedSection === 'section-info' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'section-info' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Section Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={guidesData.sectionTitle}
                  onChange={(e) => setGuidesData(prev => ({ ...prev, sectionTitle: e.target.value }))}
                  placeholder="e.g., Care Guides"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Section Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={guidesData.sectionDescription}
                  onChange={(e) => setGuidesData(prev => ({ ...prev, sectionDescription: e.target.value }))}
                  placeholder="Enter description..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Guide Cards */}
      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('guides')}
        >
          <div className="section-header-title">Guide Cards ({guidesData.guides.length})</div>
          {expandedSection === 'guides' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'guides' && (
          <div className="section-content">
            <div className="cards-list">
              {guidesData.guides.map((guide, index) => (
                <div key={guide.id} className="card-item">
                  <div className="card-item-header">
                    <span className="card-item-title">Guide {index + 1}</span>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => removeGuide(guide.id)}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Tag Text</label>
                      <input
                        type="text"
                        className="form-input"
                        value={guide.tag}
                        onChange={(e) => updateGuide(guide.id, 'tag', e.target.value)}
                        placeholder="e.g., FREE"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tag Color</label>
                      <div className="color-input-group">
                        <input
                          type="color"
                          className="color-picker"
                          value={guide.tagColor}
                          onChange={(e) => updateGuide(guide.id, 'tagColor', e.target.value)}
                        />
                        <input
                          type="text"
                          className="form-input"
                          value={guide.tagColor}
                          onChange={(e) => updateGuide(guide.id, 'tagColor', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Badge Text</label>
                      <input
                        type="text"
                        className="form-input"
                        value={guide.badge}
                        onChange={(e) => updateGuide(guide.id, 'badge', e.target.value)}
                        placeholder="e.g., Full Download"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Badge Color</label>
                      <div className="color-input-group">
                        <input
                          type="color"
                          className="color-picker"
                          value={guide.badgeColor}
                          onChange={(e) => updateGuide(guide.id, 'badgeColor', e.target.value)}
                        />
                        <input
                          type="text"
                          className="form-input"
                          value={guide.badgeColor}
                          onChange={(e) => updateGuide(guide.id, 'badgeColor', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Guide Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={guide.title}
                        onChange={(e) => updateGuide(guide.id, 'title', e.target.value)}
                        placeholder="e.g., Ultimate Postpartum Recovery Guide"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-textarea"
                        rows={2}
                        value={guide.description}
                        onChange={(e) => updateGuide(guide.id, 'description', e.target.value)}
                        placeholder="e.g., (0-6 Weeks)"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Button Text</label>
                      <input
                        type="text"
                        className="form-input"
                        value={guide.buttonText}
                        onChange={(e) => updateGuide(guide.id, 'buttonText', e.target.value)}
                        placeholder="e.g., Shop for $0.00"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Button Link</label>
                      <input
                        type="text"
                        className="form-input"
                        value={guide.buttonLink}
                        onChange={(e) => updateGuide(guide.id, 'buttonLink', e.target.value)}
                        placeholder="e.g., /guides/postpartum-recovery"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn-secondary add-item-btn"
              onClick={addGuide}
            >
              <Plus size={16} />
              Add Guide Card
            </button>
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
          {saveStatus.section === 'guides' && saveStatus.status === 'saving'
            ? 'Saving...'
            : 'Save Care Guides Section'}
        </button>
        {saveStatus.section === 'guides' && saveStatus.status === 'success' && (
          <span className="save-status success">Saved successfully!</span>
        )}
        {saveStatus.section === 'guides' && saveStatus.status === 'error' && (
          <span className="save-status error">Error saving data</span>
        )}
      </div>
    </div>
  );
};

export default CareGuidesSection;
