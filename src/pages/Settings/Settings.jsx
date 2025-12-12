import { Save } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure your store settings</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h3 className="settings-card-title">General Settings</h3>
          <div className="form-group">
            <label className="form-label">Store Name</label>
            <input type="text" className="form-input" placeholder="My Store" />
          </div>
          <div className="form-group">
            <label className="form-label">Store Tagline</label>
            <input type="text" className="form-input" placeholder="Your fashion destination" />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Email</label>
            <input type="email" className="form-input" placeholder="contact@store.com" />
          </div>
        </div>

        <div className="settings-card">
          <h3 className="settings-card-title">Homepage Settings</h3>
          <div className="form-group">
            <label className="form-label">Featured Products Count</label>
            <input type="number" className="form-input" placeholder="8" />
          </div>
          <div className="form-group">
            <label className="form-label">Categories Display</label>
            <select className="form-input">
              <option>Grid View</option>
              <option>Carousel</option>
              <option>List View</option>
            </select>
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Show Hero Section</span>
            </label>
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Show Featured Products</span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-footer">
        <button className="btn-primary">
          <Save size={20} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
