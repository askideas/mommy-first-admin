import { useState } from 'react';
import './HomePage.css';
import HeroSection from './components/HeroSection';

const HomePage = () => {
  const [selectedSection, setSelectedSection] = useState('hero');

  const sections = [
    { id: 'hero', name: 'Hero Section' },
    { id: 'text', name: 'Text Section' },
    { id: 'recommended-bundles', name: 'Recommended Bundles' },
    { id: 'new-arrivals', name: 'New Arrivals' },
    { id: 'shop-by-category', name: 'Shop by Category' },
    { id: 'moms-trust', name: 'Moms Trust' },
    { id: 'how-it-works', name: 'See How It Works' },
    { id: 'reviews', name: 'Reviews' },
    { id: 'events', name: 'Events' },
    { id: 'free-guide', name: 'Free Guide' },
    { id: 'blogs', name: 'Blogs' }
  ];

  const renderSectionContent = () => {
    const section = sections.find(s => s.id === selectedSection);
    
    switch (selectedSection) {
      case 'hero':
        return <HeroSection />;
      default:
        return (
          <div className="section-content-empty">
            <h2>{section?.name}</h2>
            <p>Content for {section?.name} will be added here</p>
          </div>
        );
    }
  };

  return (
    <div className="homepage-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">HomePage Management</h1>
          <p className="page-subtitle">Organize and manage all homepage sections</p>
        </div>
      </div>

      <div className="homepage-layout">
        {/* Left Column - Sections List */}
        <div className="sections-sidebar">
          <h3 className="sidebar-title">Sections</h3>
          <div className="sections-list">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`section-item ${selectedSection === section.id ? 'active' : ''}`}
                onClick={() => setSelectedSection(section.id)}
              >
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Section Content */}
        <div className="section-content">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};

export default HomePage;