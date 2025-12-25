import { useState } from 'react';
import { Plus, Save, Edit, Trash2, X } from 'lucide-react';
import './FaqsSlider.css';

const FaqsSlider = () => {
  const [faqs, setFaqs] = useState([]);
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    status: 'active'
  });

  const handleAddFaqClick = () => {
    setShowFaqForm(true);
    setEditingFaq(null);
    setFaqForm({ question: '', answer: '', status: 'active' });
  };

  const handleSaveFaq = () => {
    if (!faqForm.question || !faqForm.answer) {
      alert('Please fill in all fields');
      return;
    }

    if (editingFaq !== null) {
      const updatedFaqs = [...faqs];
      updatedFaqs[editingFaq] = { ...faqForm };
      setFaqs(updatedFaqs);
    } else {
      setFaqs([...faqs, { ...faqForm }]);
    }

    setShowFaqForm(false);
    setFaqForm({ question: '', answer: '', status: 'active' });
    setEditingFaq(null);
  };

  const handleEditFaq = (index) => {
    setEditingFaq(index);
    setFaqForm({ ...faqs[index] });
    setShowFaqForm(true);
  };

  const handleDeleteFaq = (index) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(faqs.filter((_, i) => i !== index));
    }
  };

  const handleCancelFaq = () => {
    setShowFaqForm(false);
    setFaqForm({ question: '', answer: '', status: 'active' });
    setEditingFaq(null);
  };

  return (
    <div className="faqs-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">FAQs In Slider</h1>
          <p className="page-subtitle">Manage frequently asked questions for slider</p>
        </div>
      </div>

      <div className="faqs-container">
        <div className="section-header">
          <h2 className="section-title">FAQs</h2>
          {!showFaqForm && (
            <button className="btn-add-item" onClick={handleAddFaqClick}>
              <Plus size={16} />
              <span>Add FAQ</span>
            </button>
          )}
        </div>

        {showFaqForm && (
          <div className="faq-form">
            <div className="form-header">
              <h3>{editingFaq !== null ? 'Edit FAQ' : 'Add New FAQ'}</h3>
              <button className="close-button" onClick={handleCancelFaq}>
                <X size={18} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Question</label>
              <input
                type="text"
                className="text-input"
                value={faqForm.question}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                placeholder="Enter FAQ question..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Answer</label>
              <textarea
                className="text-input"
                rows="5"
                value={faqForm.answer}
                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                placeholder="Enter FAQ answer..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="select-input"
                value={faqForm.status}
                onChange={(e) => setFaqForm({ ...faqForm, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="form-actions">
              <button className="cancel-button" onClick={handleCancelFaq}>
                Cancel
              </button>
              <button className="save-button" onClick={handleSaveFaq}>
                <Save size={16} />
                <span>Save FAQ</span>
              </button>
            </div>
          </div>
        )}

        <div className="faqs-list">
          {faqs.length === 0 ? (
            <div className="empty-state">
              <p>No FAQs added yet. Click "Add FAQ" to create one.</p>
            </div>
          ) : (
            <div className="faqs-grid">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-card">
                  <div className="faq-header">
                    <h4 className="faq-question">{faq.question}</h4>
                    <div className="header-actions">
                      <span className={`status-badge ${faq.status}`}>
                        {faq.status}
                      </span>
                      <button
                        className="btn-icon-sm"
                        onClick={() => handleEditFaq(index)}
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn-icon-sm btn-danger"
                        onClick={() => handleDeleteFaq(index)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqsSlider;
