import { useState } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import './EspotConfiguration.css';

const EspotConfiguration = () => {
  const [espots, setEspots] = useState([]);
  const [savedEspots, setSavedEspots] = useState([]);

  const addEspot = () => {
    const newEspot = {
      id: Date.now(),
      index: '',
      image: null
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

  const handleImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEspots(espots.map(espot =>
          espot.id === id ? { ...espot, image: reader.result } : espot
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeEspotImage = (id) => {
    setEspots(espots.map(espot =>
      espot.id === id ? { ...espot, image: null } : espot
    ));
  };

  const handleSave = () => {
    setSavedEspots([...espots]);
    console.log('Espots Saved:', espots);
    // Add your API call here
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
                          <div className="image-preview">
                            <img src={espot.image} alt={`Espot ${espot.index}`} />
                            <button 
                              className="remove-image-btn"
                              onClick={() => removeEspotImage(espot.id)}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <label className="upload-label">
                            <Upload size={24} />
                            <span>Click to upload image</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(espot.id, e)}
                              style={{ display: 'none' }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="section-actions">
            <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EspotConfiguration;
