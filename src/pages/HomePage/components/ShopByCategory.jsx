import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Image } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './ShopByCategory.css';

const ShopByCategory = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  // Heading Section State
  const [headingData, setHeadingData] = useState({
    heading: '',
    subheading: '',
    description: ''
  });
  const [savedHeadingData, setSavedHeadingData] = useState(null);
  
  // ImageKit Browser Modal State
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  const [imageKitTarget, setImageKitTarget] = useState(null);
  
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
      const docRef = doc(db, 'homepage', 'shopbycategory');
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
        
        if (data.category1) {
          setCategory1Data(data.category1);
          setSavedCategory1Data(data.category1);
        }
        
        if (data.category2) {
          setCategory2Data(data.category2);
          setSavedCategory2Data(data.category2);
        }
        
        if (data.category3) {
          setCategory3Data(data.category3);
          setSavedCategory3Data(data.category3);
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
      const docRef = doc(db, 'homepage', 'shopbycategory');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        isEnabled: newState
      });
      
      setSavedIsEnabled(newState);
      console.log('Shop By Category enabled state:', newState);
    } catch (error) {
      console.error('Error saving enabled state:', error);
      setIsEnabled(!newState);
    }
  };

  const handleHeadingChange = (field, value) => {
    setHeadingData(prev => ({ ...prev, [field]: value }));
  };

  const handleHeadingSave = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'heading', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'shopbycategory');
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

  // ImageKit Browser Handlers
  const openImageKitBrowser = (target) => {
    setImageKitTarget(target);
    setIsImageKitOpen(true);
  };

  const handleImageKitSelect = (imageUrl) => {
    console.log('ShopByCategory - Image selected:', imageUrl, 'Target:', imageKitTarget);
    if (imageKitTarget === 'category1') {
      setCategory1Data(prev => ({ ...prev, image: imageUrl }));
    } else if (imageKitTarget === 'category2') {
      setCategory2Data(prev => ({ ...prev, image: imageUrl }));
    } else if (imageKitTarget === 'category3') {
      setCategory3Data(prev => ({ ...prev, image: imageUrl }));
    }
    setImageKitTarget(null);
  };

  // Category 1 Handlers
  const handleCategory1Change = (field, value) => {
    setCategory1Data(prev => ({ ...prev, [field]: value }));
  };

  const removeCategory1Image = () => {
    setCategory1Data(prev => ({ ...prev, image: null }));
  };

  const handleCategory1Save = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'category1', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'shopbycategory');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        category1: category1Data
      });
      
      setSavedCategory1Data({ ...category1Data });
      setSaveStatus({ section: 'category1', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
      console.log('Category 1 Data Saved to Firebase:', category1Data);
    } catch (error) {
      console.error('Error saving category 1 data:', error);
      setSaveStatus({ section: 'category1', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
    } finally {
      setLoading(false);
    }
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

  const removeCategory2Image = () => {
    setCategory2Data(prev => ({ ...prev, image: null }));
  };

  const handleCategory2Save = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'category2', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'shopbycategory');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        category2: category2Data
      });
      
      setSavedCategory2Data({ ...category2Data });
      setSaveStatus({ section: 'category2', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
      console.log('Category 2 Data Saved to Firebase:', category2Data);
    } catch (error) {
      console.error('Error saving category 2 data:', error);
      setSaveStatus({ section: 'category2', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
    } finally {
      setLoading(false);
    }
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

  const removeCategory3Image = () => {
    setCategory3Data(prev => ({ ...prev, image: null }));
  };

  const handleCategory3Save = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'category3', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'shopbycategory');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        category3: category3Data
      });
      
      setSaveStatus({ section: 'category3', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
      console.log('Category 3 Data Saved to Firebase:', category3Data);
    } catch (error) {
      console.error('Error saving category 3 data:', error);
      setSaveStatus({ section: 'category3', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCategory3Cancel = () => {
    if (savedCategory3Data) {
      setCategory3Data({ ...savedCategory3Data });
    } else {
      setCategory3Data({ image: null, label: '', heading: '', subheading: '', buttonLabel: '' });
    }
  };

  const renderCategorySection = (categoryNum, data, handleChange, removeImage, handleSave, handleCancel) => {
    const sectionKey = `category${categoryNum}`;
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
                  <div className="image-selected-container">
                    <div className="image-preview">
                      <img src={data.image} alt={`Category ${categoryNum}`} />
                    </div>
                    <div className="image-actions">
                      <button 
                        type="button"
                        className="btn-change"
                        onClick={() => {
                          console.log('Change image clicked for category', categoryNum);
                          openImageKitBrowser(`category${categoryNum}`);
                        }}
                      >
                        Change
                      </button>
                      <button 
                        type="button"
                        className="btn-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Remove image clicked for category', categoryNum);
                          removeImage();
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    type="button"
                    className="choose-image-btn" 
                    onClick={() => openImageKitBrowser(`category${categoryNum}`)}
                  >
                    <Image size={24} />
                    <span>Choose Image</span>
                  </button>
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
              {saveStatus.section === sectionKey && saveStatus.status === 'success' && (
                <span className="save-status success">Saved successfully!</span>
              )}
              {saveStatus.section === sectionKey && saveStatus.status === 'error' && (
                <span className="save-status error">Error saving data</span>
              )}
              <button className="btn-cancel" onClick={handleCancel} disabled={loading}>Cancel</button>
              <button className="btn-save" onClick={handleSave} disabled={loading}>
                {loading && saveStatus.section === sectionKey ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="shop-by-category-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Shop by Category Configuration</h2>
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
              <button className="btn-cancel" onClick={handleHeadingCancel}>Cancel</button>
              <button className="btn-save" onClick={handleHeadingSave} disabled={loading}>
                {loading && saveStatus.section === 'heading' ? 'Saving...' : 'Save'}
              </button>
              {saveStatus.section === 'heading' && saveStatus.status === 'success' && (
                <span className="save-success">✓ Saved successfully!</span>
              )}
              {saveStatus.section === 'heading' && saveStatus.status === 'error' && (
                <span className="save-error">✗ Error saving</span>
              )}
            </div>
          </div>
        )}
      </div>

      {renderCategorySection(1, category1Data, handleCategory1Change, removeCategory1Image, handleCategory1Save, handleCategory1Cancel)}
      {renderCategorySection(2, category2Data, handleCategory2Change, removeCategory2Image, handleCategory2Save, handleCategory2Cancel)}
      {renderCategorySection(3, category3Data, handleCategory3Change, removeCategory3Image, handleCategory3Save, handleCategory3Cancel)}

      {/* ImageKit Browser Modal */}
      <ImageKitBrowser
        isOpen={isImageKitOpen}
        onClose={() => setIsImageKitOpen(false)}
        onSelect={handleImageKitSelect}
      />
    </div>
  );
};

export default ShopByCategory;
