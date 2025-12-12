import { useState } from 'react';
import { Plus, Edit, Trash2, Grid } from 'lucide-react';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Women\'s Fashion', productCount: 45, image: 'https://via.placeholder.com/300', color: '#FD8CBB' },
    { id: 2, name: 'Accessories', productCount: 32, image: 'https://via.placeholder.com/300', color: '#DC5F92' },
    { id: 3, name: 'Jewelry', productCount: 28, image: 'https://via.placeholder.com/300', color: '#FF6B9D' },
    { id: 4, name: 'Bags', productCount: 19, image: 'https://via.placeholder.com/300', color: '#FD8CBB' }
  ]);

  return (
    <div className="categories-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">Organize products by category</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <div className="category-image-container" style={{ background: `linear-gradient(135deg, ${category.color}20 0%, ${category.color}40 100%)` }}>
              <img src={category.image} alt={category.name} className="category-image" />
            </div>
            <div className="category-info">
              <div className="category-header">
                <Grid size={20} style={{ color: category.color }} />
                <h3 className="category-name">{category.name}</h3>
              </div>
              <p className="category-count">{category.productCount} Products</p>
              <div className="category-actions">
                <button className="btn-icon">
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
    </div>
  );
};

export default Categories;
