import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  FaHome, FaDoorOpen, FaCalendarCheck, FaRobot, 
  FaExclamationTriangle, FaThermometerHalf, FaWind, 
  FaLightbulb, FaCheckCircle, FaTimesCircle, 
  FaArrowRight, FaBell, FaCog, FaChartLine,
  FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import "./FM_Dashboard.css";

// Mock data - in real app, this would come from API
const mockData = {
  kpis: {
    totalRooms: 12,
    activeBookings: 8,
    pendingAIDecisions: 3,
    activeAnomalies: 2,
    comfortRulesActive: 5,
    comfortRulesTotal: 7
  },
  roomStatus: [
    { id: 1, name: "Conference A", status: "available", temperature: 22.5, co2: 450, light: 380, occupancy: 0 },
    { id: 2, name: "Meeting Room 2", status: "occupied", temperature: 23.1, co2: 620, light: 250, occupancy: 4 },
    { id: 3, name: "Training Hall", status: "available", temperature: 21.8, co2: 430, light: 420, occupancy: 0 },
    { id: 4, name: "Executive Boardroom", status: "alert", temperature: 24.5, co2: 820, light: 180, occupancy: 0 },
    { id: 5, name: "Innovation Hub", status: "occupied", temperature: 22.9, co2: 580, light: 390, occupancy: 3 },
    { id: 6, name: "Quiet Room", status: "available", temperature: 21.5, co2: 410, light: 200, occupancy: 0 },
    { id: 7, name: "Board Room", status: "available", temperature: 22.0, co2: 440, light: 350, occupancy: 0 },
    { id: 8, name: "Meeting Pod", status: "occupied", temperature: 23.5, co2: 590, light: 280, occupancy: 2 },
    { id: 9, name: "Workshop Space", status: "available", temperature: 21.9, co2: 420, light: 450, occupancy: 0 },
    { id: 10, name: "Client Lounge", status: "occupied", temperature: 22.8, co2: 540, light: 320, occupancy: 3 }
  ],
  aiRecommendations: [
    {
      id: 1,
      title: "Energy Optimization",
      message: "Reduce HVAC in Conference A - no occupancy detected for 30 minutes",
      impact: "Save 15% energy",
      time: "2 min ago",
      priority: "high"
    },
    {
      id: 2,
      title: "Comfort Adjustment",
      message: "Increase ventilation in Meeting Room 2 - CO2 levels rising",
      impact: "Improve air quality",
      time: "15 min ago",
      priority: "medium"
    },
    {
      id: 3,
      title: "Lighting Schedule",
      message: "Optimize lighting schedule based on usage patterns",
      impact: "Reduce electricity costs",
      time: "1 hour ago",
      priority: "low"
    }
  ],
  anomalies: [
    { id: 1, room: "Executive Boardroom", issue: "High CO2 levels", severity: "warning", time: "10 min ago" },
    { id: 2, room: "Conference A", issue: "Temperature sensor offline", severity: "critical", time: "25 min ago" }
  ],
  comfortRules: [
    { id: 1, name: "Temperature Range", status: "active", value: "21-24°C" },
    { id: 2, name: "CO2 Threshold", status: "active", value: "<800 ppm" },
    { id: 3, name: "Humidity", status: "active", value: "40-60%" },
    { id: 4, name: "Light Level", status: "inactive", value: ">300 lux" },
    { id: 5, name: "Occupancy Timeout", status: "active", value: "30 min" }
  ],
  dailySummary: {
    peakOccupancy: "12:30 PM",
    avgCo2: "520 ppm",
    energyUsage: "245 kWh",
    comfortScore: 8.5
  }
};

export default function FM_Dashboard() {
  const [aiRecommendations, setAiRecommendations] = useState(mockData.aiRecommendations);
  const scrollContainerRef = useRef(null);

  const handleAcceptRecommendation = (id) => {
    setAiRecommendations(aiRecommendations.filter(rec => rec.id !== id));
    console.log(`Accepted recommendation ${id}`);
  };

  const handleRejectRecommendation = (id) => {
    setAiRecommendations(aiRecommendations.filter(rec => rec.id !== id));
    console.log(`Rejected recommendation ${id}`);
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return '#10b981';
      case 'occupied': return '#f59e0b';
      case 'alert': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'available': return <FaCheckCircle className="status-icon available" />;
      case 'occupied': return <FaHome className="status-icon occupied" />;
      case 'alert': return <FaExclamationTriangle className="status-icon alert" />;
      default: return null;
    }
  };

  const getSeverityClass = (severity) => {
    switch(severity) {
      case 'critical': return 'severity-critical';
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      case 'warning': return 'severity-warning';
      default: return '';
    }
  };

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
          <button className="settings-btn">
            <FaCog />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon blue">
            <FaDoorOpen />
          </div>
          <div className="kpi-info">
            <span className="kpi-value">{mockData.kpis.totalRooms}</span>
            <span className="kpi-label">Total Rooms</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon green">
            <FaCalendarCheck />
          </div>
          <div className="kpi-info">
            <span className="kpi-value">{mockData.kpis.activeBookings}</span>
            <span className="kpi-label">Active Bookings</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon purple">
            <FaRobot />
          </div>
          <div className="kpi-info">
            <span className="kpi-value">{mockData.kpis.pendingAIDecisions}</span>
            <span className="kpi-label">Pending AI Decisions</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon orange">
            <FaExclamationTriangle />
          </div>
          <div className="kpi-info">
            <span className="kpi-value">{mockData.kpis.activeAnomalies}</span>
            <span className="kpi-label">Active Anomalies</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon teal">
            <FaChartLine />
          </div>
          <div className="kpi-info">
            <span className="kpi-value">{mockData.kpis.comfortRulesActive}/{mockData.kpis.comfortRulesTotal}</span>
            <span className="kpi-label">Comfort Rules</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Room Status with Horizontal Scroll */}
        <div className="card rooms-card">
          <div className="card-header">
            <h2>Live Room Status</h2>
            <div className="scroll-controls">
              <button className="scroll-btn" onClick={() => scroll('left')}>
                <FaChevronLeft />
              </button>
              <button className="scroll-btn" onClick={() => scroll('right')}>
                <FaChevronRight />
              </button>
            </div>
          </div>
          <div className="rooms-scroll-container" ref={scrollContainerRef}>
            <div className="rooms-horizontal-grid">
              {mockData.roomStatus.map(room => (
                <div key={room.id} className={`room-status-card ${room.status}`}>
                  <div className="room-status-header">
                    <h3>{room.name}</h3>
                    {getStatusIcon(room.status)}
                  </div>
                  <div className="room-sensors">
                    <div className="sensor-item">
                      <FaThermometerHalf className="sensor-icon temp" />
                      <span>{room.temperature}°</span>
                    </div>
                    <div className="sensor-item">
                      <FaWind className="sensor-icon co2" />
                      <span>{room.co2}</span>
                    </div>
                    <div className="sensor-item">
                      <FaLightbulb className="sensor-icon light" />
                      <span>{room.light}lx</span>
                    </div>
                  </div>
                  <div className="room-status-badge">
                    <span className={`status-badge ${room.status}`}>
                      {room.status === 'available' && 'Available'}
                      {room.status === 'occupied' && `Occupied (${room.occupancy})`}
                      {room.status === 'alert' && 'Alert'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two Column Layout for Bottom Section */}
        <div className="bottom-grid">
          {/* Left Column - Comfort Rules */}
          <div className="card">
            <div className="card-header">
              <h2>Comfort Rules Status</h2>
              <Link to="/fm/comfort-rules" className="view-all-link">Manage</Link>
            </div>
            <div className="rules-grid">
              {mockData.comfortRules.map(rule => (
                <div key={rule.id} className="rule-item">
                  <div className="rule-info">
                    <span className="rule-name">{rule.name}</span>
                    <span className="rule-value">{rule.value}</span>
                  </div>
                  <span className={`rule-status ${rule.status}`}>
                    {rule.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - AI Recommendations */}
          <div className="card ai-panel">
            <div className="card-header">
              <h2>AI Recommendations</h2>
              <span className="badge">{aiRecommendations.length}</span>
            </div>
            <div className="ai-list">
              {aiRecommendations.length > 0 ? (
                aiRecommendations.map(rec => (
                  <div key={rec.id} className={`ai-item ${getSeverityClass(rec.priority)}`}>
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
                      <button 
                        className="accept-btn"
                        onClick={() => handleAcceptRecommendation(rec.id)}
                      >
                        <FaCheckCircle /> Accept
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleRejectRecommendation(rec.id)}
                      >
                        <FaTimesCircle /> Reject
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <p>No pending AI recommendations</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section - Anomalies & Daily Summary */}
        <div className="bottom-row">
          {/* Anomalies */}
          <div className="card anomalies-card">
            <div className="card-header">
              <h2>Active Anomalies</h2>
              <span className="badge warning">{mockData.anomalies.length}</span>
            </div>
            <div className="anomalies-list">
              {mockData.anomalies.map(anomaly => (
                <div key={anomaly.id} className="anomaly-item">
                  <div className="anomaly-header">
                    <FaExclamationTriangle className={`anomaly-icon ${anomaly.severity}`} />
                    <div className="anomaly-info">
                      <span className="anomaly-room">{anomaly.room}</span>
                      <span className="anomaly-issue">{anomaly.issue}</span>
                    </div>
                  </div>
                  <div className="anomaly-footer">
                    <span className="anomaly-time">{anomaly.time}</span>
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
              <div className="summary-item">
                <span className="summary-label">Peak occupancy</span>
                <span className="summary-value">{mockData.dailySummary.peakOccupancy}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Average CO₂</span>
                <span className="summary-value">{mockData.dailySummary.avgCo2}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Energy usage</span>
                <span className="summary-value">{mockData.dailySummary.energyUsage}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Comfort score</span>
                <span className="summary-value good">{mockData.dailySummary.comfortScore}/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}