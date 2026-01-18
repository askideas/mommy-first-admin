import { useState, useEffect } from 'react';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './NewArrivals.css';

const NewArrivals = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
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
      const docRef = doc(db, 'homepage', 'newarrivals');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.heading) {
          setHeadingData(data.heading);
          setSavedHeadingData(data.heading);
        }
        
        if (data.collections) {
          setCollections(data.collections);
          setSavedCollections(data.collections);
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

  // Heading Section Handlers
  const handleHeadingChange = (field, value) => {
    setHeadingData(prev => ({ ...prev, [field]: value }));
  };

  const handleHeadingSave = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'heading', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'newarrivals');
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

  const handleCollectionsSave = async () => {
    try {
      setLoading(true);
      setSaveStatus({ section: 'collections', status: 'saving' });
      
      const docRef = doc(db, 'homepage', 'newarrivals');
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        collections: collections
      });
      
      setSavedCollections([...collections]);
      setSaveStatus({ section: 'collections', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
      console.log('Collections Saved to Firebase:', collections);
    } catch (error) {
      console.error('Error saving collections:', error);
      setSaveStatus({ section: 'collections', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 2000);
    } finally {
      setLoading(false);
    }
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
            {saveStatus.section === 'collections' && saveStatus.status === 'success' && (
              <span className="save-status success">Saved successfully!</span>
            )}
            {saveStatus.section === 'collections' && saveStatus.status === 'error' && (
              <span className="save-status error">Error saving data</span>
            )}
            <button className="btn-cancel" onClick={handleCollectionsCancel} disabled={loading}>Cancel</button>
            <button className="btn-save" onClick={handleCollectionsSave} disabled={loading}>
              {loading && saveStatus.section === 'collections' ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;
