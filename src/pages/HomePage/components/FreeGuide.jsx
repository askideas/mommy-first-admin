import { useState } from 'react';
import './FreeGuide.css';

const FreeGuide = () => {
  const [guideData, setGuideData] = useState({
    headingOne: '',
    headingTwo: '',
    description: '',
    buttonLabel: '',
    flashLabelText: ''
  });
  const [savedGuideData, setSavedGuideData] = useState(null);

  const handleInputChange = (field, value) => {
    setGuideData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSavedGuideData({ ...guideData });
    console.log('Free Guide Data Saved:', guideData);
    // Add your API call here
  };

  const handleCancel = () => {
    if (savedGuideData) {
      setGuideData({ ...savedGuideData });
    } else {
      setGuideData({
        headingOne: '',
        headingTwo: '',
        description: '',
        buttonLabel: '',
        flashLabelText: ''
      });
    }
  };

  return (
    <div className="free-guide-container">
      <h2 className="section-main-title">Free Guide Configuration</h2>

      <div className="config-section">
        <div className="section-content-area">
          <div className="form-group">
            <label className="form-label">Heading One</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter first heading"
              value={guideData.headingOne}
              onChange={(e) => handleInputChange('headingOne', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Heading Two</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter second heading"
              value={guideData.headingTwo}
              onChange={(e) => handleInputChange('headingTwo', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Enter description"
              rows="4"
              value={guideData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Button Label</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter button label"
              value={guideData.buttonLabel}
              onChange={(e) => handleInputChange('buttonLabel', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Flash Label Text</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter flash label text"
              value={guideData.flashLabelText}
              onChange={(e) => handleInputChange('flashLabelText', e.target.value)}
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

export default FreeGuide;
