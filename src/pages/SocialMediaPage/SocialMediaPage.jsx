import { useState, useEffect } from 'react';
import { Plus, Trash2, Image, GripVertical } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ImageKitBrowser from '../../components/ImageKitBrowser';
import './SocialMediaPage.css';

const SocialMediaPage = () => {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isImageKitOpen, setIsImageKitOpen] = useState(false);
  const [imageKitTarget, setImageKitTarget] = useState(null);
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [socialLinks, setSocialLinks] = useState([]);
  const [savedSocialLinks, setSavedSocialLinks] = useState([]);

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
      const docRef = doc(db, 'settings', 'socialmedia');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        if (data.socialLinks) {
          setSocialLinks(data.socialLinks);
          setSavedSocialLinks(data.socialLinks);
        }
      }
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSocialLink = () => {
    const newLink = {
      id: Date.now(),
      image: null,
      link: ''
    };
    setSocialLinks(prev => [...prev, newLink]);
  };

  const removeSocialLink = (id) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id));
  };

  const updateSocialLink = (id, field, value) => {
    setSocialLinks(prev => prev.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const openImageKitBrowser = (id) => {
    setImageKitTarget(id);
    setIsImageKitOpen(true);
  };

  const handleImageKitSelect = (imageUrl) => {
    if (imageKitTarget !== null) {
      updateSocialLink(imageKitTarget, 'image', imageUrl);
    }
    setIsImageKitOpen(false);
    setImageKitTarget(null);
  };

  const removeImage = (id) => {
    updateSocialLink(id, 'image', null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveStatus('saving');
      
      const docRef = doc(db, 'settings', 'socialmedia');
      
      await setDoc(docRef, {
        isEnabled: isEnabled,
        socialLinks: socialLinks
      });
      
      setSavedIsEnabled(isEnabled);
      setSavedSocialLinks([...socialLinks]);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Error saving social media data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEnabled(savedIsEnabled);
    setSocialLinks([...savedSocialLinks]);
  };

  return (
    <div className="socialmedia-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Social Media Links</h1>
          <p className="page-subtitle">Manage your social media links and icons</p>
        </div>
      </div>

      <div className="socialmedia-content">
        <div className="section-header-row">
          <h2 className="section-main-title">Social Media Configuration</h2>
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
            <div className="add-social-header">
              <p className="social-description">Add social media links with their icons. These will be displayed on your website.</p>
              <button className="btn-add-social" onClick={addSocialLink}>
                <Plus size={18} />
                <span>Add Social Media</span>
              </button>
            </div>

            {socialLinks.length === 0 ? (
              <div className="empty-social-placeholder">
                <div className="empty-icon">🔗</div>
                <h3>No Social Media Links</h3>
                <p>Click "Add Social Media" to add your first social media link</p>
              </div>
            ) : (
              <div className="social-links-list">
                {socialLinks.map((link, index) => (
                  <div key={link.id} className="social-link-item">
                    <div className="social-link-drag">
                      <GripVertical size={18} />
                    </div>
                    <div className="social-link-number">{index + 1}</div>
                    
                    <div className="social-link-content">
                      {/* Image Section */}
                      <div className="social-image-section">
                        {link.image ? (
                          <div className="social-image-preview">
                            <img src={link.image} alt={`Social ${index + 1}`} />
                            <div className="social-image-actions">
                              <button 
                                type="button"
                                className="btn-change-small"
                                onClick={() => openImageKitBrowser(link.id)}
                              >
                                Change
                              </button>
                              <button 
                                type="button"
                                className="btn-remove-small"
                                onClick={() => removeImage(link.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            type="button"
                            className="choose-social-image-btn"
                            onClick={() => openImageKitBrowser(link.id)}
                          >
                            <Image size={20} />
                            <span>Choose Icon</span>
                          </button>
                        )}
                      </div>

                      {/* Link Section */}
                      <div className="social-link-input-section">
                        <label className="form-label">Social Media Link</label>
                        <input
                          type="url"
                          className="form-input"
                          placeholder="https://example.com/your-profile"
                          value={link.link}
                          onChange={(e) => updateSocialLink(link.id, 'link', e.target.value)}
                        />
                      </div>
                    </div>

                    <button 
                      className="btn-delete-social"
                      onClick={() => removeSocialLink(link.id)}
                      title="Delete social media link"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

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

export default SocialMediaPage;
