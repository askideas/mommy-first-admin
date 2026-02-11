import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './NavigationSection.css';

const HeaderSection = () => {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [menuItems, setMenuItems] = useState([]);
  const [savedMenuItems, setSavedMenuItems] = useState([]);

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
      const docRef = doc(db, 'navigation', 'header');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        if (data.menuItems) {
          setMenuItems(data.menuItems);
          setSavedMenuItems(data.menuItems);
        }
      }
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = () => {
    const newItem = {
      id: Date.now(),
      label: '',
      link: ''
    };
    setMenuItems(prev => [...prev, newItem]);
  };

  const removeMenuItem = (id) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const updateMenuItem = (id, field, value) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveStatus('saving');
      
      const docRef = doc(db, 'navigation', 'header');
      
      await setDoc(docRef, {
        isEnabled: isEnabled,
        menuItems: menuItems
      });
      
      setSavedIsEnabled(isEnabled);
      setSavedMenuItems([...menuItems]);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Error saving header menu data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEnabled(savedIsEnabled);
    setMenuItems([...savedMenuItems]);
  };

  return (
    <div className="navigation-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Header Menu Configuration</h2>
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
          <div className="add-item-header">
            <p className="section-description">Add menu items for the header navigation. Each item has a label and link.</p>
            <button className="btn-add-item" onClick={addMenuItem}>
              <Plus size={18} />
              <span>Add Menu Item</span>
            </button>
          </div>

          {menuItems.length === 0 ? (
            <div className="empty-placeholder">
              <div className="empty-icon">📋</div>
              <h3>No Menu Items</h3>
              <p>Click "Add Menu Item" to add your first header menu item</p>
            </div>
          ) : (
            <div className="menu-items-list">
              {menuItems.map((item, index) => (
                <div key={item.id} className="menu-item-row">
                  <div className="menu-item-drag">
                    <GripVertical size={18} />
                  </div>
                  <div className="menu-item-number">{index + 1}</div>
                  
                  <div className="menu-item-inputs">
                    <div className="input-group">
                      <label className="input-label">Label</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Menu label"
                        value={item.label}
                        onChange={(e) => updateMenuItem(item.id, 'label', e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Link</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="/page-url or https://..."
                        value={item.link}
                        onChange={(e) => updateMenuItem(item.id, 'link', e.target.value)}
                      />
                    </div>
                  </div>

                  <button 
                    className="btn-delete-item"
                    onClick={() => removeMenuItem(item.id)}
                    title="Delete menu item"
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
  );
};

export default HeaderSection;
