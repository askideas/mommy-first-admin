import { useState } from 'react';
import { ChevronDown, ChevronUp, X, Image } from 'lucide-react';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './HeroSection.css';

const HeroSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  
  // ImageKit Browser Modal State
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  const [imageKitTarget, setImageKitTarget] = useState(null); // 'rightSide' or 'slider'
  
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

  const removeRightSideImage = () => {
    setRightSideData(prev => ({ ...prev, image: null }));
  };

  // ImageKit Browser Handlers
  const openImageKitBrowser = (target) => {
    setImageKitTarget(target);
    setIsImageKitOpen(true);
  };

  const handleImageKitSelect = (imageUrl) => {
    if (imageKitTarget === 'rightSide') {
      setRightSideData(prev => ({ ...prev, image: imageUrl }));
    } else if (imageKitTarget === 'slider') {
      setSliderImages(prev => [...prev, { id: Date.now() + Math.random(), url: imageUrl }]);
    }
    setImageKitTarget(null);
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
                  <div className="image-selected-container">
                    <div className="image-preview">
                      <img src={rightSideData.image} alt="Right side preview" />
                    </div>
                    <div className="image-actions">
                      <button 
                        type="button"
                        className="btn-change"
                        onClick={() => openImageKitBrowser('rightSide')}
                      >
                        Change
                      </button>
                      <button 
                        type="button"
                        className="btn-remove"
                        onClick={removeRightSideImage}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    type="button"
                    className="choose-image-btn"
                    onClick={() => openImageKitBrowser('rightSide')}
                  >
                    <Image size={24} />
                    <span>Choose Image</span>
                  </button>
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
              
              <button 
                type="button"
                className="choose-image-button"
                onClick={() => openImageKitBrowser('slider')}
              >
                <Image size={18} />
                <span>Choose Image</span>
              </button>

              {sliderImages.length > 0 && (
                <div className="slider-images-grid">
                  {sliderImages.map((image) => (
                    <div key={image.id} className="slider-image-item">
                      <img src={image.url} alt="Slider" />
                      <div className="slider-image-actions">
                        <button 
                          type="button"
                          className="btn-change-small"
                          onClick={() => {
                            // Remove this image and open modal to select new one
                            removeSliderImage(image.id);
                            openImageKitBrowser('slider');
                          }}
                        >
                          Change
                        </button>
                        <button 
                          type="button"
                          className="btn-remove-small"
                          onClick={() => removeSliderImage(image.id)}
                        >
                          Remove
                        </button>
                      </div>
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

      {/* ImageKit Browser Modal */}
      <ImageKitBrowser
        isOpen={isImageKitOpen}
        onClose={() => setIsImageKitOpen(false)}
        onSelectImage={handleImageKitSelect}
      />
    </div>
  );
};

export default HeroSection;
