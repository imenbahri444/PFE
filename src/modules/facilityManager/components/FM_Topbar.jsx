import { useState } from "react";
import { FaBars, FaBell, FaUserCircle, FaCaretDown } from "react-icons/fa";

const CSS = `
  /* ========================================= */
  /* TOPBAR - MAIN STYLES */
  /* ========================================= */

  .topbar {
    height: 70px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    box-shadow: 0 2px 15px rgba(0, 40, 87, 0.08);
    position: sticky;
    top: 0;
    z-index: 90;
  }

  /* ========================================= */
  /* LEFT SECTION */
  /* ========================================= */

  .topbar-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .menu-toggle-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #002857;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .menu-toggle-btn:hover {
    background: rgba(0, 178, 255, 0.1);
    color: #00b2ff;
  }

  .topbar-title {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .topbar h3 {
    color: #002857;
    font-weight: 600;
    font-size: 1.1rem;
    margin: 0;
  }

  .role-badge {
    background: rgba(0, 178, 255, 0.1);
    color: #00b2ff;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  /* ========================================= */
  /* RIGHT SECTION */
  /* ========================================= */

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  /* ========================================= */
  /* NOTIFICATIONS */
  /* ========================================= */

  .notification-wrapper {
    position: relative;
  }

  .notification-btn {
    background: none;
    border: none;
    font-size: 1.3rem;
    color: #002857;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    position: relative;
  }

  .notification-btn:hover {
    background: rgba(0, 178, 255, 0.1);
    color: #00b2ff;
  }

  .notification-badge {
    position: absolute;
    top: 5px;
    right: 5px;
    background: #ff7514;
    color: white;
    font-size: 0.65rem;
    font-weight: 600;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
  }

  /* Notification Dropdown */
  .notification-dropdown {
    position: absolute;
    top: 50px;
    right: 0;
    width: 320px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    border: 1px solid #e9eef2;
    overflow: hidden;
    z-index: 100;
    animation: dropdownFade 0.2s ease;
  }

  .dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 16px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    font-weight: 600;
    color: #1e293b;
    font-size: 0.9rem;
  }

  .notification-count {
    background: #2563eb;
    color: white;
    padding: 2px 8px;
    border-radius: 30px;
    font-size: 0.7rem;
  }

  .notification-list {
    max-height: 280px;
    overflow-y: auto;
  }

  .notification-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.2s ease;
    cursor: pointer;
  }

  .notification-item:hover {
    background: #f8fafc;
  }

  .notification-item.unread {
    background: #f0f9ff;
  }

  .notification-dot {
    width: 8px;
    height: 8px;
    background: #2563eb;
    border-radius: 50%;
    margin-top: 4px;
    flex-shrink: 0;
  }

  .notification-content {
    flex: 1;
  }

  .notification-title {
    color: #1e293b;
    font-size: 0.85rem;
    font-weight: 500;
    margin: 0 0 4px 0;
  }

  .notification-time {
    color: #64748b;
    font-size: 0.7rem;
    margin: 0;
  }

  .dropdown-footer {
    padding: 12px 16px;
    text-align: center;
    border-top: 1px solid #e2e8f0;
    background: #f8fafc;
  }

  .view-all-btn {
    background: none;
    border: none;
    color: #2563eb;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .view-all-btn:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }

  /* ========================================= */
  /* PROFILE */
  /* ========================================= */

  .profile-wrapper {
    position: relative;
  }

  .profile-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    padding: 5px 10px;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .profile-btn:hover {
    background: #f8fafc;
  }

  .profile-icon {
    font-size: 2rem;
    color: #002857;
  }

  .profile-name {
    color: #1e293b;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .profile-caret {
    color: #64748b;
    font-size: 0.8rem;
  }

  /* Profile Dropdown */
  .profile-dropdown {
    position: absolute;
    top: 50px;
    right: 0;
    width: 240px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    border: 1px solid #e9eef2;
    overflow: hidden;
    z-index: 100;
    animation: dropdownFade 0.2s ease;
  }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #f8fafc;
  }

  .profile-dropdown-icon {
    font-size: 2.2rem;
    color: #002857;
  }

  .profile-info {
    display: flex;
    flex-direction: column;
  }

  .profile-dropdown-name {
    color: #1e293b;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .profile-dropdown-role {
    color: #64748b;
    font-size: 0.75rem;
  }

  .dropdown-divider {
    height: 1px;
    background: #e2e8f0;
    margin: 4px 0;
  }

  .dropdown-item {
    width: 100%;
    padding: 12px 16px;
    background: none;
    border: none;
    text-align: left;
    color: #1e293b;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .dropdown-item:hover {
    background: #f1f5f9;
  }

  .dropdown-item.logout-item {
    color: #ef4444;
  }

  .dropdown-item.logout-item:hover {
    background: #fee2e2;
  }

  /* ========================================= */
  /* ANIMATIONS */
  /* ========================================= */

  @keyframes dropdownFade {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ========================================= */
  /* RESPONSIVE */
  /* ========================================= */

  @media (max-width: 768px) {
    .topbar {
      padding: 0 15px;
    }

    .topbar-title h3 {
      font-size: 0.95rem;
    }

    .profile-name {
      display: none;
    }

    .profile-caret {
      display: none;
    }

    .notification-dropdown {
      width: 280px;
      right: -50px;
    }

    .profile-dropdown {
      width: 200px;
    }
  }

  @media (max-width: 480px) {
    .role-badge {
      display: none;
    }
  }
`;

export default function FM_Topbar({ role, onToggleSidebar, userName = "John Doe" }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <>
      <style>{CSS}</style>
      <div className="topbar">
        {/* Left section */}
        <div className="topbar-left">
          <button className="menu-toggle-btn" onClick={onToggleSidebar} aria-label="Toggle menu">
            <FaBars />
          </button>
          <div className="topbar-title">
            <h3>Smart AI Meeting Room</h3>
            <span className="role-badge">{role}</span>
          </div>
        </div>

        {/* Right section */}
        <div className="topbar-right">
          {/* Notifications */}
          <div className="notification-wrapper">
            <button 
              className="notification-btn" 
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <FaBell />
              <span className="notification-badge">3</span>
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="dropdown-header">
                  <span>Notifications</span>
                  <span className="notification-count">3 new</span>
                </div>
                <div className="notification-list">
                  <div className="notification-item unread">
                    <div className="notification-dot"></div>
                    <div className="notification-content">
                      <p className="notification-title">New anomaly detected</p>
                      <p className="notification-time">2 min ago</p>
                    </div>
                  </div>
                  <div className="notification-item unread">
                    <div className="notification-dot"></div>
                    <div className="notification-content">
                      <p className="notification-title">Comfort rule updated</p>
                      <p className="notification-time">15 min ago</p>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-content">
                      <p className="notification-title">Booking confirmed</p>
                      <p className="notification-time">1 hour ago</p>
                    </div>
                  </div>
                </div>
                <div className="dropdown-footer">
                  <button className="view-all-btn">View all</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="profile-wrapper">
            <button 
              className="profile-btn" 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-label="Profile menu"
            >
              <FaUserCircle className="profile-icon" />
              <span className="profile-name">{userName}</span>
              <FaCaretDown className="profile-caret" />
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <FaUserCircle className="profile-dropdown-icon" />
                  <div className="profile-info">
                    <span className="profile-dropdown-name">{userName}</span>
                    <span className="profile-dropdown-role">{role}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item">Profile Settings</button>
                <button className="dropdown-item">Account</button>
                <button className="dropdown-item">Help</button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-item">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}