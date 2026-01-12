import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, X, Upload } from 'lucide-react';
import './SeeHowItWorks.css';

const SeeHowItWorks = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  
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

  const handleVideosSave = () => {
    setSavedVideos([...videos]);
    console.log('Videos Saved:', videos);
    // Add your API call here
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
      <h2 className="section-main-title">See How It Works Configuration</h2>

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
            <button className="btn-cancel" onClick={handleVideosCancel}>Cancel</button>
            <button className="btn-save" onClick={handleVideosSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeHowItWorks;
