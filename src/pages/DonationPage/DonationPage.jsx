import { useState } from 'react';
import './DonationPage.css';
import HeroSection from './components/HeroSection';
import MomsActSection from './components/MomsActSection';
import PostpartumSupportSection from './components/PostpartumSupportSection';
import MeaningfulImpactSection from './components/MeaningfulImpactSection';

const DonationPage = () => {
  const [selectedSection, setSelectedSection] = useState('hero');

  const sections = [
    { id: 'hero', name: 'Hero Section' },
    { id: 'moms-act', name: 'Moms Act First Wellness' },
    { id: 'postpartum-support', name: 'Postpartum Support International' },
    { id: 'meaningful-impact', name: 'Meaningful Impact' }
  ];

  const renderSectionContent = () => {
    const section = sections.find(s => s.id === selectedSection);
    
    switch (selectedSection) {
      case 'hero':
        return <HeroSection />;
      case 'moms-act':
        return <MomsActSection />;
      case 'postpartum-support':
        return <PostpartumSupportSection />;
      case 'meaningful-impact':
        return <MeaningfulImpactSection />;
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
    <div className="donation-page">
      <div className="donation-page-header">
        <h1>Donation Page Management</h1>
        <p className="donation-page-subtitle">
          Configure and manage all sections of the Donation page
        </p>
      </div>

      <div className="donation-page-layout">
        <aside className="donation-page-sidebar">
          <nav className="donation-page-nav">
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

        <main className="donation-page-content">
          {renderSectionContent()}
        </main>
      </div>
    </div>
  );
};

export default DonationPage;
