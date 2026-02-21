import { useState } from "react";
import FM_Sidebar from "../modules/facilityManager/components/FM_Sidebar";
import FM_Topbar from "../modules/facilityManager/components/FM_Topbar";
import "./DashboardLayout.css";

export default function DashboardLayout({ children, role }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="dashboard-container">
      <FM_Sidebar collapsed={sidebarCollapsed} />
      <div className={`dashboard-main ${sidebarCollapsed ? 'expanded' : ''}`}>
        <FM_Topbar role={role} onToggleSidebar={toggleSidebar} />
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}