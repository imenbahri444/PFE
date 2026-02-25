import { useState, useEffect } from "react";
import {
  FaExclamationTriangle, FaExclamationCircle, FaInfoCircle,
  FaCheckCircle, FaClock, FaMapMarkerAlt, FaBuilding,
  FaWrench, FaTools, FaClipboardList,
  FaArrowLeft, FaSearch,
  FaBell, FaEnvelope, FaPhone,
  FaDownload, FaShare
} from "react-icons/fa";
import { MdDevices } from "react-icons/md";
import "./FM_Anomalies.css";

/* ── Data ───────────────────────────────────────────────────── */
const INITIAL_DATA = [
  {
    id: 1, title: "CO2 Levels Critical in Conference A",
    description: "CO2 concentration has exceeded critical threshold of 1000ppm for 30 minutes. Ventilation system may be malfunctioning.",
    severity: "critical", category: "air-quality", status: "active",
    location: { roomId: "RM001", roomName: "Conference A", floor: 2, department: "Sales & Marketing" },
    sensor: { id: "SEN001", type: "CO2 Sensor", currentValue: 1240, unit: "ppm", threshold: 1000 },
    detectedAt: "2026-02-23T09:15:00", lastUpdated: "2026-02-23T09:45:00", duration: "30 minutes",
    reportedBy: { name: "Jean Dupont", role: "IT Administrator", email: "jean.dupont@company.com", phone: "+33 1 23 45 67 89", avatar: "JD" },
    assignedTo: "Facility Management", system: "HVAC System", affectedUsers: 12,
    materials: [{ name: "HVAC Filter Replacement", quantity: 2, unit: "pieces", urgent: true }, { name: "CO2 Sensor Calibration Kit", quantity: 1, unit: "kit", urgent: false }],
    actions: [{ id: 1, description: "Check ventilation system", completed: false }, { id: 2, description: "Calibrate CO2 sensor", completed: false }, { id: 3, description: "Increase air exchange rate", completed: true }],
    notes: "Multiple complaints from employees about stuffy air. Maintenance notified."
  },
  {
    id: 2, title: "Temperature Sensor Offline - Meeting Room 2",
    description: "Temperature sensor has stopped reporting data. Possible hardware failure or connection issue.",
    severity: "high", category: "hardware", status: "investigating",
    location: { roomId: "RM002", roomName: "Meeting Room 2", floor: 1, department: "Engineering" },
    sensor: { id: "SEN005", type: "Temperature Sensor", currentValue: null, unit: "°C", threshold: "N/A" },
    detectedAt: "2026-02-23T08:30:00", lastUpdated: "2026-02-23T09:30:00", duration: "1 hour",
    reportedBy: { name: "Marie Martin", role: "IT Administrator", email: "marie.martin@company.com", phone: "+33 1 23 45 67 90", avatar: "MM" },
    assignedTo: "IT Support", system: "Sensor Network", affectedUsers: 0,
    materials: [{ name: "Temperature Sensor", quantity: 1, unit: "piece", urgent: true }, { name: "Wireless Module", quantity: 1, unit: "piece", urgent: false }],
    actions: [{ id: 1, description: "Check sensor connection", completed: false }, { id: 2, description: "Replace batteries", completed: true }, { id: 3, description: "Replace sensor if faulty", completed: false }],
    notes: "Sensor not responding to ping. Network connectivity confirmed."
  },
  {
    id: 3, title: "Lighting System Malfunction - Training Hall",
    description: "Three light fixtures not responding to commands. Flickering reported during training session.",
    severity: "medium", category: "lighting", status: "pending",
    location: { roomId: "RM003", roomName: "Training Hall", floor: 3, department: "HR & Training" },
    actuator: { id: "ACT007", type: "Lighting Actuator", status: "faulty" },
    detectedAt: "2026-02-23T07:45:00", lastUpdated: "2026-02-23T08:15:00", duration: "1.5 hours",
    reportedBy: { name: "Pierre Dubois", role: "IT Administrator", email: "pierre.dubois@company.com", phone: "+33 1 23 45 67 91", avatar: "PD" },
    assignedTo: "Electrical Maintenance", system: "Lighting Control", affectedUsers: 8,
    materials: [{ name: "LED Driver", quantity: 3, unit: "pieces", urgent: true }, { name: "Light Fixture", quantity: 1, unit: "piece", urgent: false }],
    actions: [{ id: 1, description: "Check circuit breaker", completed: true }, { id: 2, description: "Test individual fixtures", completed: false }, { id: 3, description: "Replace faulty drivers", completed: false }],
    notes: "Intermittent issue. Happens more frequently during peak usage."
  },
  {
    id: 4, title: "Projector Bulb Failure - Executive Boardroom",
    description: "Projector bulb has reached end of life. Replacement needed for upcoming board meeting.",
    severity: "medium", category: "av-equipment", status: "scheduled",
    location: { roomId: "RM004", roomName: "Executive Boardroom", floor: 4, department: "Executive" },
    device: { id: "AV001", type: "Projector", model: "Sony VPL-FHZ60" },
    detectedAt: "2026-02-22T16:30:00", lastUpdated: "2026-02-23T09:00:00", duration: "16.5 hours",
    scheduledFix: "2026-02-24T08:00:00",
    reportedBy: { name: "Sophie Bernard", role: "IT Administrator", email: "sophie.bernard@company.com", phone: "+33 1 23 45 67 92", avatar: "SB" },
    assignedTo: "AV Team", system: "AV Equipment", affectedUsers: 6,
    materials: [{ name: "Projector Bulb", quantity: 1, unit: "piece", urgent: true }, { name: "Air Filter", quantity: 1, unit: "piece", urgent: false }],
    actions: [{ id: 1, description: "Order replacement bulb", completed: true }, { id: 2, description: "Schedule maintenance", completed: true }, { id: 3, description: "Replace bulb", completed: false }],
    notes: "Board meeting scheduled for 10 AM. Must be fixed before then."
  },
  {
    id: 5, title: "Network Connectivity Issue - Innovation Hub",
    description: "WiFi access point in Innovation Hub is experiencing intermittent connectivity. Users reporting dropped connections.",
    severity: "high", category: "network", status: "investigating",
    location: { roomId: "RM005", roomName: "Innovation Hub", floor: 2, department: "R&D" },
    device: { id: "NW001", type: "Access Point", model: "Cisco AP-9152" },
    detectedAt: "2026-02-23T08:00:00", lastUpdated: "2026-02-23T09:15:00", duration: "1.25 hours",
    reportedBy: { name: "Thomas Petit", role: "Network Administrator", email: "thomas.petit@company.com", phone: "+33 1 23 45 67 93", avatar: "TP" },
    assignedTo: "Network Team", system: "Network Infrastructure", affectedUsers: 15,
    materials: [{ name: "Network Cable Cat6", quantity: 1, unit: "box", urgent: false }, { name: "Access Point", quantity: 1, unit: "piece", urgent: false }],
    actions: [{ id: 1, description: "Check switch configuration", completed: false }, { id: 2, description: "Test signal strength", completed: true }, { id: 3, description: "Replace access point if faulty", completed: false }],
    notes: "Issue started after network upgrade. Possibly configuration related."
  },
  {
    id: 6, title: "Door Lock Malfunction - Quiet Room",
    description: "Electronic door lock not responding to access cards. Manual override working.",
    severity: "medium", category: "security", status: "active",
    location: { roomId: "RM006", roomName: "Quiet Room", floor: 1, department: "General" },
    device: { id: "SEC001", type: "Electronic Lock", model: "Assa Abloy" },
    detectedAt: "2026-02-23T06:30:00", lastUpdated: "2026-02-23T08:45:00", duration: "2.25 hours",
    reportedBy: { name: "Isabelle Moreau", role: "Security Admin", email: "isabelle.moreau@company.com", phone: "+33 1 23 45 67 94", avatar: "IM" },
    assignedTo: "Security Team", system: "Access Control", affectedUsers: 4,
    materials: [{ name: "Lock Mechanism", quantity: 1, unit: "piece", urgent: false }, { name: "Battery Pack", quantity: 2, unit: "pieces", urgent: true }],
    actions: [{ id: 1, description: "Replace batteries", completed: true }, { id: 2, description: "Test card reader", completed: true }, { id: 3, description: "Replace lock mechanism", completed: false }],
    notes: "Temporary fix applied. Replacement parts ordered."
  }
];

const SEVERITY_WEIGHT = { critical: 3, high: 2, medium: 1, low: 0 };

const SEVERITY_ICON = {
  critical: (cls) => <FaExclamationCircle className={`severity-icon ${cls}`} />,
  high:     (cls) => <FaExclamationTriangle className={`severity-icon ${cls}`} />,
  medium:   (cls) => <FaInfoCircle className={`severity-icon ${cls}`} />,
  low:      (cls) => <FaInfoCircle className={`severity-icon ${cls}`} />,
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr);
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 60)  return `${m} minute${m !== 1 ? "s" : ""} ago`;
  if (h < 24)  return `${h} hour${h !== 1 ? "s" : ""} ago`;
  return `${d} day${d !== 1 ? "s" : ""} ago`;
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ── Component ──────────────────────────────────────────────── */
export default function FM_Anomalies() {
  const [anomalies, setAnomalies] = useState(() => {
    try { return JSON.parse(localStorage.getItem("anomalies")) || INITIAL_DATA; }
    catch { return INITIAL_DATA; }
  });
  const [selected, setSelected]   = useState(null);
  const [search, setSearch]       = useState("");
  const [filters, setFilters]     = useState({ severity: "all", status: "all", category: "all", sort: "newest" });

  useEffect(() => { localStorage.setItem("anomalies", JSON.stringify(anomalies)); }, [anomalies]);

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const visible = anomalies
    .filter(a => {
      const q = search.toLowerCase();
      return (
        (a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.location.roomName.toLowerCase().includes(q)) &&
        (filters.severity === "all" || a.severity === filters.severity) &&
        (filters.status   === "all" || a.status   === filters.status) &&
        (filters.category === "all" || a.category === filters.category)
      );
    })
    .sort((a, b) => {
      if (filters.sort === "severity") return SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity];
      if (filters.sort === "oldest")  return new Date(a.detectedAt) - new Date(b.detectedAt);
      return new Date(b.detectedAt) - new Date(a.detectedAt);
    });

  /* ── List View ── */
  if (!selected) return (
    <div className="anomalies-container">
      <div className="anomalies-header">
        <div>
          <h1 className="anomalies-title">System Anomalies</h1>
          <p className="anomalies-subtitle">Monitor and manage all system anomalies, sensor failures, and equipment issues</p>
        </div>
        <div className="header-stats">
          {[
            { key: "critical", label: "Critical" },
            { key: "high",     label: "High" },
            { key: "medium",   label: "Medium" },
          ].map(({ key, label }) => (
            <div className="stat-item" key={key}>
              <span className={`stat-value ${key}`}>{anomalies.filter(a => a.severity === key).length}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
          <div className="stat-item">
            <span className="stat-value total">{anomalies.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </div>

      <div className="filters-bar">
        {/* Search */}
        <div className="filter-top">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search anomalies…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="search-clear" onClick={() => setSearch("")}>×</button>}
          </div>
          <div className="filter-meta">
            <span className="filter-count">{visible.length} of {anomalies.length} results</span>
            {(filters.severity !== "all" || filters.status !== "all" || filters.category !== "all" || search) && (
              <button className="filter-reset" onClick={() => { setFilters(f => ({ ...f, severity:"all", status:"all", category:"all" })); setSearch(""); }}>
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Pill rows */}
        <div className="filter-rows">
          <div className="filter-row">
            <span className="filter-row-label">Severity</span>
            <div className="filter-pills">
              {[
                { val: "all",      label: "All" },
                { val: "critical", label: "Critical", dot: "#ef4444" },
                { val: "high",     label: "High",     dot: "#f97316" },
                { val: "medium",   label: "Medium",   dot: "#eab308" },
              ].map(({ val, label, dot }) => (
                <button key={val} data-val={val} className={`fpill${filters.severity === val ? " active" : ""}`} onClick={() => setFilter("severity", val)}>
                  {dot && <i className="fpill-dot" style={{ background: dot }} />}
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-row">
            <span className="filter-row-label">Status</span>
            <div className="filter-pills">
              {["all","active","investigating","pending","scheduled"].map(val => (
                <button key={val} className={`fpill${filters.status === val ? " active" : ""}`} onClick={() => setFilter("status", val)}>
                  {val === "all" ? "All" : cap(val)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-row">
            <span className="filter-row-label">Category</span>
            <div className="filter-pills">
              {[
                { val: "all", label: "All" }, { val: "air-quality", label: "Air Quality" },
                { val: "hardware", label: "Hardware" }, { val: "lighting", label: "Lighting" },
                { val: "av-equipment", label: "AV" }, { val: "network", label: "Network" }, { val: "security", label: "Security" },
              ].map(({ val, label }) => (
                <button key={val} className={`fpill${filters.category === val ? " active" : ""}`} onClick={() => setFilter("category", val)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-row">
            <span className="filter-row-label">Sort by</span>
            <div className="filter-pills">
              {[{ val:"newest", label:"Newest" }, { val:"oldest", label:"Oldest" }, { val:"severity", label:"Severity" }].map(({ val, label }) => (
                <button key={val} className={`fpill${filters.sort === val ? " active" : ""}`} onClick={() => setFilter("sort", val)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="anomalies-grid">
        {visible.map(a => (
          <div key={a.id} className={`anomaly-card severity-${a.severity}`} onClick={() => setSelected(a)}>
            <div className="card-header">
              <div className="severity-badge">
                {SEVERITY_ICON[a.severity]("sm")}
                <span>{cap(a.severity)}</span>
              </div>
              <span className={`status-badge status-${a.status}`}>{a.status}</span>
            </div>
            <h3 className="card-title">{a.title}</h3>
            <p className="card-description">{a.description}</p>
            <div className="card-location">
              <FaMapMarkerAlt className="location-icon" />
              <span>{a.location.roomName} · Floor {a.location.floor}</span>
            </div>
            <div className="card-meta">
              <div className="meta-time"><FaClock className="meta-icon" /><span>{timeAgo(a.detectedAt)}</span></div>
              <div className="meta-reporter">
                <div className="reporter-avatar-small">{a.reportedBy.avatar}</div>
                <span>{a.reportedBy.name}</span>
              </div>
            </div>
            {a.materials?.some(m => m.urgent) && (
              <div className="urgent-badge"><FaWrench /> Materials Needed</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  /* ── Detail View ── */
  const a = selected;
  return (
    <div className="anomalies-container">
      <div className="anomaly-detail">
        <button className="back-button" onClick={() => setSelected(null)}>
          <FaArrowLeft /> Back to Anomalies
        </button>

        <div className="detail-header">
          <div className="detail-title-section">
            <div className={`detail-severity severity-${a.severity}`}>
              {SEVERITY_ICON[a.severity]("md")}
              <span>{cap(a.severity)}</span>
            </div>
            <h2 className="detail-title">{a.title}</h2>
          </div>
          <div className="detail-actions">
            <button className="action-btn"><FaCheckCircle /> Mark Resolved</button>
            <button className="action-btn"><FaWrench /> Assign to Team</button>
            <button className="action-btn"><FaDownload /> Export</button>
          </div>
        </div>

        <div className="detail-content">
          {/* Left */}
          <div className="detail-left">
            <div className="info-section">
              <h3>Description</h3>
              <p className="detail-description">{a.description}</p>
            </div>

            <div className="info-section">
              <h3>Location</h3>
              <div className="location-details">
                <div className="detail-card">
                  <FaBuilding className="detail-icon" />
                  <div><strong>{a.location.roomName}</strong><span>Room {a.location.roomId}</span></div>
                </div>
                <div className="detail-card">
                  <FaMapMarkerAlt className="detail-icon" />
                  <div><strong>Floor {a.location.floor}</strong><span>{a.location.department}</span></div>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Affected System</h3>
              <div className="system-details">
                <div className="detail-card">
                  <MdDevices className="detail-icon" />
                  <div>
                    <strong>{a.system}</strong>
                    {a.sensor   && <span>{a.sensor.type} · Current: {a.sensor.currentValue ?? "N/A"} {a.sensor.unit}</span>}
                    {a.actuator && <span>{a.actuator.type} · Status: {a.actuator.status}</span>}
                    {a.device   && <span>{a.device.type} · Model: {a.device.model}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Required Materials</h3>
              <div className="materials-list">
                {a.materials.map((m, i) => (
                  <div key={i} className={`material-item${m.urgent ? " urgent" : ""}`}>
                    <div className="material-info">
                      <strong>{m.name}</strong>
                      <span>Qty: {m.quantity} {m.unit}</span>
                    </div>
                    {m.urgent && <span className="urgent-tag">Urgent</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="info-section">
              <h3>Action Items</h3>
              <div className="actions-list">
                {a.actions.map(act => (
                  <div key={act.id} className={`action-item${act.completed ? " completed" : ""}`}>
                    <input type="checkbox" checked={act.completed} readOnly />
                    <span>{act.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="detail-right">
            <div className="info-card">
              <h3>Timeline</h3>
              <div className="timeline">
                {[
                  { label: "Detected",     value: new Date(a.detectedAt).toLocaleString(),   badge: timeAgo(a.detectedAt) },
                  { label: "Last Updated", value: new Date(a.lastUpdated).toLocaleString() },
                  { label: "Duration",     value: a.duration },
                  ...(a.scheduledFix ? [{ label: "Scheduled Fix", value: new Date(a.scheduledFix).toLocaleString(), scheduled: true }] : [])
                ].map((t, i) => (
                  <div key={i} className={`timeline-item${t.scheduled ? " scheduled" : ""}`}>
                    <span className="timeline-label">{t.label}</span>
                    <span className="timeline-value">{t.value}</span>
                    {t.badge && <span className="timeline-badge">{t.badge}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="info-card">
              <h3>Reporter</h3>
              <div className="reporter-details">
                <div className="reporter-avatar-large">{a.reportedBy.avatar}</div>
                <div className="reporter-info">
                  <strong>{a.reportedBy.name}</strong>
                  <span>{a.reportedBy.role}</span>
                  <div className="reporter-contact"><FaEnvelope /> {a.reportedBy.email}</div>
                  <div className="reporter-contact"><FaPhone /> {a.reportedBy.phone}</div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Assignment</h3>
              <div className="assignment-info">
                {[
                  { label: "Assigned To",    value: a.assignedTo },
                  { label: "Affected Users", value: a.affectedUsers },
                ].map((item, i) => (
                  <div key={i} className="assignment-item">
                    <span className="assignment-label">{item.label}</span>
                    <span className="assignment-value">{item.value}</span>
                  </div>
                ))}
                <div className="assignment-item">
                  <span className="assignment-label">Status</span>
                  <span className={`status-badge-large status-${a.status}`}>{a.status}</span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Notes</h3>
              <p className="notes-text">{a.notes}</p>
            </div>

            <div className="info-card">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                {[
                  { icon: <FaBell />,          label: "Notify Team" },
                  { icon: <FaClipboardList />, label: "Add Note" },
                  { icon: <FaTools />,         label: "Order Materials" },
                  { icon: <FaShare />,         label: "Share" },
                ].map(({ icon, label }) => (
                  <button key={label} className="quick-action-btn">{icon} {label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}