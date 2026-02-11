import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './NavigationSection.css';

const FooterSection = () => {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  
  // Enable/Disable State
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [sections, setSections] = useState([]);
  const [savedSections, setSavedSections] = useState([]);

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
      const docRef = doc(db, 'navigation', 'footer');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        if (data.sections) {
          setSections(data.sections);
          setSavedSections(data.sections);
        }
      }
    } catch (error) {
      console.error('Error loading data from Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      label: '',
      menuItems: []
    };
    setSections(prev => [...prev, newSection]);
    setExpandedSection(newSection.id);
  };

  const removeSection = (id) => {
    setSections(prev => prev.filter(section => section.id !== id));
    if (expandedSection === id) {
      setExpandedSection(null);
    }
  };

  const updateSectionLabel = (id, value) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, label: value } : section
    ));
  };

  const addMenuItem = (sectionId) => {
    const newItem = {
      id: Date.now(),
      label: '',
      link: ''
    };
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, menuItems: [...section.menuItems, newItem] }
        : section
    ));
  };

  const removeMenuItem = (sectionId, itemId) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, menuItems: section.menuItems.filter(item => item.id !== itemId) }
        : section
    ));
  };

  const updateMenuItem = (sectionId, itemId, field, value) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            menuItems: section.menuItems.map(item => 
              item.id === itemId ? { ...item, [field]: value } : item
            )
          }
        : section
    ));
  };

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveStatus('saving');
      
      const docRef = doc(db, 'navigation', 'footer');
      
      await setDoc(docRef, {
        isEnabled: isEnabled,
        sections: sections
      });
      
      setSavedIsEnabled(isEnabled);
      setSavedSections(JSON.parse(JSON.stringify(sections)));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Error saving footer menu data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEnabled(savedIsEnabled);
    setSections(JSON.parse(JSON.stringify(savedSections)));
  };

  return (
    <div className="navigation-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Footer Menu Configuration</h2>
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
            <p className="section-description">Add sections for the footer navigation. Each section has a title and multiple menu items.</p>
            <button className="btn-add-item" onClick={addSection}>
              <Plus size={18} />
              <span>Add Section</span>
            </button>
          </div>

          {sections.length === 0 ? (
            <div className="empty-placeholder">
              <div className="empty-icon">📋</div>
              <h3>No Sections</h3>
              <p>Click "Add Section" to add your first footer section</p>
            </div>
          ) : (
            <div className="sections-list">
              {sections.map((section, sectionIndex) => (
                <div key={section.id} className="section-card">
                  <div className="section-card-header" onClick={() => toggleSection(section.id)}>
                    <div className="section-card-left">
                      <GripVertical size={18} className="drag-handle" />
                      <span className="section-number">{sectionIndex + 1}</span>
                      <input
                        type="text"
                        className="section-label-input"
                        placeholder="Section Title"
                        value={section.label}
                        onChange={(e) => updateSectionLabel(section.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="menu-count">({section.menuItems.length} items)</span>
                    </div>
                    <div className="section-card-right">
                      <button 
                        className="btn-delete-section"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSection(section.id);
                        }}
                        title="Delete section"
                      >
                        <Trash2 size={16} />
                      </button>
                      {expandedSection === section.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {expandedSection === section.id && (
                    <div className="section-card-content">
                      <div className="add-menu-item-row">
                        <span className="subsection-title">Menu Items</span>
                        <button className="btn-add-menu-item" onClick={() => addMenuItem(section.id)}>
                          <Plus size={16} />
                          <span>Add Menu Item</span>
                        </button>
                      </div>

                      {section.menuItems.length === 0 ? (
                        <div className="empty-menu-items">
                          <p>No menu items. Click "Add Menu Item" to add one.</p>
                        </div>
                      ) : (
                        <div className="menu-items-list nested">
                          {section.menuItems.map((item, itemIndex) => (
                            <div key={item.id} className="menu-item-row nested">
                              <div className="menu-item-number small">{itemIndex + 1}</div>
                              
                              <div className="menu-item-inputs">
                                <div className="input-group">
                                  <label className="input-label">Label</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Menu label"
                                    value={item.label}
                                    onChange={(e) => updateMenuItem(section.id, item.id, 'label', e.target.value)}
                                  />
                                </div>
                                <div className="input-group">
                                  <label className="input-label">Link</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    placeholder="/page-url or https://..."
                                    value={item.link}
                                    onChange={(e) => updateMenuItem(section.id, item.id, 'link', e.target.value)}
                                  />
                                </div>
                              </div>

                              <button 
                                className="btn-delete-item small"
                                onClick={() => removeMenuItem(section.id, item.id)}
                                title="Delete menu item"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
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

export default FooterSection;
