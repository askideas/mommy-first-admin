import { useState } from 'react';
import './BundlePage.css';
import HeroSection from './components/HeroSection';
import WhyBundlesSection from './components/WhyBundlesSection';
import GraphSection from './components/GraphSection';
import WhatsInsideSection from './components/WhatsInsideSection';

const BundlePage = () => {
  const [selectedSection, setSelectedSection] = useState('hero');

  const sections = [
    { id: 'hero', name: 'Hero Section' },
    { id: 'whyBundles', name: 'Why Bundles Section' },
    { id: 'graph', name: 'Graph Section' },
    { id: 'whatsInside', name: 'Whats Inside Section' }
  ];

  const renderSectionContent = () => {
    const section = sections.find(s => s.id === selectedSection);
    
    switch (selectedSection) {
      case 'hero':
        return <HeroSection />;
      case 'whyBundles':
        return <WhyBundlesSection />;
      case 'graph':
        return <GraphSection />;
      case 'whatsInside':
        return <WhatsInsideSection />;
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
    <div className="bundlepage-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bundle Page Management</h1>
          <p className="page-subtitle">Organize and manage bundle page sections</p>
        </div>
      </div>

      <div className="bundlepage-layout">
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

export default BundlePage;
