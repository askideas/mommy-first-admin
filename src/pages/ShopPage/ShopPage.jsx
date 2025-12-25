import { useState } from 'react';
import { Upload, Save, Plus, Edit2, Trash2, X } from 'lucide-react';
import './ShopPage.css';

const ShopPage = () => {
  const [activeTab, setActiveTab] = useState('hero');
  
  // Hero section state
  const [heroImage, setHeroImage] = useState('');
  const [heroText, setHeroText] = useState('');
  
  // Espots section state
  const [espots, setEspots] = useState([]);
  const [showEspotForm, setShowEspotForm] = useState(false);
  const [editingEspot, setEditingEspot] = useState(null);
  const [espotForm, setEspotForm] = useState({ index: '', image: '' });

  // Hero handlers
  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveHero = () => {
    console.log('Hero saved:', { heroImage, heroText });
    alert('Hero section saved successfully!');
  };

  // Espot handlers
  const handleAddEspotClick = () => {
    setShowEspotForm(true);
    setEditingEspot(null);
    setEspotForm({ index: '', image: '' });
  };

  const handleEspotImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEspotForm({ ...espotForm, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEspot = () => {
    if (!espotForm.index || !espotForm.image) {
      alert('Please fill in all fields');
      return;
    }

    if (editingEspot !== null) {
      // Update existing espot
      const updatedEspots = [...espots];
      updatedEspots[editingEspot] = { ...espotForm };
      setEspots(updatedEspots);
    } else {
      // Add new espot
      setEspots([...espots, { ...espotForm }]);
    }

    setShowEspotForm(false);
    setEspotForm({ index: '', image: '' });
    setEditingEspot(null);
  };

  const handleEditEspot = (index) => {
    setEditingEspot(index);
    setEspotForm({ ...espots[index] });
    setShowEspotForm(true);
  };

  const handleDeleteEspot = (index) => {
    if (window.confirm('Are you sure you want to delete this espot?')) {
      setEspots(espots.filter((_, i) => i !== index));
    }
  };

  const handleCancelEspot = () => {
    setShowEspotForm(false);
    setEspotForm({ index: '', image: '' });
    setEditingEspot(null);
  };

  return (
    <div className="shop-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Shop Page</h1>
          <p className="page-subtitle">Manage shop page content</p>
        </div>
      </div>

      <div className="shop-tabs">
        <button
          className={`tab-button ${activeTab === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveTab('hero')}
        >
          Hero
        </button>
        <button
          className={`tab-button ${activeTab === 'espots' ? 'active' : ''}`}
          onClick={() => setActiveTab('espots')}
        >
          Espots
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'hero' && (
          <div className="hero-section">
            <h2 className="section-title">Hero Configuration</h2>
            
            <div className="form-group">
              <label className="form-label">Hero Image</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageChange}
                  className="file-input"
                  id="hero-image"
                />
                <label htmlFor="hero-image" className="upload-button">
                  <Upload size={18} />
                  <span>Choose Image</span>
                </label>
                {heroImage && (
                  <div className="image-preview">
                    <img src={heroImage} alt="Hero" />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Hero Text</label>
              <textarea
                className="text-input"
                rows="4"
                value={heroText}
                onChange={(e) => setHeroText(e.target.value)}
                placeholder="Enter hero text..."
              />
            </div>

            <button className="save-button" onClick={handleSaveHero}>
              <Save size={18} />
              <span>Save Hero</span>
            </button>
          </div>
        )}

        {activeTab === 'espots' && (
          <div className="espots-section">
            <div className="section-header">
              <h2 className="section-title">Espots</h2>
              {!showEspotForm && (
                <button className="add-button" onClick={handleAddEspotClick}>
                  <Plus size={18} />
                  <span>Add Item</span>
                </button>
              )}
            </div>

            {showEspotForm && (
              <div className="espot-form">
                <div className="form-header">
                  <h3>{editingEspot !== null ? 'Edit Espot' : 'Add New Espot'}</h3>
                  <button className="close-button" onClick={handleCancelEspot}>
                    <X size={18} />
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Index</label>
                  <input
                    type="number"
                    className="number-input"
                    value={espotForm.index}
                    onChange={(e) => setEspotForm({ ...espotForm, index: e.target.value })}
                    placeholder="Enter index number..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEspotImageChange}
                      className="file-input"
                      id="espot-image"
                    />
                    <label htmlFor="espot-image" className="upload-button">
                      <Upload size={18} />
                      <span>Choose Image</span>
                    </label>
                    {espotForm.image && (
                      <div className="image-preview">
                        <img src={espotForm.image} alt="Espot" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button className="cancel-button" onClick={handleCancelEspot}>
                    Cancel
                  </button>
                  <button className="save-button" onClick={handleSaveEspot}>
                    <Save size={18} />
                    <span>Save Espot</span>
                  </button>
                </div>
              </div>
            )}

            <div className="espots-list">
              {espots.length === 0 ? (
                <div className="empty-state">
                  <p>No espots added yet. Click "Add Item" to create one.</p>
                </div>
              ) : (
                <div className="espots-grid">
                  {espots.map((espot, index) => (
                    <div key={index} className="espot-card">
                      <div className="espot-image">
                        <img src={espot.image} alt={`Espot ${espot.index}`} />
                      </div>
                      <div className="espot-info">
                        <span className="espot-index">Index: {espot.index}</span>
                      </div>
                      <div className="espot-actions">
                        <button
                          className="edit-button"
                          onClick={() => handleEditEspot(index)}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteEspot(index)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
