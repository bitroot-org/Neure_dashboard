// MetricsSection.jsx
export const MetricsSection = () => {
  return (
    <div className="row">
      <div className="col-6">
        <div className="card">
          <h5>Company Well-being Index</h5>
          <div className="dashboard-progress">
            <svg viewBox="0 0 100 50">
              <path
                d="M 0 50 A 50 50 0 0 1 100 50"
                fill="none"
                stroke="#1f1f1f"
                strokeWidth="10"
              />
              <path
                d="M 0 50 A 50 50 0 0 1 100 50"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="10"
                strokeDasharray={`${85 * 1.57} 157`}
              />
            </svg>
            <div className="progress-value">
              <div className="metric-value">85</div>
              <div className="metric-label">Good</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-6">
        <div className="card">
          <h5>Total users</h5>
          <div className="metric-value">512</div>
          <div className="status-list">
            <div className="status-item">
              <span className="status-dot active"></span>
              <span>Active 500</span>
            </div>
            <div className="status-item">
              <span className="status-dot inactive"></span>
              <span>Inactive 12</span>
            </div>
          </div>
          <small>Last updated on 21 Apr</small>
        </div>
      </div>
    </div>
  );
};

// Other component exports for WorkshopsSection, ROISection, etc.
export const WorkshopsSection = () => {
  return (
    <div className="card">
      <div className="workshop-header">
        <h4>Upcoming Workshops</h4>
        <button className="view-all">
          View All <span>›</span>
        </button>
      </div>
      <div className="workshop-container">
        <img 
          src="workshop1.png" 
          alt="Workshop" 
          className="workshop-image"
        />
        <div className="workshop-overlay">
          <h5>Workshop title</h5>
          <p>Mumbai | 28 Sep '24</p>
        </div>
      </div>
    </div>
  );
};

// Additional components would follow similar pattern...
// ROISection.jsx
export const ROISection = ({ metrics }) => {
  return (
    <div className="card roi-section">
      <div className="roi-header">
        <h5>ROI</h5>
        <span className="text-secondary">Compare to prev. month</span>
      </div>
      <div className="roi-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="roi-card">
            <span className="metric-title">{metric.title}</span>
            <div className="metric-stats">
              <i className={`fas fa-arrow-${metric.increase ? 'up' : 'down'} 
                ${metric.increase ? 'arrow-up' : 'arrow-down'}`}></i>
              <span className="metric-value">{metric.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// RewardsSection.jsx
export const RewardsSection = () => {
  return (
    <div className="col-6">
      <div className="rewards-card">
        <div className="rewards-header">
          <h5>Rewards & Recognition</h5>
          <span className="coming-soon">COMING SOON!</span>
        </div>
        <img 
          src="Winner.png" 
          alt="Rewards" 
          className="rewards-image"
        />
      </div>
    </div>
  );
};

// NotificationsSection.jsx
export const NotificationsSection = () => {
  return (
    <div className="col-6">
      <div className="notifications-container">
        <div className="card notification-card">
          <div className="notification-content">
            <i className="fas fa-bullhorn"></i>
            <span>Announcements & notifications</span>
            <img src="./Marketing.png" alt="Marketing" className="notification-image" />
          </div>
        </div>
        
        <div className="card help-card">
          <div className="help-content">
            <img src="./character.png" alt="Help" className="help-image" />
            <span>Help & support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ArticlesSection.jsx
export const ArticlesSection = () => {
  return (
    <div className="card articles-section">
      <div className="articles-header">
        <h5>Explore articles on improving mental well-being by Neure.</h5>
        <button className="view-all">View All</button>
      </div>
    </div>
  );
};