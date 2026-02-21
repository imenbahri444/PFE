import { useState, useEffect, useRef } from "react";
import "./RoomDetailsModal.css";

// Mock API service to simulate backend calls
const roomService = {
  // GET /rooms/{room_id}/live-status
  getRoomLiveStatus: async (roomId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock response matching the sequence diagram
    return {
      roomMetadata: {
        roomId: roomId,
        name: roomId === "RM001" ? "Conference A" : 
              roomId === "RM002" ? "Meeting Room 2" : 
              roomId === "RM003" ? "Training Hall" : "Executive Boardroom",
        capacity: roomId === "RM001" ? 20 : roomId === "RM002" ? 8 : roomId === "RM003" ? 50 : 16,
        floor: roomId === "RM001" ? 2 : roomId === "RM002" ? 1 : roomId === "RM003" ? 3 : 4,
        department: roomId === "RM001" ? "Sales & Marketing" : 
                    roomId === "RM002" ? "Engineering" : 
                    roomId === "RM003" ? "HR & Training" : "Executive",
        amenities: ["Projector", "Whiteboard", "Video Conference", "Smart TV"],
        description: "Modern meeting room with full AV capabilities"
      },
      sensorData: {
        // Latest measurements from InfluxDB
        temperature: { value: 22.5, unit: "°C", timestamp: new Date().toISOString() },
        humidity: { value: 45, unit: "%", timestamp: new Date().toISOString() },
        co2: { value: 450, unit: "ppm", timestamp: new Date().toISOString() },
        light: { value: 380, unit: "lux", timestamp: new Date().toISOString() },
        pir: { value: 0, unit: "motion", timestamp: new Date().toISOString() } // 0 = no motion, 1 = motion detected
      },
      comfortScore: {
        score: 8.5, // out of 10
        status: "Good",
        factors: [
          { name: "Temperature", status: "optimal", value: 22.5 },
          { name: "Humidity", status: "optimal", value: 45 },
          { name: "CO2", status: "good", value: 450 },
          { name: "Light", status: "optimal", value: 380 }
        ]
      },
      deviceState: {
        lights: "ON",
        hvac: "AUTO",
        blinds: "OPEN",
        projector: "STANDBY"
      }
    };
  },
  
  // GET /rooms/{room_id}/bookings
  getRoomBookings: async (roomId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: 1,
        title: "Weekly Team Sync",
        start: new Date(2026, 1, 23, 10, 0),
        end: new Date(2026, 1, 23, 12, 0),
        moderator: "Sarah Johnson",
        status: "confirmed",
        attendees: [
          { id: 1, name: "Sarah Johnson", role: "Moderator", checkInTime: "09:55" },
          { id: 2, name: "Michael Chen", role: "Developer", checkInTime: "09:58" },
          { id: 3, name: "Emma Davis", role: "Designer", checkInTime: "10:02" },
          { id: 4, name: "James Wilson", role: "Product Manager", checkInTime: "09:50" }
        ]
      },
      {
        id: 2,
        title: "Client Presentation",
        start: new Date(2026, 1, 23, 14, 0),
        end: new Date(2026, 1, 23, 15, 30),
        moderator: "John Smith",
        status: "confirmed",
        attendees: [
          { id: 5, name: "John Smith", role: "Account Executive", checkInTime: "13:55" },
          { id: 6, name: "Alice Cooper", role: "Client", checkInTime: "14:00" },
          { id: 7, name: "Bob Martin", role: "Client", checkInTime: "14:02" },
          { id: 8, name: "Carol White", role: "Solutions Architect", checkInTime: "13:58" }
        ]
      }
    ];
  }
};

export default function RoomDetailsModal({ room, onClose, onBookRoom }) {
  const modalRef = useRef();
  const [loading, setLoading] = useState(true);
  const [liveStatus, setLiveStatus] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('live'); // 'live' or 'bookings'
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Fetch live status on mount and set up refresh loop
  useEffect(() => {
    const fetchLiveStatus = async () => {
      try {
        const data = await roomService.getRoomLiveStatus(room.roomId || room.id);
        setLiveStatus(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch live status:", error);
        setLoading(false);
      }
    };

    const fetchBookings = async () => {
      try {
        const data = await roomService.getRoomBookings(room.roomId || room.id);
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    fetchLiveStatus();
    fetchBookings();

    // Set up refresh loop every 30 seconds (as per sequence diagram)
    const interval = setInterval(() => {
      console.log("Refreshing live status...");
      fetchLiveStatus();
    }, 30000); // 30 seconds

    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [room.roomId, room.id]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [onClose, refreshInterval]);

  if (!room) return null;

  const getStatusColor = (status) => {
    return status === 'confirmed' ? '#00b2ff' : '#ff7514';
  };

  const getComfortColor = (score) => {
    if (score >= 8) return '#42ff81';
    if (score >= 6) return '#ffd966';
    if (score >= 4) return '#ff7514';
    return '#ff4d4d';
  };

  // Manual refresh function
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await roomService.getRoomLiveStatus(room.roomId || room.id);
      setLiveStatus(data);
    } catch (error) {
      console.error("Failed to refresh live status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <div>
            <h2>{room.name}</h2>
            <div className="room-meta">
              <span className="room-id-badge">{room.roomId || room.id}</span>
              <span className="room-location">📍 Floor {room.floor || '2'}, {room.location || 'East Wing'}</span>
            </div>
          </div>
          
          {/* Live refresh indicator */}
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span className="live-text">LIVE</span>
            <span className="refresh-interval">Updates every 30s</span>
            <button className="refresh-now-btn" onClick={handleRefresh} title="Refresh now">
              ↻
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            Live Status
          </button>
          <button 
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings & Schedule
          </button>
        </div>

        <div className="modal-body">
          {loading && activeTab === 'live' ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Fetching live sensor data...</p>
            </div>
          ) : (
            <>
              {/* Live Status Tab */}
              {activeTab === 'live' && liveStatus && (
                <div className="live-status-tab">
                  {/* Room Metadata */}
                  <div className="metadata-section">
                    <h3>Room Information</h3>
                    <div className="metadata-grid">
                      <div className="metadata-item">
                        <span className="metadata-label">Department</span>
                        <span className="metadata-value">{liveStatus.roomMetadata.department}</span>
                      </div>
                      <div className="metadata-item">
                        <span className="metadata-label">Capacity</span>
                        <span className="metadata-value">{liveStatus.roomMetadata.capacity} people</span>
                      </div>
                      <div className="metadata-item">
                        <span className="metadata-label">Floor</span>
                        <span className="metadata-value">{liveStatus.roomMetadata.floor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Comfort Score - AI Result */}
                  <div className="comfort-score-section">
                    <h3>AI Comfort Analysis</h3>
                    <div className="comfort-score-card">
                      <div className="score-circle" style={{ 
                        background: `conic-gradient(${getComfortColor(liveStatus.comfortScore.score)} 0deg ${liveStatus.comfortScore.score * 36}deg, #f2f3f4 ${liveStatus.comfortScore.score * 36}deg 360deg)`
                      }}>
                        <div className="score-inner">
                          <span className="score-number">{liveStatus.comfortScore.score}</span>
                          <span className="score-max">/10</span>
                        </div>
                      </div>
                      <div className="score-details">
                        <div className="score-status" style={{ color: getComfortColor(liveStatus.comfortScore.score) }}>
                          {liveStatus.comfortScore.status}
                        </div>
                        <div className="score-factors">
                          {liveStatus.comfortScore.factors.map((factor, index) => (
                            <div key={index} className="factor-item">
                              <span className="factor-name">{factor.name}</span>
                              <span className="factor-value">{factor.value}</span>
                              <span className={`factor-status ${factor.status}`}>{factor.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sensor Values - Latest from InfluxDB */}
                  <div className="sensors-section">
                    <h3>Live Sensor Data</h3>
                    <div className="sensors-grid">
                      <div className="sensor-card temperature">
                        <div className="sensor-icon">🌡️</div>
                        <div className="sensor-info">
                          <span className="sensor-name">Temperature</span>
                          <span className="sensor-value">{liveStatus.sensorData.temperature.value}{liveStatus.sensorData.temperature.unit}</span>
                        </div>
                      </div>
                      <div className="sensor-card humidity">
                        <div className="sensor-icon">💧</div>
                        <div className="sensor-info">
                          <span className="sensor-name">Humidity</span>
                          <span className="sensor-value">{liveStatus.sensorData.humidity.value}{liveStatus.sensorData.humidity.unit}</span>
                        </div>
                      </div>
                      <div className="sensor-card co2">
                        <div className="sensor-icon">🌬️</div>
                        <div className="sensor-info">
                          <span className="sensor-name">CO2</span>
                          <span className="sensor-value">{liveStatus.sensorData.co2.value}{liveStatus.sensorData.co2.unit}</span>
                        </div>
                      </div>
                      <div className="sensor-card light">
                        <div className="sensor-icon">💡</div>
                        <div className="sensor-info">
                          <span className="sensor-name">Light</span>
                          <span className="sensor-value">{liveStatus.sensorData.light.value}{liveStatus.sensorData.light.unit}</span>
                        </div>
                      </div>
                      <div className="sensor-card motion">
                        <div className="sensor-icon">🚶</div>
                        <div className="sensor-info">
                          <span className="sensor-name">Motion</span>
                          <span className="sensor-value">{liveStatus.sensorData.pir.value === 1 ? 'Detected' : 'None'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="sensor-timestamp">
                      Last updated: {new Date(liveStatus.sensorData.temperature.timestamp).toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Device State */}
                  <div className="device-state-section">
                    <h3>Device State</h3>
                    <div className="device-grid">
                      <div className="device-item">
                        <span className="device-name">Lights</span>
                        <span className={`device-state ${liveStatus.deviceState.lights.toLowerCase()}`}>
                          {liveStatus.deviceState.lights}
                        </span>
                      </div>
                      <div className="device-item">
                        <span className="device-name">HVAC</span>
                        <span className={`device-state ${liveStatus.deviceState.hvac.toLowerCase()}`}>
                          {liveStatus.deviceState.hvac}
                        </span>
                      </div>
                      <div className="device-item">
                        <span className="device-name">Blinds</span>
                        <span className={`device-state ${liveStatus.deviceState.blinds.toLowerCase()}`}>
                          {liveStatus.deviceState.blinds}
                        </span>
                      </div>
                      <div className="device-item">
                        <span className="device-name">Projector</span>
                        <span className={`device-state ${liveStatus.deviceState.projector.toLowerCase()}`}>
                          {liveStatus.deviceState.projector}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="amenities-section">
                    <h3>Amenities</h3>
                    <div className="amenities-grid">
                      {liveStatus.roomMetadata.amenities?.map((amenity, index) => (
                        <span key={index} className="amenity-item">
                          ✓ {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div className="bookings-tab">
                  <h3>Today's Meetings</h3>
                  {bookings.length > 0 ? (
                    <div className="bookings-list">
                      {bookings.map((event) => (
                        <div key={event.id} className="booking-card">
                          <div className="booking-time">
                            {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                            {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="booking-details">
                            <h4>{event.title}</h4>
                            <p className="booking-moderator">
                              <span className="moderator-icon">👤</span> 
                              Moderator: {event.moderator}
                            </p>
                            <p className="booking-status">
                              Status: 
                              <span style={{ color: getStatusColor(event.status), marginLeft: '5px' }}>
                                {event.status}
                              </span>
                            </p>
                            
                            <div className="attendees-section">
                              <p className="attendees-count">
                                Attendees ({event.attendees?.length || 0})
                              </p>
                              <div className="attendees-list">
                                {event.attendees?.map((attendee) => (
                                  <div key={attendee.id} className="attendee-item">
                                    <div className="attendee-avatar">
                                      {attendee.name.charAt(0)}
                                    </div>
                                    <div className="attendee-info">
                                      <span className="attendee-name">{attendee.name}</span>
                                      <span className="attendee-role">{attendee.role}</span>
                                    </div>
                                    {attendee.checkInTime && (
                                      <span className="checkin-badge">✓ {attendee.checkInTime}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No meetings scheduled for this room today</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="secondary-btn" onClick={onClose}>Close</button>
          <button className="primary-btn" onClick={onBookRoom}>Book This Room</button>
        </div>
      </div>
    </div>
  );
}