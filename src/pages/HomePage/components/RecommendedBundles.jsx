import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Image } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './RecommendedBundles.css';

const RecommendedBundles = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  // ImageKit Browser Modal State
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  
  // Heading Section State
  const [headingData, setHeadingData] = useState({
    heading: '',
    subheading: '',
    description: ''
  });
  const [savedHeadingData, setSavedHeadingData] = useState(null);
  
  // Image Section State
  const [imageData, setImageData] = useState({
    image: null,
    link: ''
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

  // Load data from Firebase on component mount
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
      const docRef = doc(db, 'homepage', 'recommendedbundles');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.heading) {
          setHeadingData(data.heading);
          setSavedHeadingData(data.heading);
        }
        
        if (data.image) {
          setImageData(data.image);
          setSavedImageData(data.image);
        }
        
        if (data.content) {
          setContentData(data.content);
          setSavedContentData(data.content);
        }
      }
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleEnableToggle = async (newState) => {
    setIsEnabled(newState);
    try {
      const docRef = doc(db, 'homepage', 'recommendedbundles');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        isEnabled: newState
      });
      
      setSavedIsEnabled(newState);
      console.log('Recommended Bundles enabled state:', newState);
    } catch (error) {
      console.error('Error saving enabled state:', error);
      setIsEnabled(!newState);
    }
  };

  // ImageKit Browser Handlers
  const openImageKitBrowser = () => {
    setIsImageKitOpen(true);
  };

  const handleImageKitSelect = (imageUrl) => {
    console.log('RecommendedBundles - Image selected:', imageUrl);
    setImageData(prev => {
      const newData = { ...prev, image: imageUrl };
      console.log('RecommendedBundles - Updated imageData:', newData);
      return newData;
    });
  };

  // Heading Section Handlers
  const handleHeadingChange = (field, value) => {
    setHeadingData(prev => ({ ...prev, [field]: value }));
  };

  const handleHeadingSave = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'heading', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'recommendedbundles');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        heading: headingData
      });
      
      setSavedHeadingData({ ...headingData });
      setSaveStatus({ section: 'heading', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
      console.log('Heading Data Saved to Firebase:', headingData);
    } catch (error) {
      console.error('Error saving heading data:', error);
      setSaveStatus({ section: 'heading', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleHeadingCancel = () => {
    if (savedHeadingData) {
      setHeadingData({ ...savedHeadingData });
    } else {
      setHeadingData({ heading: '', subheading: '', description: '' });
    }
  };

  // Image Section Handlers
  const removeImage = () => {
    setImageData({ image: null });
  };

  const handleImageSave = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'image', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'recommendedbundles');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        image: imageData
      });
      
      setSavedImageData({ ...imageData });
      setSaveStatus({ section: 'image', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
      console.log('Image Data Saved to Firebase:', imageData);
    } catch (error) {
      console.error('Error saving image data:', error);
      setSaveStatus({ section: 'image', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleImageCancel = () => {
    if (savedImageData) {
      setImageData({ ...savedImageData });
    } else {
      setImageData({ image: null, link: '' });
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

  const handleContentSave = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'content', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'recommendedbundles');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        content: contentData
      });
      
      setSavedContentData({ ...contentData });
      setSaveStatus({ section: 'content', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
      console.log('Content Data Saved to Firebase:', contentData);
    } catch (error) {
      console.error('Error saving content data:', error);
      setSaveStatus({ section: 'content', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
    } finally {
      setLoading(false);
    }
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
      <div className="section-header-row">
        <h2 className="section-main-title">Recommended Bundles Configuration</h2>
        <div className="enable-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => handleEnableToggle(e.target.checked)}
              className="toggle-checkbox"
            />
            <span className="toggle-text">{isEnabled ? 'Enabled' : 'Disabled'}</span>
          </label>
        </div>
      </div>

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
              {saveStatus.section === 'heading' && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === 'heading' && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
              <button className="btn-cancel" onClick={handleHeadingCancel} disabled={loading}>Cancel</button>
              <button className="btn-save" onClick={handleHeadingSave} disabled={loading}>
                {loading && saveStatus.section === 'heading' ? 'Saving...' : 'Save'}
              </button>
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
                  <button className="upload-label" onClick={openImageKitBrowser}>
                    <Image size={24} />
                    <span>Browse ImageKit</span>
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Redirection Link</label>
              <input
                type="url"
                className="form-input"
                placeholder="Enter URL (e.g., https://example.com or /shop)"
                value={imageData.link}
                onChange={(e) => setImageData(prev => ({ ...prev, link: e.target.value }))}
              />
            </div>

            <div className="section-actions">
              {saveStatus.section === 'image' && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === 'image' && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
              <button className="btn-cancel" onClick={handleImageCancel} disabled={loading}>Cancel</button>
              <button className="btn-save" onClick={handleImageSave} disabled={loading}>
                {loading && saveStatus.section === 'image' ? 'Saving...' : 'Save'}
              </button>
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
              {saveStatus.section === 'content' && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === 'content' && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
              <button className="btn-cancel" onClick={handleContentCancel} disabled={loading}>Cancel</button>
              <button className="btn-save" onClick={handleContentSave} disabled={loading}>
                {loading && saveStatus.section === 'content' ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ImageKit Browser Modal */}
      <ImageKitBrowser
        isOpen={isImageKitOpen}
        onClose={() => setIsImageKitOpen(false)}
        onSelect={handleImageKitSelect}
      />
    </div>
  );
};

export default RecommendedBundles;
