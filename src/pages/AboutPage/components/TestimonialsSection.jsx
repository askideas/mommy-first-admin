import { useState, useEffect } from 'react';
import { Image } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './AboutSection.css';

const TestimonialsSection = () => {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  const [imageKitTarget, setImageKitTarget] = useState(null);
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [testimonials, setTestimonials] = useState([
    { image: null, label: '', name: '', description: '' },
    { image: null, label: '', name: '', description: '' }
  ]);
  const [savedTestimonials, setSavedTestimonials] = useState(null);

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
      const docRef = doc(db, 'aboutpage', 'testimonials');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        if (data.testimonials) {
          setTestimonials(data.testimonials);
          setSavedTestimonials(data.testimonials);
        }
      }
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (index, field, value) => {
    setTestimonials(prev => {
      const newTestimonials = [...prev];
      newTestimonials[index] = { ...newTestimonials[index], [field]: value };
      return newTestimonials;
    });
  };

  const openImageKitBrowser = (index) => {
    setImageKitTarget(index);
    setIsImageKitOpen(true);
  };

  const handleImageKitSelect = (imageUrl) => {
    if (imageKitTarget !== null) {
      handleCardChange(imageKitTarget, 'image', imageUrl);
    }
    setIsImageKitOpen(false);
    setImageKitTarget(null);
  };

  const removeImage = (index) => {
    handleCardChange(index, 'image', null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveStatus('saving');
      
      const docRef = doc(db, 'aboutpage', 'testimonials');
      
      await setDoc(docRef, {
        isEnabled: isEnabled,
        testimonials: testimonials
      });
      
      setSavedIsEnabled(isEnabled);
      setSavedTestimonials([...testimonials]);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Error saving testimonials:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEnabled(savedIsEnabled);
    if (savedTestimonials) {
      setTestimonials([...savedTestimonials]);
    } else {
      setTestimonials([
        { image: null, label: '', name: '', description: '' },
        { image: null, label: '', name: '', description: '' }
      ]);
    }
  };

  return (
    <div className="about-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Testimonials Section Configuration</h2>
        <div className="enable-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              className="toggle-checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
            />
            <span className="toggle-text">{isEnabled ? 'Enabled' : 'Disabled'}</span>
          </label>
        </div>
      </div>

      <div className="config-section">
        <div className="section-content-area">
          <div className="form-group">
            <label className="form-label">Testimonial Cards (2 Cards)</label>
            <div className="cards-grid cards-grid-2">
              {testimonials.map((card, index) => (
                <div key={index} className="card-item">
                  <h4 className="card-item-title">Card {index + 1}</h4>
                  
                  {/* Card Image */}
                  <div className="card-image-area">
                    {card.image ? (
                      <div className="card-image-preview">
                        <img src={card.image} alt={`Testimonial ${index + 1}`} />
                        <div className="card-image-actions">
                          <button 
                            type="button"
                            className="btn-change-small"
                            onClick={() => openImageKitBrowser(index)}
                          >
                            Change
                          </button>
                          <button 
                            type="button"
                            className="btn-remove-small"
                            onClick={() => removeImage(index)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        type="button"
                        className="choose-image-btn-small"
                        onClick={() => openImageKitBrowser(index)}
                      >
                        <Image size={18} />
                        <span>Choose Image</span>
                      </button>
                    )}
                  </div>

                  {/* Label */}
                  <div className="card-input-group">
                    <label className="card-input-label">Label</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter label"
                      value={card.label}
                      onChange={(e) => handleCardChange(index, 'label', e.target.value)}
                    />
                  </div>

                  {/* Name */}
                  <div className="card-input-group">
                    <label className="card-input-label">Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter name"
                      value={card.name}
                      onChange={(e) => handleCardChange(index, 'name', e.target.value)}
                    />
                  </div>

                  {/* Description */}
                  <div className="card-input-group">
                    <label className="card-input-label">Description</label>
                    <textarea
                      className="form-textarea-small"
                      placeholder="Enter description"
                      rows={3}
                      value={card.description}
                      onChange={(e) => handleCardChange(index, 'description', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-actions">
            <button className="btn-cancel" onClick={handleCancel} disabled={loading}>Cancel</button>
            <button className="btn-save" onClick={handleSave} disabled={loading}>
              {loading && saveStatus === 'saving' ? 'Saving...' : 'Save'}
            </button>
            {saveStatus === 'success' && (
              <span className="save-success">✓ Saved successfully!</span>
            )}
            {saveStatus === 'error' && (
              <span className="save-error">✗ Error saving</span>
            )}
          </div>
        </div>
      </div>

      {/* ImageKit Browser Modal */}
      <ImageKitBrowser
        isOpen={isImageKitOpen}
        onClose={() => {
          setIsImageKitOpen(false);
          setImageKitTarget(null);
        }}
        onSelect={handleImageKitSelect}
      />
    </div>
  );
};

export default TestimonialsSection;
