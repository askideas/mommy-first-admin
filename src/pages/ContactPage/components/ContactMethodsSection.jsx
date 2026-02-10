import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './ContactSection.css';

const ContactMethodsSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  // Email Section State
  const [emailSection, setEmailSection] = useState({
    heading: 'Email Us',
    description: 'Get in touch with us via email. We respond within 4 hours.',
    note: 'For assistance outside business hours, please email customer support.',
    emails: [
      { label: 'Customer Care', email: 'care@themommyfirst.com' },
      { label: 'Orders & Shipping', email: 'orders@themommyfirst.com' },
      { label: 'Technical Support', email: 'support@themommyfirst.com' }
    ]
  });
  const [savedEmailSection, setSavedEmailSection] = useState(null);

  // Phone Section State
  const [phoneSection, setPhoneSection] = useState({
    heading: 'Call Us',
    description: 'Mon–Fri: 9 AM – 5:00 PM EST',
    phoneNumber: '(845) 300-9289',
    whatsappHeading: 'WhatsApp',
    whatsappDescription: 'Response time: within 4 hours',
    whatsappNumber: '(845) 300-9289',
    note: 'For assistance outside these hours, please email customer support.'
  });
  const [savedPhoneSection, setSavedPhoneSection] = useState(null);

  // Business Partner Section State
  const [businessSection, setBusinessSection] = useState({
    heading: 'Business Partners',
    subheading: 'Partner with the leader in premium postpartum solutions.',
    buttonLabel: 'BUSINESS ENQUIRIES',
    buttonLink: '/business'
  });
  const [savedBusinessSection, setSavedBusinessSection] = useState(null);

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
        
        if (data.emailSection) {
          setEmailSection(data.emailSection);
          setSavedEmailSection(data.emailSection);
        }
        
        if (data.phoneSection) {
          setPhoneSection(data.phoneSection);
          setSavedPhoneSection(data.phoneSection);
        }
        
        if (data.businessSection) {
          setBusinessSection(data.businessSection);
          setSavedBusinessSection(data.businessSection);
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
        emailSection,
        phoneSection,
        businessSection,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedEmailSection({ ...emailSection });
      setSavedPhoneSection({ ...phoneSection });
      setSavedBusinessSection({ ...businessSection });
      
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

  const updateEmailField = (field, value) => {
    setEmailSection(prev => ({ ...prev, [field]: value }));
  };

  const updateEmailItem = (index, field, value) => {
    const updatedEmails = [...emailSection.emails];
    updatedEmails[index] = { ...updatedEmails[index], [field]: value };
    setEmailSection(prev => ({ ...prev, emails: updatedEmails }));
  };

  const updatePhoneField = (field, value) => {
    setPhoneSection(prev => ({ ...prev, [field]: value }));
  };

  const updateBusinessField = (field, value) => {
    setBusinessSection(prev => ({ ...prev, [field]: value }));
  };

  const hasUnsavedChanges = () => {
    return isEnabled !== savedIsEnabled || 
           JSON.stringify(emailSection) !== JSON.stringify(savedEmailSection) ||
           JSON.stringify(phoneSection) !== JSON.stringify(savedPhoneSection) ||
           JSON.stringify(businessSection) !== JSON.stringify(savedBusinessSection);
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

      {/* Email Section */}
      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('email')}
        >
          <div className="section-header-title">
            ✉️ Email Section
          </div>
          {expandedSection === 'email' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'email' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={emailSection.heading}
                  onChange={(e) => updateEmailField('heading', e.target.value)}
                  placeholder="Enter email section heading"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={emailSection.description}
                  onChange={(e) => updateEmailField('description', e.target.value)}
                  placeholder="Enter email section description"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Note</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={emailSection.note}
                  onChange={(e) => updateEmailField('note', e.target.value)}
                  placeholder="Enter note for email section"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>Email Addresses (3 Fixed)</label>
                
                {emailSection.emails.map((emailItem, index) => (
                  <div key={index} className="email-item-row" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 2fr', 
                    gap: '12px', 
                    marginBottom: '12px',
                    padding: '12px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>Label {index + 1}</label>
                      <input
                        type="text"
                        className="form-input"
                        value={emailItem.label}
                        onChange={(e) => updateEmailItem(index, 'label', e.target.value)}
                        placeholder="e.g., Customer Care"
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px' }}>Email Address {index + 1}</label>
                      <input
                        type="email"
                        className="form-input"
                        value={emailItem.email}
                        onChange={(e) => updateEmailItem(index, 'email', e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Phone Section */}
      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('phone')}
        >
          <div className="section-header-title">
            📞 Phone Section
          </div>
          {expandedSection === 'phone' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'phone' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={phoneSection.heading}
                  onChange={(e) => updatePhoneField('heading', e.target.value)}
                  placeholder="Enter phone section heading"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={phoneSection.description}
                  onChange={(e) => updatePhoneField('description', e.target.value)}
                  placeholder="Enter phone section description (e.g., business hours)"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={phoneSection.phoneNumber}
                  onChange={(e) => updatePhoneField('phoneNumber', e.target.value)}
                  placeholder="e.g., (845) 300-9289"
                />
              </div>

              <div className="form-group full-width" style={{ 
                marginTop: '16px', 
                paddingTop: '16px', 
                borderTop: '1px solid #e0e0e0' 
              }}>
                <label className="form-label" style={{ fontWeight: '700', color: '#25D366' }}>
                  💬 WhatsApp Details
                </label>
              </div>

              <div className="form-group full-width">
                <label className="form-label">WhatsApp Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={phoneSection.whatsappHeading}
                  onChange={(e) => updatePhoneField('whatsappHeading', e.target.value)}
                  placeholder="Enter WhatsApp heading"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">WhatsApp Description</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={phoneSection.whatsappDescription}
                  onChange={(e) => updatePhoneField('whatsappDescription', e.target.value)}
                  placeholder="Enter WhatsApp description"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">WhatsApp Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={phoneSection.whatsappNumber}
                  onChange={(e) => updatePhoneField('whatsappNumber', e.target.value)}
                  placeholder="e.g., (845) 300-9289"
                />
              </div>

              <div className="form-group full-width" style={{ 
                marginTop: '16px', 
                paddingTop: '16px', 
                borderTop: '1px solid #e0e0e0' 
              }}>
                <label className="form-label">Note</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={phoneSection.note}
                  onChange={(e) => updatePhoneField('note', e.target.value)}
                  placeholder="Enter note for phone section"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Business Partner Section */}
      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('business')}
        >
          <div className="section-header-title">
            🤝 Business Partner Section
          </div>
          {expandedSection === 'business' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'business' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Heading</label>
                <input
                  type="text"
                  className="form-input"
                  value={businessSection.heading}
                  onChange={(e) => updateBusinessField('heading', e.target.value)}
                  placeholder="Enter business section heading"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Subheading</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={businessSection.subheading}
                  onChange={(e) => updateBusinessField('subheading', e.target.value)}
                  placeholder="Enter business section subheading"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={businessSection.buttonLabel}
                  onChange={(e) => updateBusinessField('buttonLabel', e.target.value)}
                  placeholder="e.g., BUSINESS ENQUIRIES"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Link</label>
                <input
                  type="text"
                  className="form-input"
                  value={businessSection.buttonLink}
                  onChange={(e) => updateBusinessField('buttonLink', e.target.value)}
                  placeholder="e.g., /business or https://..."
                />
              </div>
            </div>
          </div>
        )}
      </div>

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
