import { Bell, User, Search } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-search">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="search-input"
        />
      </div>

      <div className="header-actions">
        <button className="header-action-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        <button className="header-action-btn user-btn">
          <User size={20} />
          <span className="user-name">Admin</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
