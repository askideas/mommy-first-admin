import { Home, FileImage, ShoppingBag, Star, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'HomePage', path: '/' },
    { icon: ShoppingBag, label: 'Shop Page', path: '/shop' },
    { icon: Star, label: 'Reviews In Slider', path: '/reviews' },
    { icon: HelpCircle, label: 'FAQs In Slider', path: '/faqs' },
    { icon: FileImage, label: 'Media', path: '/media' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">ADMIN</h2>
        <p className="sidebar-subtitle">E-Commerce Panel</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
