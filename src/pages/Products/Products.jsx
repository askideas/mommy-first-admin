import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Classic Leather Bag', price: 129.99, category: 'Bags', image: 'https://via.placeholder.com/300', visible: true },
    { id: 2, name: 'Summer Dress', price: 89.99, category: 'Clothing', image: 'https://via.placeholder.com/300', visible: true },
    { id: 3, name: 'Gold Necklace', price: 199.99, category: 'Jewelry', image: 'https://via.placeholder.com/300', visible: false }
  ]);

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Manage homepage featured products</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-overlay">
                <button className="overlay-btn">
                  <Edit size={18} />
                </button>
                <button className="overlay-btn">
                  {product.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button className="overlay-btn btn-danger">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
