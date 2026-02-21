import { NavLink } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import "./FM_Sidebar.css";

export default function FM_Sidebar({ collapsed }) {
  const menuSections = [
    {
      title: "DASHBOARD",
      items: [
        { path: "/fm", icon: <FaIcons.FaHome />, label: "Dashboard" },
        { path: "/fm/dashboard", icon: <FaIcons.FaHome />, label: "Dashboard", hidden: true } // Hidden duplicate for active state
      ]
    },
    {
      title: "OPERATIONS",
      items: [
        { path: "/fm/rooms", icon: <FaIcons.FaDoorOpen />, label: "Rooms & Monitoring" },
        { path: "/fm/bookings", icon: <FaIcons.FaCalendarAlt />, label: "Bookings" }
      ]
    },
    {
      title: "AI CONTROL",
      items: [
        { path: "/fm/recommendations", icon: <FaIcons.FaRobot />, label: "AI Recommendations" },
        { path: "/fm/comfort-rules", icon: <FaIcons.FaSlidersH />, label: "Comfort Rules" },
        { path: "/fm/anomalies", icon: <FaIcons.FaExclamationTriangle />, label: "Anomalies" }
      ]
    },
    {
      title: "MANAGEMENT",
      items: [
        { path: "/fm/users", icon: <FaIcons.FaUsers />, label: "Users" },
        { path: "/fm/reports", icon: <FaIcons.FaFileAlt />, label: "Reports" }
      ]
    },
    {
      title: "SYSTEM",
      items: [
        { path: "/fm/settings", icon: <FaIcons.FaCog />, label: "Settings" },
        { path: "/logout", icon: <FaIcons.FaSignOutAlt />, label: "Logout" }
      ]
    }
  ];

  return (
    <div className={`fm-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed ? (
          <div className="logo-text">
            <span className="logo-fm">FM</span>
            <span className="logo-panel">Panel</span>
          </div>
        ) : (
          <div className="logo-icon">FM</div>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="sidebar-section">
            {!collapsed && <div className="section-title">{section.title}</div>}
            {section.items
              .filter(item => !item.hidden) // Filter out hidden items
              .map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => {
                    // Check if either /fm or /fm/dashboard is active for the dashboard link
                    const isDashboardActive = item.path === "/fm" && 
                      (location.pathname === "/fm" || location.pathname === "/fm/dashboard");
                    
                    return `nav-item ${isActive || isDashboardActive ? 'active' : ''}`;
                  }}
                  end={item.path === "/fm"}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">JD</div>
          {!collapsed && (
            <div className="user-details">
              <span className="user-name">John Doe</span>
              <span className="user-role">Facility Manager</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}