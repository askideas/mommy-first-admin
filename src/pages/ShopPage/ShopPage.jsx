import { useState } from 'react';
import './ShopPage.css';
import ShopHeroSection from './components/ShopHeroSection';
import EspotConfiguration from './components/EspotConfiguration';

const ShopPage = () => {
  const [selectedSection, setSelectedSection] = useState('hero');

  const sections = [
    { id: 'hero', name: 'Hero Section' },
    { id: 'espot', name: 'Espot Configuration' }
  ];

  const renderSectionContent = () => {
    const section = sections.find(s => s.id === selectedSection);
    
    switch (selectedSection) {
      case 'hero':
        return <ShopHeroSection />;
      case 'espot':
        return <EspotConfiguration />;
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
    <div className="shoppage-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Shop Page Management</h1>
          <p className="page-subtitle">Organize and manage shop page sections</p>
        </div>
      </div>

      <div className="shoppage-layout">
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

export default ShopPage;
