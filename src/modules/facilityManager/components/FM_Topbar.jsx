import { FaBars } from "react-icons/fa";
import "./FM_Topbar.css";

export default function FM_Topbar({ role, onToggleSidebar }) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle-btn" onClick={onToggleSidebar}>
          <FaBars />
        </button>
        <div className="topbar-title">
          <h3>Smart AI Meeting Room</h3>
          <span className="role-badge">{role}</span>
        </div>
      </div>
      <button className="logout-btn">Logout</button>
    </div>
  );
}