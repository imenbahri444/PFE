import { useState } from "react";
import { 
  FaDoorOpen, FaUsers, FaMapMarkerAlt, FaBuilding,
  FaThermometerHalf, FaWind, FaTint, FaLightbulb, FaUserFriends,
  FaCheckCircle, FaExclamationTriangle, FaClock, FaArrowRight,
  FaSearch, FaFilter, FaChartLine, FaMicrochip, FaThermometerFull
} from "react-icons/fa";
import { MdCo2 } from "react-icons/md";
import "./FM_Rooms.css";
import RoomDetailsModal from "../components/RoomDetailsModal";

// Mock sensors data (simulating InfluxDB + MQTT)
const sensorsData = {
  "RM001": {
    temperature: 22.5,
    humidity: 45,
    co2: 450,
    light: 380,
    pir: 0,
    lastUpdated: new Date()
  },
  "RM002": {
    temperature: 23.1,
    humidity: 42,
    co2: 620,
    light: 250,
    pir: 1,
    lastUpdated: new Date()
  },
  "RM003": {
    temperature: 21.8,
    humidity: 48,
    co2: 430,
    light: 420,
    pir: 0,
    lastUpdated: new Date()
  },
  "RM004": {
    temperature: 22.0,
    humidity: 44,
    co2: 820,
    light: 180,
    pir: 0,
    lastUpdated: new Date()
  }
};

// Mock comfort scores (AI Comfort Engine)
const comfortScores = {
  "RM001": { score: 8.5, status: "Optimal", violations: [] },
  "RM002": { score: 6.2, status: "Moderate", violations: ["CO2 levels above threshold"] },
  "RM003": { score: 9.0, status: "Optimal", violations: [] },
  "RM004": { score: 4.5, status: "Poor", violations: ["Temperature too high", "CO2 critical", "Light insufficient"] }
};

// Rooms data
const rooms = [
  { 
    roomId: "RM001",
    name: "Conference A", 
    department: "Sales & Marketing",
    floor: 2,
    capacity: 20,
    status: "Available",
    amenities: ["Projector", "Whiteboard", "Video Conference", "Smart TV"],
    location: "Floor 2, East Wing",
    description: "Spacious conference room with natural light and modern AV equipment"
  },
  { 
    roomId: "RM002",
    name: "Meeting Room 2", 
    department: "Engineering",
    floor: 1,
    capacity: 8,
    status: "Occupied",
    amenities: ["TV Screen", "Whiteboard", "Video Conference"],
    location: "Floor 1, West Wing",
    description: "Perfect for small team meetings and client presentations"
  },
  { 
    roomId: "RM003",
    name: "Training Hall", 
    department: "HR & Training",
    floor: 3,
    capacity: 50,
    status: "Available",
    amenities: ["Projector", "Sound System", "Stage", "Microphones"],
    location: "Floor 3, North Wing",
    description: "Large training facility with flexible seating arrangement"
  },
  { 
    roomId: "RM004",
    name: "Executive Boardroom", 
    department: "Executive",
    floor: 4,
    capacity: 16,
    status: "Available",
    amenities: ["Video Conference", "Smart Board", "Catering", "Privacy Blinds"],
    location: "Floor 4, South Wing",
    description: "Premium boardroom for executive meetings with catering service"
  }
];

// Department options for filter
const departments = ["All", "Sales & Marketing", "Engineering", "HR & Training", "Executive"];

// Helper to get room status
const getRoomStatus = (roomId) => {
  const room = rooms.find(r => r.roomId === roomId);
  return room ? room.status : "Available";
};

// Get comfort score color
const getComfortColor = (status) => {
  switch(status) {
    case 'Optimal': return '#10b981';
    case 'Moderate': return '#f59e0b';
    case 'Poor': return '#ef4444';
    default: return '#64748b';
  }
};

export default function FM_Rooms() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  
  // Filtering state
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  const handleCloseModals = () => {
    setShowRoomModal(false);
    setSelectedRoom(null);
  };

  // Filter rooms based on department and search
  const filteredRooms = rooms.filter(room => {
    const matchesDepartment = selectedDepartment === "All" || room.department === selectedDepartment;
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.roomId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  return (
    <div className="rooms-wrapper">
      {/* Header */}
      <div className="rooms-header">
        <div>
          <h2>Rooms & Monitoring</h2>
          <p>View current room live status and manage configurations</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="rooms-filter-bar">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input 
            type="text"
            className="search-input"
            placeholder="Search rooms by name, ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-container">
          <FaFilter className="filter-icon" />
          <select 
            className="filter-select"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="room-status-grid">
        {filteredRooms.map((room) => {
          const status = getRoomStatus(room.roomId);
          const sensor = sensorsData[room.roomId];
          const comfort = comfortScores[room.roomId];
          
          return (
            <div
              key={room.roomId}
              className={`room-card ${status.toLowerCase()}`}
              onClick={() => handleRoomClick(room)}
            >
              {/* Room Header */}
              <div className="room-card-header">
                <div>
                  <h3>{room.name}</h3>
                  <span className="room-id">{room.roomId}</span>
                </div>
                <span className="room-capacity-badge">
                  <FaUsers className="badge-icon" /> {room.capacity}
                </span>
              </div>
              
              {/* Room Metadata */}
              <div className="room-metadata">
                <div className="metadata-row">
                  <FaBuilding className="metadata-icon" />
                  <span className="metadata-label">Floor:</span>
                  <span className="metadata-value">{room.floor}</span>
                </div>
                <div className="metadata-row">
                  <FaMapMarkerAlt className="metadata-icon" />
                  <span className="metadata-label">Dept:</span>
                  <span className="metadata-value">{room.department}</span>
                </div>
              </div>
              
              {/* Status Row */}
              <div className="room-status-row">
                <span className={`status-dot ${status.toLowerCase()}`}></span>
                <span className="status-text">{status}</span>
              </div>

              {/* Live Sensor Data - FIXED: Removed color classes */}
              {sensor && (
                <div className="room-sensors">
                  <div className="sensor-item" title="CO2 Level">
                    <MdCo2 className="sensor-icon" />
                    <span className="sensor-value">{sensor.co2}</span>
                  </div>
                  <div className="sensor-item" title="Temperature">
                    <FaThermometerHalf className="sensor-icon" />
                    <span className="sensor-value">{sensor.temperature}°</span>
                  </div>
                  <div className="sensor-item" title="Humidity">
                    <FaTint className="sensor-icon" />
                    <span className="sensor-value">{sensor.humidity}%</span>
                  </div>
                  <div className="sensor-item" title="Light">
                    <FaLightbulb className="sensor-icon" />
                    <span className="sensor-value">{sensor.light}</span>
                  </div>
                  <div className="sensor-item" title="Presence">
                    <FaUserFriends className="sensor-icon" />
                    <span className="sensor-value">{sensor.pir ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              )}

              {/* Comfort Score */}
              {comfort && (
                <div className="room-comfort">
                  <div className="comfort-header">
                    <span className="comfort-label">
                      <FaChartLine className="comfort-header-icon" /> AI Comfort
                    </span>
                    <span className="comfort-score" style={{ color: getComfortColor(comfort.status) }}>
                      {comfort.score}/10
                    </span>
                  </div>
                  <div className="comfort-status" style={{ backgroundColor: getComfortColor(comfort.status) + '20', color: getComfortColor(comfort.status) }}>
                    {comfort.status}
                  </div>
                  {comfort.violations.length > 0 && (
                    <div className="comfort-violations">
                      <FaExclamationTriangle className="violation-icon" />
                      <span className="violation-count">{comfort.violations.length} issue(s)</span>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="room-footer">
                <span className="view-link">
                  View Details <FaArrowRight className="view-icon" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Details Modal */}
      {showRoomModal && selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          onClose={handleCloseModals}
        />
      )}
    </div>
  );
}