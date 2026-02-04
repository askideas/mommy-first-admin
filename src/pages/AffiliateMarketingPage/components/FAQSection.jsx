import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './AffiliateSection.css';

const FAQSection = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ section: null, status: null });
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [savedIsEnabled, setSavedIsEnabled] = useState(true);
  
  const [faqData, setFaqData] = useState({
    sectionTitle: 'Frequently Asked Questions',
    faqs: []
  });
  const [savedFaqData, setSavedFaqData] = useState(null);

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
      const docRef = doc(db, 'affiliatemarketingpage', 'faq');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.isEnabled !== undefined) {
          setIsEnabled(data.isEnabled);
          setSavedIsEnabled(data.isEnabled);
        }
        
        if (data.faqData) {
          setFaqData(data.faqData);
          setSavedFaqData(data.faqData);
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
      setSaveStatus({ section: 'faq', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
      return;
    }

    try {
      setLoading(true);
      setSaveStatus({ section: 'faq', status: 'saving' });
      
      const docRef = doc(db, 'affiliatemarketingpage', 'faq');
      
      const dataToSave = {
        isEnabled,
        faqData,
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, dataToSave, { merge: true });
      
      setSavedIsEnabled(isEnabled);
      setSavedFaqData({ ...faqData });
      
      setSaveStatus({ section: 'faq', status: 'success' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setSaveStatus({ section: 'faq', status: 'error' });
      setTimeout(() => setSaveStatus({ section: null, status: null }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const hasUnsavedChanges = () => {
    return isEnabled !== savedIsEnabled || 
           JSON.stringify(faqData) !== JSON.stringify(savedFaqData);
  };

  const addFAQ = () => {
    const newFAQ = {
      id: Date.now(),
      question: '',
      answer: ''
    };
    setFaqData(prev => ({
      ...prev,
      faqs: [...prev.faqs, newFAQ]
    }));
  };

  const removeFAQ = (faqId) => {
    setFaqData(prev => ({
      ...prev,
      faqs: prev.faqs.filter(faq => faq.id !== faqId)
    }));
  };

  const updateFAQ = (faqId, field, value) => {
    setFaqData(prev => ({
      ...prev,
      faqs: prev.faqs.map(faq =>
        faq.id === faqId ? { ...faq, [field]: value } : faq
      )
    }));
  };

  return (
    <div className="affiliate-section-container">
      <div className="section-header-row">
        <h2 className="section-main-title">FAQ Section Configuration</h2>
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
        <button
          className="section-header"
          onClick={() => toggleSection('title')}
        >
          <div className="section-header-title">Section Title</div>
          {expandedSection === 'title' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'title' && (
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Section Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={faqData.sectionTitle}
                  onChange={(e) => setFaqData(prev => ({ ...prev, sectionTitle: e.target.value }))}
                  placeholder="e.g., Frequently Asked Questions"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="config-section">
        <button
          className="section-header"
          onClick={() => toggleSection('faqs')}
        >
          <div className="section-header-title">FAQ Items ({faqData.faqs.length})</div>
          {expandedSection === 'faqs' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {expandedSection === 'faqs' && (
          <div className="section-content">
            <div className="cards-list">
              {faqData.faqs.map((faq, index) => (
                <div key={faq.id} className="card-item">
                  <div className="card-item-header">
                    <span className="card-item-title">FAQ {index + 1}</span>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => removeFAQ(faq.id)}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label className="form-label">Question</label>
                      <input
                        type="text"
                        className="form-input"
                        value={faq.question}
                        onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                        placeholder="Enter question..."
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Answer</label>
                      <textarea
                        className="form-textarea"
                        rows={3}
                        value={faq.answer}
                        onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                        placeholder="Enter answer..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn-secondary add-item-btn"
              onClick={addFAQ}
            >
              <Plus size={16} />
              Add FAQ Item
            </button>
          </div>
        )}
      </div>

      <div className="section-actions">
        <button
          className="btn-primary"
          onClick={saveToFirebase}
          disabled={loading || !hasUnsavedChanges()}
        >
          {saveStatus.section === 'faq' && saveStatus.status === 'saving'
            ? 'Saving...'
            : 'Save FAQ Section'}
        </button>
        {saveStatus.section === 'faq' && saveStatus.status === 'success' && (
          <span className="save-status success">Saved successfully!</span>
        )}
        {saveStatus.section === 'faq' && saveStatus.status === 'error' && (
          <span className="save-status error">Error saving data</span>
        )}
      </div>
    </div>
  );
};

export default FAQSection;
