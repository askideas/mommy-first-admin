import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import './ShopHeroSection.css';

const ShopHeroSection = () => {
  const [heroData, setHeroData] = useState({
    image: null,
    heading: ''
  });
  const [savedHeroData, setSavedHeroData] = useState(null);

  const handleHeadingChange = (value) => {
    setHeroData(prev => ({ ...prev, heading: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setHeroData(prev => ({ ...prev, image: null }));
  };

  const handleSave = () => {
    setSavedHeroData({ ...heroData });
    console.log('Shop Hero Data Saved:', heroData);
    // Add your API call here
  };

  const handleCancel = () => {
    if (savedHeroData) {
      setHeroData({ ...savedHeroData });
    } else {
      setHeroData({ image: null, heading: '' });
    }
  };

  return (
    <div className="shop-hero-container">
      <h2 className="section-main-title">Hero Section Configuration</h2>

      <div className="config-section">
        <div className="section-content-area">
          <div className="form-group">
            <label className="form-label">Image</label>
            <div className="image-upload-area">
              {heroData.image ? (
                <div className="image-preview">
                  <img src={heroData.image} alt="Shop Hero" />
                  <button 
                    className="remove-image-btn"
                    onClick={removeImage}
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
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Heading</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter heading"
              value={heroData.heading}
              onChange={(e) => handleHeadingChange(e.target.value)}
            />
          </div>

          <div className="section-actions">
            <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
            <button className="btn-save" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHeroSection;
