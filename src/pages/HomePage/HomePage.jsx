import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('hero');

  const sections = [
    {
      id: 'hero',
      title: 'Hero Section',
      items: [
        { id: 1, name: 'Main Hero Banner', status: 'Active' },
        { id: 2, name: 'Secondary Banner', status: 'Inactive' }
      ]
    },
    {
      id: 'featured',
      title: 'Featured Products',
      items: [
        { id: 1, name: 'Summer Collection', status: 'Active' },
        { id: 2, name: 'New Arrivals', status: 'Active' }
      ]
    },
    {
      id: 'categories',
      title: 'Category Section',
      items: [
        { id: 1, name: 'Women Fashion', status: 'Active' },
        { id: 2, name: 'Accessories', status: 'Active' },
        { id: 3, name: 'Jewelry', status: 'Active' }
      ]
    },
    {
      id: 'promotions',
      title: 'Promotional Banners',
      items: [
        { id: 1, name: 'Sale Banner', status: 'Active' },
        { id: 2, name: 'Newsletter Banner', status: 'Inactive' }
      ]
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      items: [
        { id: 1, name: 'Customer Reviews', status: 'Active' }
      ]
    },
    {
      id: 'newsletter',
      title: 'Newsletter Section',
      items: [
        { id: 1, name: 'Subscribe Form', status: 'Active' }
      ]
    }
  ];

  const activeSection = sections.find(s => s.id === activeTab);

  return (
    <div className="homepage-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">HomePage Management</h1>
          <p className="page-subtitle">Organize and manage all homepage sections</p>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs-nav">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`tab-button ${activeTab === section.id ? 'active' : ''}`}
              onClick={() => setActiveTab(section.id)}
            >
              {section.title}
            </button>
          ))}
        </div>

        <div className="tab-content">
          <div className="tab-content-header">
            <h3 className="section-title">{activeSection.title}</h3>
            <button className="btn-add-item">
              <Plus size={16} />
              Add Item
            </button>
          </div>

          <div className="items-list">
            {activeSection.items.map((item) => (
              <div key={item.id} className="item-row">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className={`item-status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </div>
                <div className="item-actions">
                  <button className="btn-icon-sm">
                    <Edit size={14} />
                  </button>
                  <button className="btn-icon-sm btn-danger">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;