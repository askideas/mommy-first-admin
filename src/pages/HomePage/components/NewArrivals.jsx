import { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import './NewArrivals.css';

const NewArrivals = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  
  // Heading Section State
  const [headingData, setHeadingData] = useState({
    heading: '',
    subheading: '',
    description: ''
  });
  const [savedHeadingData, setSavedHeadingData] = useState(null);
  
  // Collections State
  const [collections, setCollections] = useState([]);
  const [savedCollections, setSavedCollections] = useState([]);

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

  // Collections Handlers
  const addCollection = () => {
    const newCollection = {
      id: Date.now(),
      collectionId: '',
      displayName: ''
    };
    setCollections([...collections, newCollection]);
  };

  const removeCollection = (id) => {
    setCollections(collections.filter(col => col.id !== id));
  };

  const handleCollectionChange = (id, field, value) => {
    setCollections(collections.map(col =>
      col.id === id ? { ...col, [field]: value } : col
    ));
  };

  const handleCollectionsSave = () => {
    setSavedCollections([...collections]);
    console.log('New Arrivals Collections Saved:', collections);
    // Add your API call here
  };

  const handleCollectionsCancel = () => {
    if (savedCollections.length > 0) {
      setCollections([...savedCollections]);
    } else {
      setCollections([]);
    }
  };

  return (
    <div className="new-arrivals-container">
      <h2 className="section-main-title">New Arrivals Configuration</h2>

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

      {/* Collections Section */}
      <div className="config-section">
        <div className="section-header-static">
          <span className="section-header-title">Collections</span>
          <button className="btn-add-collection" onClick={addCollection}>
            <Plus size={18} />
            Add Collection
          </button>
        </div>

        <div className="section-content-area">
          {collections.length === 0 ? (
            <div className="empty-state-large">
              <p>No collections added yet. Click "Add Collection" to get started.</p>
            </div>
          ) : (
            <div className="collections-list">
              {collections.map((collection, index) => (
                <div key={collection.id} className="collection-item">
                  <div className="collection-header">
                    <span className="collection-number">Collection {index + 1}</span>
                    <button
                      className="btn-remove-collection"
                      onClick={() => removeCollection(collection.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="collection-fields">
                    <div className="form-group">
                      <label className="form-label">Collection ID</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter collection ID"
                        value={collection.collectionId}
                        onChange={(e) => handleCollectionChange(collection.id, 'collectionId', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Display Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter display name"
                        value={collection.displayName}
                        onChange={(e) => handleCollectionChange(collection.id, 'displayName', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="section-actions">
            <button className="btn-cancel" onClick={handleCollectionsCancel}>Cancel</button>
            <button className="btn-save" onClick={handleCollectionsSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;
