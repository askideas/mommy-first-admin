import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './AffiliateSection.css';

const ProgramFeaturesSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [featuresData, setFeaturesData] = useState({
    features: []
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

  const addFeature = () => {
    const newFeature = {
      id: Date.now(),
      icon: '🎯',
      iconBackgroundColor: '#FFE8F0',
      title: '',
      description: '',
      points: []
    };
    setFeaturesData(prev => ({
      ...prev,
      features: [...prev.features, newFeature]
    }));
  };

  const removeFeature = (featureId) => {
    setFeaturesData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature.id !== featureId)
    }));
  };

  const updateFeature = (featureId, field, value) => {
    setFeaturesData(prev => ({
      ...prev,
      features: prev.features.map(feature =>
        feature.id === featureId ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const addPoint = (featureId) => {
    setFeaturesData(prev => ({
      ...prev,
      features: prev.features.map(feature =>
        feature.id === featureId 
          ? { ...feature, points: [...feature.points, { id: Date.now(), text: '' }] }
          : feature
      )
    }));
  };

  const removePoint = (featureId, pointId) => {
    setFeaturesData(prev => ({
      ...prev,
      features: prev.features.map(feature =>
        feature.id === featureId 
          ? { ...feature, points: feature.points.filter(p => p.id !== pointId) }
          : feature
      )
    }));
  };

  const updatePoint = (featureId, pointId, value) => {
    setFeaturesData(prev => ({
      ...prev,
      features: prev.features.map(feature =>
        feature.id === featureId 
          ? { 
              ...feature, 
              points: feature.points.map(p => 
                p.id === pointId ? { ...p, text: value } : p
              ) 
            }
          : feature
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
          <div className="section-header-title">Feature Cards ({featuresData.features.length})</div>
          {expandedSection === 'features' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'features' && (
          <div className="section-content">
            <div className="cards-list">
              {featuresData.features.map((feature, index) => (
                <div key={feature.id} className="card-item">
                  <div className="card-item-header">
                    <span className="card-item-title">Feature {index + 1}</span>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => removeFeature(feature.id)}
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
                        value={feature.icon}
                        onChange={(e) => updateFeature(feature.id, 'icon', e.target.value)}
                        placeholder="e.g., 🎯"
                        maxLength={2}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Icon Background Color</label>
                      <div className="color-input-group">
                        <input
                          type="color"
                          className="color-picker"
                          value={feature.iconBackgroundColor}
                          onChange={(e) => updateFeature(feature.id, 'iconBackgroundColor', e.target.value)}
                        />
                        <input
                          type="text"
                          className="form-input"
                          value={feature.iconBackgroundColor}
                          onChange={(e) => updateFeature(feature.id, 'iconBackgroundColor', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Feature Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={feature.title}
                        onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                        placeholder="Enter feature title..."
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-textarea"
                        rows={2}
                        value={feature.description}
                        onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                        placeholder="Enter description..."
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Feature Points</label>
                      {feature.points.map((point, pIndex) => (
                        <div key={point.id} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <input
                            type="text"
                            className="form-input"
                            value={point.text}
                            onChange={(e) => updatePoint(feature.id, point.id, e.target.value)}
                            placeholder={`Point ${pIndex + 1}`}
                            style={{ flex: 1 }}
                          />
                          <button
                            type="button"
                            className="btn-danger"
                            onClick={() => removePoint(feature.id, point.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => addPoint(feature.id)}
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

            <button
              type="button"
              className="btn-secondary add-item-btn"
              onClick={addFeature}
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
