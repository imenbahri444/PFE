import { NavLink } from "react-router-dom";

export default function FM_Sidebar() {
  return (
    <div className="sidebar">
      <h2>Facility Manager</h2>

      <NavLink to="/fm">Dashboard</NavLink>
      <NavLink to="/fm/users">Users</NavLink>
      <NavLink to="/fm/recommendations">AI Recommendations</NavLink>
      <NavLink to="/fm/rooms">Rooms</NavLink>
      <NavLink to="/fm/reports">Reports</NavLink>
    </div>
  );
}
