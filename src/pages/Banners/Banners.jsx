import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import './Banners.css';

const Banners = () => {
  const [banners, setBanners] = useState([
    { id: 1, title: 'Sale Banner', position: 'Top', image: 'https://via.placeholder.com/1200x200', active: true },
    { id: 2, title: 'Promo Banner', position: 'Middle', image: 'https://via.placeholder.com/1200x200', active: true },
    { id: 3, title: 'Newsletter Banner', position: 'Bottom', image: 'https://via.placeholder.com/1200x200', active: false }
  ]);

  return (
    <div className="banners-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Banners</h1>
          <p className="page-subtitle">Manage promotional banners</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Add Banner
        </button>
      </div>

      <div className="banners-list">
        {banners.map((banner) => (
          <div key={banner.id} className="banner-item">
            <div className="banner-preview">
              <img src={banner.image} alt={banner.title} />
              {banner.active && <span className="active-badge">Active</span>}
            </div>
            <div className="banner-details">
              <div>
                <h3 className="banner-title">{banner.title}</h3>
                <p className="banner-position">Position: {banner.position}</p>
              </div>
              <div className="banner-actions">
                <button className="btn-icon">
                  <Edit size={18} />
                </button>
                <button className="btn-icon">
                  {banner.active ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button className="btn-icon btn-danger">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banners;
