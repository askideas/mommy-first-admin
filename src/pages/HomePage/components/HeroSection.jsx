import { useState } from 'react';
import { ChevronDown, ChevronUp, Upload, X } from 'lucide-react';
import './HeroSection.css';

const HeroSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  
  // Left Side Section State
  const [leftSideData, setLeftSideData] = useState({
    labelText: '',
    description: '',
    buttonLabel: ''
  });
  const [savedLeftSideData, setSavedLeftSideData] = useState(null);
  
  // Right Side Section State
  const [rightSideData, setRightSideData] = useState({
    heading: '',
    image: null,
    buttonLabel: ''
  });
  const [savedRightSideData, setSavedRightSideData] = useState(null);
  
  // Slider Section State
  const [sliderImages, setSliderImages] = useState([]);
  const [savedSliderImages, setSavedSliderImages] = useState([]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Left Side Section Handlers
  const handleLeftSideChange = (field, value) => {
    setLeftSideData(prev => ({ ...prev, [field]: value }));
  };

  const handleLeftSideSave = () => {
    setSavedLeftSideData({ ...leftSideData });
    console.log('Left Side Data Saved:', leftSideData);
    // Add your API call here
  };

  const handleLeftSideCancel = () => {
    if (savedLeftSideData) {
      setLeftSideData({ ...savedLeftSideData });
    } else {
      setLeftSideData({ labelText: '', description: '', buttonLabel: '' });
    }
  };

  // Right Side Section Handlers
  const handleRightSideChange = (field, value) => {
    setRightSideData(prev => ({ ...prev, [field]: value }));
  };

  const handleRightSideImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRightSideData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeRightSideImage = () => {
    setRightSideData(prev => ({ ...prev, image: null }));
  };

  const handleRightSideSave = () => {
    setSavedRightSideData({ ...rightSideData });
    console.log('Right Side Data Saved:', rightSideData);
    // Add your API call here
  };

  const handleRightSideCancel = () => {
    if (savedRightSideData) {
      setRightSideData({ ...savedRightSideData });
    } else {
      setRightSideData({ heading: '', image: null, buttonLabel: '' });
    }
  };

  // Slider Section Handlers
  const handleSliderImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSliderImages(prev => [...prev, { id: Date.now() + Math.random(), url: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeSliderImage = (id) => {
    setSliderImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSliderSave = () => {
    setSavedSliderImages([...sliderImages]);
    console.log('Slider Images Saved:', sliderImages);
    // Add your API call here
  };

  const handleSliderCancel = () => {
    if (savedSliderImages.length > 0) {
      setSliderImages([...savedSliderImages]);
    } else {
      setSliderImages([]);
    }
  };

  return (
    <div className="hero-section-container">
      <h2 className="section-main-title">Hero Section Configuration</h2>

      {/* Left Side Section */}
      <div className="config-section">
        <button 
          className="section-header"
          onClick={() => toggleSection('left')}
        >
          <span className="section-header-title">Left Side Section</span>
          {expandedSection === 'left' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSection === 'left' && (
          <div className="section-content-area">
            <div className="form-group">
              <label className="form-label">Label Text</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter label text"
                value={leftSideData.labelText}
                onChange={(e) => handleLeftSideChange('labelText', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Enter description"
                rows="4"
                value={leftSideData.description}
                onChange={(e) => handleLeftSideChange('description', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Button Label</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter button label"
                value={leftSideData.buttonLabel}
                onChange={(e) => handleLeftSideChange('buttonLabel', e.target.value)}
              />
            </div>

            <div className="section-actions">
              <button className="btn-cancel" onClick={handleLeftSideCancel}>Cancel</button>
              <button className="btn-save" onClick={handleLeftSideSave}>Save</button>
            </div>
          </div>
        )}
      </div>

      {/* Right Side Section */}
      <div className="config-section">
        <button 
          className="section-header"
          onClick={() => toggleSection('right')}
        >
          <span className="section-header-title">Right Side Section</span>
          {expandedSection === 'right' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSection === 'right' && (
          <div className="section-content-area">
            <div className="form-group">
              <label className="form-label">Heading</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter heading"
                value={rightSideData.heading}
                onChange={(e) => handleRightSideChange('heading', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image</label>
              <div className="image-upload-area">
                {rightSideData.image ? (
                  <div className="image-preview">
                    <img src={rightSideData.image} alt="Right side preview" />
                    <button 
                      className="remove-image-btn"
                      onClick={removeRightSideImage}
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
                      onChange={handleRightSideImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Button Label</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter button label"
                value={rightSideData.buttonLabel}
                onChange={(e) => handleRightSideChange('buttonLabel', e.target.value)}
              />
            </div>

            <div className="section-actions">
              <button className="btn-cancel" onClick={handleRightSideCancel}>Cancel</button>
              <button className="btn-save" onClick={handleRightSideSave}>Save</button>
            </div>
          </div>
        )}
      </div>

      {/* Slider Section */}
      <div className="config-section">
        <button 
          className="section-header"
          onClick={() => toggleSection('slider')}
        >
          <span className="section-header-title">Slider Section</span>
          {expandedSection === 'slider' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSection === 'slider' && (
          <div className="section-content-area">
            <div className="form-group">
              <label className="form-label">Slider Images</label>
              
              <label className="upload-button">
                <Upload size={18} />
                <span>Upload Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleSliderImageUpload}
                  style={{ display: 'none' }}
                />
              </label>

              {sliderImages.length > 0 && (
                <div className="slider-images-grid">
                  {sliderImages.map((image) => (
                    <div key={image.id} className="slider-image-item">
                      <img src={image.url} alt="Slider" />
                      <button 
                        className="remove-slider-image-btn"
                        onClick={() => removeSliderImage(image.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {sliderImages.length === 0 && (
                <p className="empty-state">No images uploaded yet</p>
              )}
            </div>

            <div className="section-actions">
              <button className="btn-cancel" onClick={handleSliderCancel}>Cancel</button>
              <button className="btn-save" onClick={handleSliderSave}>Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
