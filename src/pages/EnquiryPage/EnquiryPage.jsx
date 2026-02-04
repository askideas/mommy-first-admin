import { useState } from 'react';
import './EnquiryPage.css';
import HeroSection from './components/HeroSection';
import PartnershipPitchSection from './components/PartnershipPitchSection';
import WholesaleRetailSection from './components/WholesaleRetailSection';
import MedicalProcurementSection from './components/MedicalProcurementSection';
import HealthPlansSection from './components/HealthPlansSection';
import ContactCTASection from './components/ContactCTASection';

const EnquiryPage = () => {
  const [selectedSection, setSelectedSection] = useState('hero');

  const sections = [
    { id: 'hero', name: 'Hero Section' },
    { id: 'partnership', name: 'Partnership Pitch' },
    { id: 'wholesale', name: 'Wholesale & Retail' },
    { id: 'medical', name: 'Medical Procurement' },
    { id: 'health-plans', name: 'Health Plans & Payers' },
    { id: 'contact-cta', name: 'Contact CTA' }
  ];

  const renderSectionContent = () => {
    const section = sections.find(s => s.id === selectedSection);
    
    switch (selectedSection) {
      case 'hero':
        return <HeroSection />;
      case 'partnership':
        return <PartnershipPitchSection />;
      case 'wholesale':
        return <WholesaleRetailSection />;
      case 'medical':
        return <MedicalProcurementSection />;
      case 'health-plans':
        return <HealthPlansSection />;
      case 'contact-cta':
        return <ContactCTASection />;
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
    <div className="enquiry-page">
      <div className="enquiry-page-header">
        <h1>Enquiry Page Management</h1>
        <p className="enquiry-page-subtitle">
          Configure and manage all sections of the Enquiry page
        </p>
      </div>

      <div className="enquiry-page-layout">
        <aside className="enquiry-page-sidebar">
          <nav className="enquiry-page-nav">
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

        <main className="enquiry-page-content">
          {renderSectionContent()}
        </main>
      </div>
    </div>
  );
};

export default EnquiryPage;
