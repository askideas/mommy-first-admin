import { useState } from 'react';
import './ContactPage.css';
import HeroSection from './components/HeroSection';
import FAQSection from './components/FAQSection';
import RecoveryConciergeSection from './components/RecoveryConciergeSection';
import ContactMethodsSection from './components/ContactMethodsSection';
import BusinessPartnersSection from './components/BusinessPartnersSection';
import ReturnsSection from './components/ReturnsSection';

const ContactPage = () => {
  const [selectedSection, setSelectedSection] = useState('hero');

  const sections = [
    { id: 'hero', name: 'Hero Section' },
    { id: 'faq', name: 'FAQ Section' },
    { id: 'recovery', name: 'Recovery Concierge' },
    { id: 'contact-methods', name: 'Contact Methods' },
    { id: 'business', name: 'Business & Partners' },
    { id: 'returns', name: 'Returns & Exchanges' }
  ];

  const renderSectionContent = () => {
    const section = sections.find(s => s.id === selectedSection);
    
    switch (selectedSection) {
      case 'hero':
        return <HeroSection />;
      case 'faq':
        return <FAQSection />;
      case 'recovery':
        return <RecoveryConciergeSection />;
      case 'contact-methods':
        return <ContactMethodsSection />;
      case 'business':
        return <BusinessPartnersSection />;
      case 'returns':
        return <ReturnsSection />;
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
    <div className="contact-page">
      <div className="contact-page-header">
        <h1>Contact Page Management</h1>
        <p className="contact-page-subtitle">
          Configure and manage all sections of the Contact page
        </p>
      </div>

      <div className="contact-page-layout">
        <aside className="contact-page-sidebar">
          <nav className="contact-page-nav">
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

        <main className="contact-page-content">
          {renderSectionContent()}
        </main>
      </div>
    </div>
  );
};

export default ContactPage;
