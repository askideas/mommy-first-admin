import { useState } from 'react';
import { ChevronDown, ChevronUp, Upload, X } from 'lucide-react';
import './ShopByCategory.css';

const ShopByCategory = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  
  // Category 1 State
  const [category1Data, setCategory1Data] = useState({
    image: null,
    label: '',
    heading: '',
    subheading: '',
    buttonLabel: ''
  });
  const [savedCategory1Data, setSavedCategory1Data] = useState(null);
  
  // Category 2 State
  const [category2Data, setCategory2Data] = useState({
    image: null,
    label: '',
    heading: '',
    subheading: '',
    buttonLabel: ''
  });
  const [savedCategory2Data, setSavedCategory2Data] = useState(null);
  
  // Category 3 State
  const [category3Data, setCategory3Data] = useState({
    image: null,
    label: '',
    heading: '',
    subheading: '',
    buttonLabel: ''
  });
  const [savedCategory3Data, setSavedCategory3Data] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Category 1 Handlers
  const handleCategory1Change = (field, value) => {
    setCategory1Data(prev => ({ ...prev, [field]: value }));
  };

  const handleCategory1ImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategory1Data(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCategory1Image = () => {
    setCategory1Data(prev => ({ ...prev, image: null }));
  };

  const handleCategory1Save = () => {
    setSavedCategory1Data({ ...category1Data });
    console.log('Category 1 Data Saved:', category1Data);
    // Add your API call here
  };

  const handleCategory1Cancel = () => {
    if (savedCategory1Data) {
      setCategory1Data({ ...savedCategory1Data });
    } else {
      setCategory1Data({ image: null, label: '', heading: '', subheading: '', buttonLabel: '' });
    }
  };

  // Category 2 Handlers
  const handleCategory2Change = (field, value) => {
    setCategory2Data(prev => ({ ...prev, [field]: value }));
  };

  const handleCategory2ImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategory2Data(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCategory2Image = () => {
    setCategory2Data(prev => ({ ...prev, image: null }));
  };

  const handleCategory2Save = () => {
    setSavedCategory2Data({ ...category2Data });
    console.log('Category 2 Data Saved:', category2Data);
    // Add your API call here
  };

  const handleCategory2Cancel = () => {
    if (savedCategory2Data) {
      setCategory2Data({ ...savedCategory2Data });
    } else {
      setCategory2Data({ image: null, label: '', heading: '', subheading: '', buttonLabel: '' });
    }
  };

  // Category 3 Handlers
  const handleCategory3Change = (field, value) => {
    setCategory3Data(prev => ({ ...prev, [field]: value }));
  };

  const handleCategory3ImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategory3Data(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCategory3Image = () => {
    setCategory3Data(prev => ({ ...prev, image: null }));
  };

  const handleCategory3Save = () => {
    setSavedCategory3Data({ ...category3Data });
    console.log('Category 3 Data Saved:', category3Data);
    // Add your API call here
  };

  const handleCategory3Cancel = () => {
    if (savedCategory3Data) {
      setCategory3Data({ ...savedCategory3Data });
    } else {
      setCategory3Data({ image: null, label: '', heading: '', subheading: '', buttonLabel: '' });
    }
  };

  const renderCategorySection = (categoryNum, data, handleChange, handleImageUpload, removeImage, handleSave, handleCancel) => {
    return (
      <div className="config-section">
        <button 
          className="section-header"
          onClick={() => toggleSection(`category${categoryNum}`)}
        >
          <span className="section-header-title">Category {categoryNum}</span>
          {expandedSection === `category${categoryNum}` ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSection === `category${categoryNum}` && (
          <div className="section-content-area">
            <div className="form-group">
              <label className="form-label">Image</label>
              <div className="image-upload-area">
                {data.image ? (
                  <div className="image-preview">
                    <img src={data.image} alt={`Category ${categoryNum}`} />
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
              <label className="form-label">Label</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter label"
                value={data.label}
                onChange={(e) => handleChange('label', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Heading</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter heading"
                value={data.heading}
                onChange={(e) => handleChange('heading', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subheading</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter subheading"
                value={data.subheading}
                onChange={(e) => handleChange('subheading', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Button Label</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter button label"
                value={data.buttonLabel}
                onChange={(e) => handleChange('buttonLabel', e.target.value)}
              />
            </div>

            <div className="section-actions">
              <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
              <button className="btn-save" onClick={handleSave}>Save</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="shop-by-category-container">
      <h2 className="section-main-title">Shop by Category Configuration</h2>

      {renderCategorySection(1, category1Data, handleCategory1Change, handleCategory1ImageUpload, removeCategory1Image, handleCategory1Save, handleCategory1Cancel)}
      {renderCategorySection(2, category2Data, handleCategory2Change, handleCategory2ImageUpload, removeCategory2Image, handleCategory2Save, handleCategory2Cancel)}
      {renderCategorySection(3, category3Data, handleCategory3Change, handleCategory3ImageUpload, removeCategory3Image, handleCategory3Save, handleCategory3Cancel)}
    </div>
  );
};

export default ShopByCategory;
