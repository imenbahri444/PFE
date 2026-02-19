import FM_Sidebar from "../modules/facilityManager/components/FM_Sidebar";
import FM_Topbar from "../modules/facilityManager/components/FM_Topbar";

export default function DashboardLayout({ children, role }) {
  return (
    <div className="dashboard-container">
      <FM_Sidebar />
      <div className="dashboard-main">
        <FM_Topbar role={role} />
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}
