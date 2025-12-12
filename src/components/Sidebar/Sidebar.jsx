import { Home, Image, Grid, Tag, Settings, FileImage } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'HomePage', path: '/' },
    { icon: Image, label: 'Hero Section', path: '/hero' },
    { icon: Grid, label: 'Products', path: '/products' },
    { icon: Tag, label: 'Categories', path: '/categories' },
    { icon: Image, label: 'Banners', path: '/banners' },
    { icon: FileImage, label: 'Media', path: '/media' },
    { icon: Settings, label: 'Settings', path: '/settings' }
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
