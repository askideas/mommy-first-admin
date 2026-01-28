import { Bell, User, Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
          <span className="user-name">{currentUser?.email?.split('@')[0] || 'Admin'}</span>
        </button>
        <button className="header-action-btn logout-btn" onClick={handleLogout} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
