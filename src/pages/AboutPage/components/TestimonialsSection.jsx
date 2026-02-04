import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Image, Plus, Trash2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import ImageKitBrowser from '../../../components/ImageKitBrowser';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  // ImageKit Browser Modal State
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  const [imageKitTarget, setImageKitTarget] = useState(null); // { type: 'testimonial', index: 0 }
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  // Testimonials Data State
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      authorImage: null,
      authorName: 'Dr. Vandana Pasumalli Sachin',
      authorCredentials: 'MD, MBBS, FRACP, Fellowship in Lactation',
      content: 'Lorem ipsum dolor sit amet consectetur. Ac scelerisque adipiscing ullamcorper sit rhoncus. Eu semper placerat tristique sed ut. Eget arcu id lacus nec porttitor gravida aliquam blandit tincidunt.'
    },
    {
      id: 2,
      authorImage: null,
      authorName: 'Dr. Riteshvarini Lal',
      authorCredentials: 'MD, MBBS, Fellowship in Neonatal Care',
      content: 'Lorem ipsum dolor sit amet consectetur. Ac scelerisque adipiscing ullamcorper sit rhoncus. Eu semper placerat tristique sed ut. Eget arcu id lacus nec porttitor gravida aliquam blandit tincidunt.'
    }
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

  const saveToFirebase = async () => {
    if (!db) {
      console.error('Firebase not initialized');
      setSaveStatus({ section: 'testimonials', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'testimonials', status: 'saving' });
      
      const docRef = doc(db, 'aboutpage', 'testimonials');
      
      const dataToSave = {
        isEnabled,
        testimonials,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedTestimonials([...testimonials]);
      
      setSaveStatus({ section: 'testimonials', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'testimonials', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleImageSelect = (imageUrl) => {
    if (imageKitTarget && imageKitTarget.type === 'testimonial') {
      const updatedTestimonials = [...testimonials];
      updatedTestimonials[imageKitTarget.index].authorImage = imageUrl;
      setTestimonials(updatedTestimonials);
    }
    setIsImageKitOpen(false);
    setImageKitTarget(null);
  };

  const openImageKitBrowser = (type, index) => {
    setImageKitTarget({ type, index });
    setIsImageKitOpen(true);
  };

  const addTestimonial = () => {
    const newTestimonial = {
      id: Date.now(),
      authorImage: null,
      authorName: '',
      authorCredentials: '',
      content: ''
    };
    setTestimonials([...testimonials, newTestimonial]);
    setExpandedSection(`testimonial-${testimonials.length}`);
  };

  const removeTestimonial = (index) => {
    const updatedTestimonials = testimonials.filter((_, i) => i !== index);
    setTestimonials(updatedTestimonials);
  };

  const updateTestimonial = (index, field, value) => {
    const updatedTestimonials = [...testimonials];
    updatedTestimonials[index][field] = value;
    setTestimonials(updatedTestimonials);
  };

  const hasUnsavedChanges = () => {
    return isEnabled !== savedIsEnabled || 
           JSON.stringify(testimonials) !== JSON.stringify(savedTestimonials);
  };

  return (
    <div className="testimonials-section-container">
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

      {/* Testimonial Cards */}
      {testimonials.map((testimonial, index) => (
        <div key={testimonial.id} className="config-section">
          <button
            className="section-header"
            onClick={() => toggleSection(`testimonial-${index}`)}
          >
            <div className="section-header-title">
              Testimonial {index + 1} {testimonial.authorName && `- ${testimonial.authorName}`}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {testimonials.length > 1 && (
                <button
                  className="icon-btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTestimonial(index);
                  }}
                  title="Remove Testimonial"
                >
                  <Trash2 size={16} />
                </button>
              )}
              {expandedSection === `testimonial-${index}` ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </button>

          {expandedSection === `testimonial-${index}` && (
            <div className="section-content">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Author Image</label>
                  <div className="image-upload-group">
                    {testimonial.authorImage && (
                      <div className="image-preview round">
                        <img src={testimonial.authorImage} alt={testimonial.authorName} />
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => openImageKitBrowser('testimonial', index)}
                    >
                      <Image size={16} />
                      {testimonial.authorImage ? 'Change Image' : 'Select Image'}
                    </button>
                    {testimonial.authorImage && (
                      <button
                        type="button"
                        className="btn-text"
                        onClick={() => updateTestimonial(index, 'authorImage', null)}
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Author Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={testimonial.authorName}
                    onChange={(e) => updateTestimonial(index, 'authorName', e.target.value)}
                    placeholder="e.g., Dr. Vandana Pasumalli Sachin"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Author Credentials</label>
                  <input
                    type="text"
                    className="form-input"
                    value={testimonial.authorCredentials}
                    onChange={(e) => updateTestimonial(index, 'authorCredentials', e.target.value)}
                    placeholder="e.g., MD, MBBS, FRACP"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Testimonial Content</label>
                  <textarea
                    className="form-textarea"
                    rows={5}
                    value={testimonial.content}
                    onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                    placeholder="Enter testimonial content..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Testimonial Button */}
      <button className="btn-add-section" onClick={addTestimonial}>
        <Plus size={20} />
        Add Testimonial
      </button>

      {/* Save Section */}
      <div className="save-section">
        <button
          className="btn-primary"
          onClick={saveToFirebase}
          disabled={loading || !hasUnsavedChanges()}
        >
          {saveStatus.section === 'testimonials' && saveStatus.status === 'saving'
            ? 'Saving...'
            : 'Save Testimonials Section'}
        </button>
        {saveStatus.section === 'testimonials' && saveStatus.status === 'success' && (
          <span className="save-status success">Saved successfully!</span>
        )}
        {saveStatus.section === 'testimonials' && saveStatus.status === 'error' && (
          <span className="save-status error">Error saving data</span>
        )}
      </div>

      {/* ImageKit Browser Modal */}
      <ImageKitBrowser
        isOpen={isImageKitOpen}
        onSelect={handleImageSelect}
        onClose={() => {
          setIsImageKitOpen(false);
          setImageKitTarget(null);
        }}
      />
    </div>
  );
};

export default TestimonialsSection;
