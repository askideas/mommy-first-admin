import { useState } from 'react';
import { ChevronDown, ChevronUp, Upload, X } from 'lucide-react';
import './RecommendedBundles.css';

const RecommendedBundles = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  
  // Heading Section State
  const [headingData, setHeadingData] = useState({
    heading: '',
    subheading: '',
    description: ''
  });
  const [savedHeadingData, setSavedHeadingData] = useState(null);
  
  // Image Section State
  const [imageData, setImageData] = useState({
    image: null
  });
  const [savedImageData, setSavedImageData] = useState(null);
  
  // Content Section State
  const [contentData, setContentData] = useState({
    description: '',
    sections: [
      { id: 1, label: '', value: '' },
      { id: 2, label: '', value: '' },
      { id: 3, label: '', value: '' },
      { id: 4, label: '', value: '' }
    ]
  });
  const [savedContentData, setSavedContentData] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Heading Section Handlers
  const handleHeadingChange = (field, value) => {
    setHeadingData(prev => ({ ...prev, [field]: value }));
  };

  const handleHeadingSave = () => {
    setSavedHeadingData({ ...headingData });
    console.log('Heading Data Saved:', headingData);
    // Add your API call here
  };

  const handleHeadingCancel = () => {
    if (savedHeadingData) {
      setHeadingData({ ...savedHeadingData });
    } else {
      setHeadingData({ heading: '', subheading: '', description: '' });
    }
  };

  // Image Section Handlers
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData({ image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageData({ image: null });
  };

  const handleImageSave = () => {
    setSavedImageData({ ...imageData });
    console.log('Image Data Saved:', imageData);
    // Add your API call here
  };

  const handleImageCancel = () => {
    if (savedImageData) {
      setImageData({ ...savedImageData });
    } else {
      setImageData({ image: null });
    }
  };

  // Content Section Handlers
  const handleContentDescriptionChange = (value) => {
    setContentData(prev => ({ ...prev, description: value }));
  };

  const handleSectionChange = (id, field, value) => {
    setContentData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === id ? { ...section, [field]: value } : section
      )
    }));
  };

  const handleContentSave = () => {
    setSavedContentData({ ...contentData });
    console.log('Content Data Saved:', contentData);
    // Add your API call here
  };

  const handleContentCancel = () => {
    if (savedContentData) {
      setContentData({ ...savedContentData });
    } else {
      setContentData({
        description: '',
        sections: [
          { id: 1, label: '', value: '' },
          { id: 2, label: '', value: '' },
          { id: 3, label: '', value: '' },
          { id: 4, label: '', value: '' }
        ]
      });
    }
  };

  return (
    <div className="recommended-bundles-container">
      <h2 className="section-main-title">Recommended Bundles Configuration</h2>

      {/* Heading Section */}
      <div className="config-section">
        <button 
          className="section-header"
          onClick={() => toggleSection('heading')}
        >
          <span className="section-header-title">Heading Section</span>
          {expandedSection === 'heading' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSection === 'heading' && (
          <div className="section-content-area">
            <div className="form-group">
              <label className="form-label">Heading</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter heading"
                value={headingData.heading}
                onChange={(e) => handleHeadingChange('heading', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subheading</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter subheading"
                value={headingData.subheading}
                onChange={(e) => handleHeadingChange('subheading', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Enter description"
                rows="4"
                value={headingData.description}
                onChange={(e) => handleHeadingChange('description', e.target.value)}
              />
            </div>

            <div className="section-actions">
              <button className="btn-cancel" onClick={handleHeadingCancel}>Cancel</button>
              <button className="btn-save" onClick={handleHeadingSave}>Save</button>
            </div>
          </div>
        )}
      </div>

      {/* Image Section */}
      <div className="config-section">
        <button 
          className="section-header"
          onClick={() => toggleSection('image')}
        >
          <span className="section-header-title">Image Section</span>
          {expandedSection === 'image' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSection === 'image' && (
          <div className="section-content-area">
            <div className="form-group">
              <label className="form-label">Image</label>
              <div className="image-upload-area">
                {imageData.image ? (
                  <div className="image-preview">
                    <img src={imageData.image} alt="Bundle preview" />
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

            <div className="section-actions">
              <button className="btn-cancel" onClick={handleImageCancel}>Cancel</button>
              <button className="btn-save" onClick={handleImageSave}>Save</button>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="config-section">
        <button 
          className="section-header"
          onClick={() => toggleSection('content')}
        >
          <span className="section-header-title">Content Section</span>
          {expandedSection === 'content' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {expandedSection === 'content' && (
          <div className="section-content-area">
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Enter content description"
                rows="4"
                value={contentData.description}
                onChange={(e) => handleContentDescriptionChange(e.target.value)}
              />
            </div>

            <div className="subsections-container">
              <h4 className="subsections-title">Sections</h4>
              {contentData.sections.map((section, index) => (
                <div key={section.id} className="subsection-item">
                  <div className="subsection-header">Section {index + 1}</div>
                  <div className="subsection-fields">
                    <div className="form-group">
                      <label className="form-label">Label</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter label"
                        value={section.label}
                        onChange={(e) => handleSectionChange(section.id, 'label', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Value</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter value"
                        value={section.value}
                        onChange={(e) => handleSectionChange(section.id, 'value', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-actions">
              <button className="btn-cancel" onClick={handleContentCancel}>Cancel</button>
              <button className="btn-save" onClick={handleContentSave}>Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedBundles;
