import { useState } from 'react';
import './AffiliateMarketingPage.css';
import HeroSection from './components/HeroSection';
import WhyBecomeSection from './components/WhyBecomeSection';
import ApplyAccessEarnSection from './components/ApplyAccessEarnSection';
import ProgramFeaturesSection from './components/ProgramFeaturesSection';
import FAQSection from './components/FAQSection';

const AffiliateMarketingPage = () => {
  const [selectedSection, setSelectedSection] = useState('hero');

  const sections = [
    { id: 'hero', name: 'Hero Section' },
    { id: 'why-become', name: 'Why Become an Influencing Figure' },
    { id: 'apply-access-earn', name: 'Apply Access Earn' },
    { id: 'program-features', name: 'Program Features' },
    { id: 'faq', name: 'FAQ Section' }
  ];

  const renderSectionContent = () => {
    const section = sections.find(s => s.id === selectedSection);
    
    switch (selectedSection) {
      case 'hero':
        return <HeroSection />;
      case 'why-become':
        return <WhyBecomeSection />;
      case 'apply-access-earn':
        return <ApplyAccessEarnSection />;
      case 'program-features':
        return <ProgramFeaturesSection />;
      case 'faq':
        return <FAQSection />;
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
    <div className="affiliate-page">
      <div className="affiliate-page-header">
        <h1>Affiliate Marketing Page Management</h1>
        <p className="affiliate-page-subtitle">
          Configure and manage all sections of the Affiliate Marketing page
        </p>
      </div>

      <div className="affiliate-page-layout">
        <aside className="affiliate-page-sidebar">
          <nav className="affiliate-page-nav">
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

        <main className="affiliate-page-content">
          {renderSectionContent()}
        </main>
      </div>
    </div>
  );
};

export default AffiliateMarketingPage;
