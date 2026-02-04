import { useState } from 'react';
import './CareHubPage.css';
import HeroSection from './components/HeroSection';
import CareGuidesSection from './components/CareGuidesSection';

const CareHubPage = () => {
  const [selectedSection, setSelectedSection] = useState('hero');

  const sections = [
    { id: 'hero', name: 'Hero Section' },
    { id: 'care-guides', name: 'Care Guides' }
  ];

  const renderSectionContent = () => {
    const section = sections.find(s => s.id === selectedSection);
    
    switch (selectedSection) {
      case 'hero':
        return <HeroSection />;
      case 'care-guides':
        return <CareGuidesSection />;
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
    <div className="carehub-page">
      <div className="carehub-page-header">
        <h1>Care Hub Page Management</h1>
        <p className="carehub-page-subtitle">
          Configure and manage all sections of the Care Hub page
        </p>
      </div>

      <div className="carehub-page-layout">
        <aside className="carehub-page-sidebar">
          <nav className="carehub-page-nav">
            {sections.map(section => (
              <button
                key={section.id}
                className={`nav-item ${selectedSection === section.id ? 'active' : ''}`}
                onClick={() => setSelectedSection(section.id)}
              >
                <span className="nav-label">{section.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="carehub-page-content">
          {renderSectionContent()}
        </main>
      </div>
    </div>
  );
};

export default CareHubPage;
