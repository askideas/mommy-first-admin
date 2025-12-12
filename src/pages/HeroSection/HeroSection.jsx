import { useState } from 'react';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import './HeroSection.css';

const HeroSection = () => {
  const [heroes, setHeroes] = useState([
    { id: 1, title: 'Summer Collection 2024', subtitle: 'Up to 50% Off', image: 'https://via.placeholder.com/800x400', active: true },
    { id: 2, title: 'New Arrivals', subtitle: 'Shop the Latest Trends', image: 'https://via.placeholder.com/800x400', active: false }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState(null);

  return (
    <div className="hero-section-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Hero Section</h1>
          <p className="page-subtitle">Manage homepage hero banners</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          Add Hero Banner
        </button>
      </div>

      <div className="hero-grid">
        {heroes.map((hero) => (
          <div key={hero.id} className="hero-card">
            <div className="hero-image-container">
              <img src={hero.image} alt={hero.title} className="hero-image" />
              {hero.active && <span className="active-badge">Active</span>}
            </div>
            <div className="hero-info">
              <h3 className="hero-title">{hero.title}</h3>
              <p className="hero-subtitle">{hero.subtitle}</p>
              <div className="hero-actions">
                <button className="btn-icon" onClick={() => {
                  setEditingHero(hero);
                  setIsModalOpen(true);
                }}>
                  <Edit size={18} />
                </button>
                <button className="btn-icon btn-danger">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingHero ? 'Edit Hero Banner' : 'Add Hero Banner'}
              </h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" className="form-input" placeholder="Enter title" />
              </div>
              <div className="form-group">
                <label className="form-label">Subtitle</label>
                <input type="text" className="form-input" placeholder="Enter subtitle" />
              </div>
              <div className="form-group">
                <label className="form-label">Button Text</label>
                <input type="text" className="form-input" placeholder="Shop Now" />
              </div>
              <div className="form-group">
                <label className="form-label">Button Link</label>
                <input type="text" className="form-input" placeholder="/shop" />
              </div>
              <div className="form-group">
                <label className="form-label">Hero Image</label>
                <div className="upload-area">
                  <Upload size={32} />
                  <p>Click to upload or drag and drop</p>
                  <span className="upload-hint">SVG, PNG, JPG (max. 2MB)</span>
                </div>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Set as active hero</span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary">
                {editingHero ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
