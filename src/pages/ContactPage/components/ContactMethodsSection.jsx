import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './ContactSection.css';

const ContactMethodsSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [contactMethods, setContactMethods] = useState([
    {
      id: 1,
      type: 'Email',
      icon: '✉️',
      responseTime: 'Response time: within 4 hours',
      hours: '',
      phoneNumber: '',
      emails: ['care@themommyfirst.com', 'orders@themommyfirst.com', 'support@themommyfirst.com'],
      note: 'For assistance outside these hours, please email customer support.'
    },
    {
      id: 2,
      type: 'Phone',
      icon: '📞',
      responseTime: '',
      hours: 'Mon–Fri: 9 AM – 5:00 PM - EST',
      phoneNumber: '(845) 300-9289',
      emails: [],
      note: 'For assistance outside these hours, please email customer support.'
    },
    {
      id: 3,
      type: 'WhatsApp',
      icon: '💬',
      responseTime: 'Response time: within 4 hours',
      hours: '',
      phoneNumber: '(845) 300-9289',
      emails: [],
      note: ''
    }
  ]);
  const [savedContactMethods, setSavedContactMethods] = useState(null);

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
      const docRef = doc(db, 'contactpage', 'contactmethods');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.contactMethods) {
          setContactMethods(data.contactMethods);
          setSavedContactMethods(data.contactMethods);
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
      setSaveStatus({ section: 'methods', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'methods', status: 'saving' });
      
      const docRef = doc(db, 'contactpage', 'contactmethods');
      
      const dataToSave = {
        isEnabled,
        contactMethods,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedContactMethods([...contactMethods]);
      
      setSaveStatus({ section: 'methods', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'methods', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const addContactMethod = () => {
    const newMethod = {
      id: Date.now(),
      type: 'New Method',
      icon: '📱',
      responseTime: '',
      hours: '',
      phoneNumber: '',
      emails: [],
      note: ''
    };
    setContactMethods([...contactMethods, newMethod]);
  };

  const removeContactMethod = (index) => {
    setContactMethods(contactMethods.filter((_, i) => i !== index));
  };

  const updateContactMethod = (index, field, value) => {
    const updated = [...contactMethods];
    updated[index][field] = value;
    setContactMethods(updated);
  };

  const addEmail = (index) => {
    const updated = [...contactMethods];
    updated[index].emails.push('');
    setContactMethods(updated);
  };

  const updateEmail = (methodIndex, emailIndex, value) => {
    const updated = [...contactMethods];
    updated[methodIndex].emails[emailIndex] = value;
    setContactMethods(updated);
  };

  const removeEmail = (methodIndex, emailIndex) => {
    const updated = [...contactMethods];
    updated[methodIndex].emails.splice(emailIndex, 1);
    setContactMethods(updated);
  };

  const hasUnsavedChanges = () => {
    return isEnabled !== savedIsEnabled || 
           JSON.stringify(contactMethods) !== JSON.stringify(savedContactMethods);
  };

  return (
    <div className="contact-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">Contact Methods Configuration</h2>
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

      {contactMethods.map((method, index) => (
        <div key={method.id} className="config-section">
          <button
            className="section-header"
            onClick={() => toggleSection(`method-${index}`)}
          >
            <div className="section-header-title">
              {method.icon} {method.type}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {contactMethods.length > 1 && (
                <button
                  className="icon-btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeContactMethod(index);
                  }}
                  title="Remove Contact Method"
                >
                  <Trash2 size={16} />
                </button>
              )}
              {expandedSection === `method-${index}` ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </button>

          {expandedSection === `method-${index}` && (
            <div className="section-content">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <input
                    type="text"
                    className="form-input"
                    value={method.type}
                    onChange={(e) => updateContactMethod(index, 'type', e.target.value)}
                    placeholder="e.g., Email, Phone, WhatsApp"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Icon (Emoji)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={method.icon}
                    onChange={(e) => updateContactMethod(index, 'icon', e.target.value)}
                    placeholder="e.g., ✉️"
                    maxLength={2}
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Response Time</label>
                  <input
                    type="text"
                    className="form-input"
                    value={method.responseTime}
                    onChange={(e) => updateContactMethod(index, 'responseTime', e.target.value)}
                    placeholder="e.g., Response time: within 4 hours"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Hours</label>
                  <input
                    type="text"
                    className="form-input"
                    value={method.hours}
                    onChange={(e) => updateContactMethod(index, 'hours', e.target.value)}
                    placeholder="e.g., Mon–Fri: 9 AM – 5:00 PM - EST"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={method.phoneNumber}
                    onChange={(e) => updateContactMethod(index, 'phoneNumber', e.target.value)}
                    placeholder="e.g., (845) 300-9289"
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Email Addresses</label>
                  {method.emails.map((email, emailIndex) => (
                    <div key={emailIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => updateEmail(index, emailIndex, e.target.value)}
                        placeholder="email@example.com"
                      />
                      <button
                        type="button"
                        className="icon-btn-danger"
                        onClick={() => removeEmail(index, emailIndex)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => addEmail(index)}
                    style={{ marginTop: '8px' }}
                  >
                    <Plus size={16} />
                    Add Email
                  </button>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Note</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={method.note}
                    onChange={(e) => updateContactMethod(index, 'note', e.target.value)}
                    placeholder="Additional note..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <button className="btn-add-item" onClick={addContactMethod}>
        <Plus size={18} />
        Add Contact Method
      </button>

      <div className="save-section">
        <button
          className="btn-primary"
          onClick={saveToFirebase}
          disabled={loading || !hasUnsavedChanges()}
        >
          {saveStatus.section === 'methods' && saveStatus.status === 'saving'
            ? 'Saving...'
            : 'Save Contact Methods Section'}
        </button>
        {saveStatus.section === 'methods' && saveStatus.status === 'success' && (
          <span className="save-status success">Saved successfully!</span>
        )}
        {saveStatus.section === 'methods' && saveStatus.status === 'error' && (
          <span className="save-status error">Error saving data</span>
        )}
      </div>
    </div>
  );
};

export default ContactMethodsSection;
