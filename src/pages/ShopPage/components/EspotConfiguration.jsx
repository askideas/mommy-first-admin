import { useState, useEffect } from 'react';
import { Plus, X, Image } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './EspotConfiguration.css';

const EspotConfiguration = () => {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  const [selectedEspotId, setSelectedEspotId] = useState(null);
  
  const [espots, setEspots] = useState([]);
  const [savedEspots, setSavedEspots] = useState([]);

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
      const docRef = doc(db, 'shoppage', 'espots');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.espots) {
          setEspots(data.espots);
          setSavedEspots(data.espots);
        }
      }
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEspot = () => {
    const newEspot = {
      id: Date.now(),
      index: '',
      image: null,
      link: ''
    };
    setEspots([...espots, newEspot]);
  };

  const removeEspot = (id) => {
    setEspots(espots.filter(espot => espot.id !== id));
  };

  const handleEspotChange = (id, field, value) => {
    setEspots(espots.map(espot =>
      espot.id === id ? { ...espot, [field]: value } : espot
    ));
  };

  const openImageKitBrowser = (espotId) => {
    setSelectedEspotId(espotId);
    setIsImageKitOpen(true);
  };

  const handleImageKitSelect = (imageUrl) => {
    if (selectedEspotId) {
      setEspots(espots.map(espot =>
        espot.id === selectedEspotId ? { ...espot, image: imageUrl } : espot
      ));
      setSelectedEspotId(null);
    }
  };

  const removeEspotImage = (id) => {
    setEspots(espots.map(espot =>
      espot.id === id ? { ...espot, image: null } : espot
    ));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveStatus('saving');
      
      const docRef = doc(db, 'shoppage', 'espots');
      
      await setDoc(docRef, {
        espots: espots
      });
      
      setSavedEspots([...espots]);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
      console.log('Espots Saved to Firebase:', espots);
    } catch (error) {
      console.error('Error saving espots:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (savedEspots.length > 0) {
      setEspots([...savedEspots]);
    } else {
      setEspots([]);
    }
  };

  return (
    <div className="espot-configuration-container">
      <h2 className="section-main-title">Espot Configuration</h2>

      <div className="config-section">
        <div className="section-header-static">
          <span className="section-header-title">Espots</span>
          <button className="btn-add-espot" onClick={addEspot}>
            <Plus size={18} />
            Add Espot
          </button>
        </div>

        <div className="section-content-area">
          {espots.length === 0 ? (
            <div className="empty-state-large">
              <p>No espots added yet. Click "Add Espot" to get started.</p>
            </div>
          ) : (
            <div className="espots-list">
              {espots.map((espot, idx) => (
                <div key={espot.id} className="espot-item">
                  <div className="espot-header">
                    <span className="espot-number">Espot {idx + 1}</span>
                    <button
                      className="btn-remove-espot"
                      onClick={() => removeEspot(espot.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="espot-fields">
                    <div className="form-group">
                      <label className="form-label">Index</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="Enter index number"
                        value={espot.index}
                        onChange={(e) => handleEspotChange(espot.id, 'index', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Image</label>
                      <div className="image-upload-area">
                        {espot.image ? (
                          <div className="image-selected-container">
                            <div className="image-preview">
                              <img src={espot.image} alt={`Espot ${espot.index}`} />
                            </div>
                            <div className="image-actions">
                              <button 
                                type="button"
                                className="btn-change"
                                onClick={() => openImageKitBrowser(espot.id)}
                              >
                                Change
                              </button>
                              <button 
                                type="button"
                                className="btn-remove"
                                onClick={() => removeEspotImage(espot.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            type="button"
                            className="choose-image-btn"
                            onClick={() => openImageKitBrowser(espot.id)}
                          >
                            <Image size={24} />
                            <span>Choose Image</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Redirection Link</label>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="Enter redirection URL (e.g., https://example.com or /page)"
                        value={espot.link || ''}
                        onChange={(e) => handleEspotChange(espot.id, 'link', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
          setSelectedEspotId(null);
        }}
        onSelect={handleImageKitSelect}
      />
    </div>
  );
};

export default EspotConfiguration;
