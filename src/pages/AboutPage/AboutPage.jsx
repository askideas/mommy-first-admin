import { useState } from 'react';
import './AboutPage.css';
import HeroSection from './components/HeroSection';
import HeadingPrepSection from './components/HeadingPrepSection';
import TestimonialsSection from './components/TestimonialsSection';
import InfrastructureSection from './components/InfrastructureSection';
import MissionSection from './components/MissionSection';

const AboutPage = () => {
  const [selectedSection, setSelectedSection] = useState('hero');

  const sections = [
    { id: 'hero', name: 'Hero Section' },
    { id: 'heading-prep', name: 'Heading Prep Section' },
    { id: 'testimonials', name: 'Testimonials Section' },
    { id: 'infrastructure', name: '4th Trimester Infrastructure' },
    { id: 'mission', name: 'Mission Section' }
  ];

  const renderSectionContent = () => {
    const section = sections.find(s => s.id === selectedSection);
    
    switch (selectedSection) {
      case 'hero':
        return <HeroSection />;
      case 'heading-prep':
        return <HeadingPrepSection />;
      case 'testimonials':
        return <TestimonialsSection />;
      case 'infrastructure':
        return <InfrastructureSection />;
      case 'mission':
        return <MissionSection />;
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
    <div className="about-page">
      <div className="about-page-header">
        <h1>About Page Management</h1>
        <p className="about-page-subtitle">
          Configure and manage all sections of the About page
        </p>
      </div>

      <div className="about-page-layout">
        <aside className="about-page-sidebar">
          <nav className="about-page-nav">
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

        <main className="about-page-content">
          {renderSectionContent()}
        </main>
      </div>
    </div>
  );
};

export default AboutPage;
