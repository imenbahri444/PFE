import { useState } from "react";
import FM_Sidebar from "../modules/facilityManager/components/FM_Sidebar";
import FM_Topbar from "../modules/facilityManager/components/FM_Topbar";

const CSS = `
  .dashboard-container { display:flex; height:100vh; width:100%; overflow:hidden; background:#f2f3f4; }
  .dashboard-main { flex:1; display:flex; flex-direction:column; transition:margin-left 0.28s cubic-bezier(.4,0,.2,1); margin-left:240px; width:calc(100% - 240px); }
  .dashboard-main.expanded { margin-left:72px; width:calc(100% - 72px); }
  .dashboard-content { flex:1; overflow-y:auto; background:#f2f3f4; padding:20px; }
  .dashboard-content::-webkit-scrollbar { width:8px; }
  .dashboard-content::-webkit-scrollbar-track { background:#f2f3f4; }
  .dashboard-content::-webkit-scrollbar-thumb { background:#00b2ff; border-radius:4px; }
  .dashboard-content::-webkit-scrollbar-thumb:hover { background:#0064c8; }
`;

export default function DashboardLayout({ children, role }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <style>{CSS}</style>
      <div className="dashboard-container">
        <FM_Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
        <div className={`dashboard-main${collapsed ? " expanded" : ""}`}>
          <FM_Topbar role={role} onToggleSidebar={() => setCollapsed(v => !v)} />
          <div className="dashboard-content">{children}</div>
        </div>
      </div>
    </>
  );
}