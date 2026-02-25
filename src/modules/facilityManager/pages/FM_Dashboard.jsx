import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaHome, FaDoorOpen, FaCalendarCheck, FaRobot,
  FaExclamationTriangle, FaThermometerHalf, FaWind,
  FaLightbulb, FaCheckCircle, FaTimesCircle,
  FaBell, FaCog, FaChartLine,
  FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import "./FM_Dashboard.css";

/* ── Data ───────────────────────────────────────────────────── */
const KPIS = [
  { icon: <FaDoorOpen />,           color: "blue",   value: 12,    label: "Total Rooms" },
  { icon: <FaCalendarCheck />,      color: "green",  value: 8,     label: "Active Bookings" },
  { icon: <FaRobot />,              color: "purple", value: 3,     label: "Pending AI Decisions" },
  { icon: <FaExclamationTriangle />,color: "orange", value: 2,     label: "Active Anomalies" },
  { icon: <FaChartLine />,          color: "teal",   value: "5/7", label: "Comfort Rules" },
];

const ROOMS = [
  { id: 1,  name: "Conference A",        status: "available", temperature: 22.5, co2: 450, light: 380, occupancy: 0 },
  { id: 2,  name: "Meeting Room 2",      status: "occupied",  temperature: 23.1, co2: 620, light: 250, occupancy: 4 },
  { id: 3,  name: "Training Hall",       status: "available", temperature: 21.8, co2: 430, light: 420, occupancy: 0 },
  { id: 4,  name: "Executive Boardroom", status: "alert",     temperature: 24.5, co2: 820, light: 180, occupancy: 0 },
  { id: 5,  name: "Innovation Hub",      status: "occupied",  temperature: 22.9, co2: 580, light: 390, occupancy: 3 },
  { id: 6,  name: "Quiet Room",          status: "available", temperature: 21.5, co2: 410, light: 200, occupancy: 0 },
  { id: 7,  name: "Board Room",          status: "available", temperature: 22.0, co2: 440, light: 350, occupancy: 0 },
  { id: 8,  name: "Meeting Pod",         status: "occupied",  temperature: 23.5, co2: 590, light: 280, occupancy: 2 },
  { id: 9,  name: "Workshop Space",      status: "available", temperature: 21.9, co2: 420, light: 450, occupancy: 0 },
  { id: 10, name: "Client Lounge",       status: "occupied",  temperature: 22.8, co2: 540, light: 320, occupancy: 3 },
];

const AI_INIT = [
  { id: 1, title: "Energy Optimization", message: "Reduce HVAC in Conference A — no occupancy detected for 30 minutes", impact: "Save 15% energy",        time: "2 min ago",  priority: "high" },
  { id: 2, title: "Comfort Adjustment",  message: "Increase ventilation in Meeting Room 2 — CO2 levels rising",         impact: "Improve air quality",   time: "15 min ago", priority: "medium" },
  { id: 3, title: "Lighting Schedule",   message: "Optimize lighting schedule based on usage patterns",                  impact: "Reduce electricity cost",time: "1 hour ago", priority: "low" },
];

const ANOMALIES = [
  { id: 1, room: "Executive Boardroom", issue: "High CO2 levels",          severity: "warning",  time: "10 min ago" },
  { id: 2, room: "Conference A",        issue: "Temperature sensor offline", severity: "critical", time: "25 min ago" },
];

const RULES = [
  { id: 1, name: "Temperature Range", status: "active",   value: "21–24 °C" },
  { id: 2, name: "CO2 Threshold",     status: "active",   value: "< 800 ppm" },
  { id: 3, name: "Humidity",          status: "active",   value: "40–60 %" },
  { id: 4, name: "Light Level",       status: "inactive", value: "> 300 lux" },
  { id: 5, name: "Occupancy Timeout", status: "active",   value: "30 min" },
];

const SUMMARY = [
  { label: "Peak occupancy", value: "12:30 PM" },
  { label: "Average CO₂",   value: "520 ppm" },
  { label: "Energy usage",  value: "245 kWh" },
  { label: "Comfort score", value: "8.5/10", good: true },
];

const STATUS_ICON = {
  available: <FaCheckCircle />,
  occupied:  <FaHome />,
  alert:     <FaExclamationTriangle />,
};

/* ── Component ──────────────────────────────────────────────── */
export default function FM_Dashboard() {
  const [aiRecs, setAiRecs] = useState(AI_INIT);
  const scrollRef = useRef(null);

  const dismiss = (id) => setAiRecs(prev => prev.filter(r => r.id !== id));
  const scroll  = (dir) => { scrollRef.current.scrollLeft += dir === "left" ? -300 : 300; };

  return (
    <div className="dashboard-wrapper">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="dashboard-subtitle">Welcome back, John! Here's your facility status.</p>
        </div>
        <div className="header-actions">
          <button className="notification-btn">
            <FaBell />
            <span className="notification-badge">5</span>
          </button>
          <button className="settings-btn"><FaCog /></button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        {KPIS.map((k, i) => (
          <div className="kpi-card" key={i}>
            <div className={`kpi-icon ${k.color}`}>{k.icon}</div>
            <div className="kpi-info">
              <span className="kpi-value">{k.value}</span>
              <span className="kpi-label">{k.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="main-content">

        {/* Live Room Status */}
        <div className="card rooms-card">
          <div className="card-header">
            <h2>Live Room Status</h2>
            <div className="scroll-controls">
              <button className="scroll-btn" onClick={() => scroll("left")}><FaChevronLeft /></button>
              <button className="scroll-btn" onClick={() => scroll("right")}><FaChevronRight /></button>
            </div>
          </div>
          <div className="rooms-scroll-container" ref={scrollRef}>
            <div className="rooms-horizontal-grid">
              {ROOMS.map(room => (
                <div key={room.id} className={`room-status-card ${room.status}`}>
                  <div className="room-status-header">
                    <h3>{room.name}</h3>
                    <span className={`status-icon ${room.status}`}>{STATUS_ICON[room.status]}</span>
                  </div>
                  <div className="room-sensors">
                    <div className="sensor-item"><FaThermometerHalf className="sensor-icon temp" />{room.temperature}°</div>
                    <div className="sensor-item"><FaWind className="sensor-icon co2" />{room.co2}</div>
                    <div className="sensor-item"><FaLightbulb className="sensor-icon light" />{room.light}lx</div>
                  </div>
                  <div className="room-status-badge">
                    <span className={`status-badge ${room.status}`}>
                      {room.status === "available" && "Available"}
                      {room.status === "occupied"  && `Occupied (${room.occupancy})`}
                      {room.status === "alert"     && "Alert"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mid: Rules + AI */}
        <div className="bottom-grid">

          {/* Comfort Rules */}
          <div className="card">
            <div className="card-header">
              <h2>Comfort Rules Status</h2>
              <Link to="/fm/comfort-rules" className="view-all-link">Manage</Link>
            </div>
            <div className="rules-grid">
              {RULES.map(rule => (
                <div className="rule-item" key={rule.id}>
                  <div className="rule-info">
                    <span className="rule-name">{rule.name}</span>
                    <span className="rule-value">{rule.value}</span>
                  </div>
                  <span className={`rule-status ${rule.status}`}>
                    {rule.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="card ai-panel">
            <div className="card-header">
              <h2>AI Recommendations</h2>
              <span className="badge">{aiRecs.length}</span>
            </div>
            <div className="ai-list">
              {aiRecs.length > 0 ? aiRecs.map(rec => (
                <div key={rec.id} className={`ai-item severity-${rec.priority}`}>
                  <div className="ai-header">
                    <FaRobot className="ai-icon" />
                    <div className="ai-title">
                      <h3>{rec.title}</h3>
                      <span className="ai-time">{rec.time}</span>
                    </div>
                  </div>
                  <p className="ai-message">{rec.message}</p>
                  <div className="ai-impact">
                    <span className="impact-label">Impact:</span>
                    <span className="impact-value">{rec.impact}</span>
                  </div>
                  <div className="ai-actions">
                    <button className="accept-btn" onClick={() => dismiss(rec.id)}><FaCheckCircle /> Accept</button>
                    <button className="reject-btn" onClick={() => dismiss(rec.id)}><FaTimesCircle /> Reject</button>
                  </div>
                </div>
              )) : (
                <div className="no-data"><p>No pending AI recommendations</p></div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom: Anomalies + Summary */}
        <div className="bottom-row">

          {/* Anomalies */}
          <div className="card anomalies-card">
            <div className="card-header">
              <h2>Active Anomalies</h2>
              <span className="badge warning">{ANOMALIES.length}</span>
            </div>
            <div className="anomalies-list">
              {ANOMALIES.map(a => (
                <div key={a.id} className="anomaly-item">
                  <div className="anomaly-header">
                    <FaExclamationTriangle className={`anomaly-icon ${a.severity}`} />
                    <div className="anomaly-info">
                      <span className="anomaly-room">{a.room}</span>
                      <span className="anomaly-issue">{a.issue}</span>
                    </div>
                  </div>
                  <div className="anomaly-footer">
                    <span className="anomaly-time">{a.time}</span>
                    <button className="view-btn">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Summary */}
          <div className="card summary-card">
            <h2>Today's Summary</h2>
            <div className="summary-grid">
              {SUMMARY.map((s, i) => (
                <div className="summary-item" key={i}>
                  <span className="summary-label">{s.label}</span>
                  <span className={`summary-value${s.good ? " good" : ""}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}