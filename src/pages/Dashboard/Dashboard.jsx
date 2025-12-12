import { ArrowUpRight, Image as ImageIcon, ShoppingBag, Tag, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    { icon: ShoppingBag, label: 'Total Products', value: '156', change: '+12%', trend: 'up' },
    { icon: Tag, label: 'Categories', value: '24', change: '+3', trend: 'up' },
    { icon: ImageIcon, label: 'Active Banners', value: '8', change: '0', trend: 'neutral' },
    { icon: TrendingUp, label: 'Views Today', value: '2.4K', change: '+18%', trend: 'up' }
  ];

  const recentActivity = [
    { action: 'Product Added', item: 'Summer Collection Dress', time: '2 hours ago' },
    { action: 'Banner Updated', item: 'Hero Banner #1', time: '5 hours ago' },
    { action: 'Category Created', item: 'Winter Accessories', time: '1 day ago' },
    { action: 'Product Updated', item: 'Classic Tote Bag', time: '2 days ago' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Manage your e-commerce homepage</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value">{stat.value}</h3>
                <span className={`stat-change ${stat.trend}`}>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-item-name">{activity.item}</p>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <button className="action-btn">
              <ImageIcon size={20} />
              <span>Add Hero Image</span>
              <ArrowUpRight size={16} />
            </button>
            <button className="action-btn">
              <ShoppingBag size={20} />
              <span>Add Product</span>
              <ArrowUpRight size={16} />
            </button>
            <button className="action-btn">
              <Tag size={20} />
              <span>Add Category</span>
              <ArrowUpRight size={16} />
            </button>
            <button className="action-btn">
              <ImageIcon size={20} />
              <span>Add Banner</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
