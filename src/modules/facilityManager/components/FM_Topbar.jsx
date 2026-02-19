export default function FM_Topbar({ role }) {
  return (
    <div className="topbar">
      <div>
        <h3>Smart AI Meeting Room</h3>
        <span className="role-badge">{role}</span>
      </div>
      <button>Logout</button>
    </div>
  );
}
