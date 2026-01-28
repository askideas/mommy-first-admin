import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, X, Upload } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './SeeHowItWorks.css';

const SeeHowItWorks = () => {
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
  
  // Videos State
  const [videos, setVideos] = useState([]);
  const [savedVideos, setSavedVideos] = useState([]);

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
      const docRef = doc(db, 'homepage', 'seehowworks');
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
        
        if (data.videos) {
          setVideos(data.videos);
          setSavedVideos(data.videos);
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
      const docRef = doc(db, 'homepage', 'seehowworks');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        isEnabled: newState
      });
      
      setSavedIsEnabled(newState);
      console.log('See How It Works enabled state:', newState);
    } catch (error) {
      console.error('Error saving enabled state:', error);
      setIsEnabled(!newState);
    }
  };

  // Heading Section Handlers
  const handleHeadingChange = (field, value) => {
    setHeadingData(prev => ({ ...prev, [field]: value }));
  };

  const handleHeadingSave = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'heading', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'seehowworks');
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

  // Video Section Handlers
  const addVideo = () => {
    const newVideo = {
      id: Date.now(),
      label: '',
      video: null,
      videoName: ''
    };
    setVideos([...videos, newVideo]);
  };

  const removeVideo = (id) => {
    setVideos(videos.filter(vid => vid.id !== id));
  };

  const handleVideoLabelChange = (id, value) => {
    setVideos(videos.map(vid =>
      vid.id === id ? { ...vid, label: value } : vid
    ));
  };

  const handleVideoUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideos(videos.map(vid =>
          vid.id === id ? { ...vid, video: reader.result, videoName: file.name } : vid
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeVideoFile = (id) => {
    setVideos(videos.map(vid =>
      vid.id === id ? { ...vid, video: null, videoName: '' } : vid
    ));
  };

  const handleVideosSave = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'videos', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'seehowworks');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        videos: videos
      });
      
      setSavedVideos([...videos]);
      setSaveStatus({ section: 'videos', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
      console.log('Videos Saved to Firebase:', videos);
    } catch (error) {
      console.error('Error saving videos:', error);
      setSaveStatus({ section: 'videos', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleVideosCancel = () => {
    if (savedVideos.length > 0) {
      setVideos([...savedVideos]);
    } else {
      setVideos([]);
    }
  };

  return (
    <div className="see-how-it-works-container">
      <div className="section-header-row">
        <h2 className="section-main-title">See How It Works Configuration</h2>
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

      {/* Video Section */}
      <div className="config-section">
        <div className="section-header-static">
          <span className="section-header-title">Video Section</span>
          <button className="btn-add-video" onClick={addVideo}>
            <Plus size={18} />
            Add Video
          </button>
        </div>

        <div className="section-content-area">
          {videos.length === 0 ? (
            <div className="empty-state-large">
              <p>No videos added yet. Click "Add Video" to get started.</p>
            </div>
          ) : (
            <div className="videos-list">
              {videos.map((video, index) => (
                <div key={video.id} className="video-item">
                  <div className="video-header">
                    <span className="video-number">Video {index + 1}</span>
                    <button
                      className="btn-remove-video"
                      onClick={() => removeVideo(video.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="video-fields">
                    <div className="form-group">
                      <label className="form-label">Label</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter video label"
                        value={video.label}
                        onChange={(e) => handleVideoLabelChange(video.id, e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Video Upload</label>
                      <div className="video-upload-area">
                        {video.video ? (
                          <div className="video-preview">
                            <video controls src={video.video} />
                            <div className="video-info">
                              <span className="video-name">{video.videoName}</span>
                              <button 
                                className="btn-remove-video-file"
                                onClick={() => removeVideoFile(video.id)}
                              >
                                <X size={16} />
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="upload-label">
                            <Upload size={24} />
                            <span>Click to upload video</span>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => handleVideoUpload(video.id, e)}
                              style={{ display: 'none' }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="section-actions">
            {saveStatus.section === 'videos' && saveStatus.status === 'success' && (
              <span className="save-status success">Saved successfully!</span>
            )}
            {saveStatus.section === 'videos' && saveStatus.status === 'error' && (
              <span className="save-status error">Error saving data</span>
            )}
            <button className="btn-cancel" onClick={handleVideosCancel} disabled={loading}>Cancel</button>
            <button className="btn-save" onClick={handleVideosSave} disabled={loading}>
              {loading && saveStatus.section === 'videos' ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeHowItWorks;
