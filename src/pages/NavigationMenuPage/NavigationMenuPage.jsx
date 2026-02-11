import { useState } from 'react';
import './NavigationMenuPage.css';
import HeaderSection from './components/HeaderSection';
import MegaMenuSection from './components/MegaMenuSection';
import FooterSection from './components/FooterSection';

const NavigationMenuPage = () => {
  const [selectedSection, setSelectedSection] = useState('header');

  const sections = [
    { id: 'header', name: 'Header Section' },
    { id: 'megamenu', name: 'Mega Menu Section' },
    { id: 'footer', name: 'Footer Section' }
  ];

  const renderSectionContent = () => {
    switch (selectedSection) {
      case 'header':
        return <HeaderSection />;
      case 'megamenu':
        return <MegaMenuSection />;
      case 'footer':
        return <FooterSection />;
      default:
        return null;
    }
  };

  return (
    <div className="navigationmenu-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Navigation Menu Management</h1>
          <p className="page-subtitle">Manage header, mega menu, and footer navigation</p>
        </div>
      </div>

      <div className="navigationmenu-layout">
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

export default NavigationMenuPage;
