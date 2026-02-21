import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { 
  FaUserTie, FaUsers, FaClock, FaDoorOpen, 
  FaCheckCircle, FaExclamationTriangle, FaClock as FaDelay,
  FaStickyNote, FaSave, FaTimes, FaEdit, FaTrash,
  FaPlus, FaUserFriends, FaInfoCircle, FaChevronDown, FaChevronUp,
  FaRegCalendar, FaRegClock, FaSearch, FaCalendarAlt, FaMapMarkerAlt
} from "react-icons/fa";
import "./FM_Bookings.css";

const localizer = momentLocalizer(moment);

// Mock rooms data
const rooms = [
  { id: "RM001", name: "Conference A", capacity: 20, floor: 2, amenities: ["Projector", "Whiteboard", "Video Conference"] },
  { id: "RM002", name: "Meeting Room 2", capacity: 8, floor: 1, amenities: ["TV Screen", "Whiteboard"] },
  { id: "RM003", name: "Training Hall", capacity: 50, floor: 3, amenities: ["Projector", "Sound System", "Stage"] },
  { id: "RM004", name: "Executive Boardroom", capacity: 16, floor: 4, amenities: ["Video Conference", "Smart Board", "Catering"] },
  { id: "RM005", name: "Innovation Hub", capacity: 12, floor: 2, amenities: ["Whiteboard", "Standing Desks", "Monitor"] },
  { id: "RM006", name: "Quiet Room", capacity: 4, floor: 1, amenities: ["Privacy", "Phone Booth"] }
];

// Mock users for attendees
const mockUsers = [
  { id: 1, name: "Sarah Johnson", email: "sarah.j@company.com", department: "Marketing", avatar: "SJ" },
  { id: 2, name: "Michael Chen", email: "michael.c@company.com", department: "Engineering", avatar: "MC" },
  { id: 3, name: "Emma Davis", email: "emma.d@company.com", department: "Design", avatar: "ED" },
  { id: 4, name: "James Wilson", email: "james.w@company.com", department: "Product", avatar: "JW" },
  { id: 5, name: "Lisa Anderson", email: "lisa.a@company.com", department: "QA", avatar: "LA" },
  { id: 6, name: "Robert Brown", email: "robert.b@company.com", department: "HR", avatar: "RB" },
  { id: 7, name: "Patricia Garcia", email: "patricia.g@company.com", department: "Training", avatar: "PG" },
  { id: 8, name: "John Smith", email: "john.s@company.com", department: "Sales", avatar: "JS" }
];

// Initial mock bookings data
const initialBookings = [
  {
    id: 1,
    title: "Weekly Team Sync",
    start: new Date(2026, 1, 23, 10, 0),
    end: new Date(2026, 1, 23, 12, 0),
    roomId: "RM001",
    roomName: "Conference A",
    status: "confirmed",
    state: "completed",
    moderator: {
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      department: "Marketing",
      avatar: "SJ"
    },
    guests: [
      { id: 1, name: "Michael Chen", email: "michael.c@company.com", role: "Developer", status: "accepted" },
      { id: 2, name: "Emma Davis", email: "emma.d@company.com", role: "Designer", status: "accepted" },
      { id: 3, name: "James Wilson", email: "james.w@company.com", role: "Product Manager", status: "accepted" }
    ],
    description: "Discuss Q2 roadmap and sprint planning. Projector needed.",
    roomCondition: "Clean and organized",
    duration: "2 hours"
  },
  {
    id: 2,
    title: "Client Presentation",
    start: new Date(2026, 1, 23, 14, 0),
    end: new Date(2026, 1, 23, 15, 30),
    roomId: "RM002",
    roomName: "Meeting Room 2",
    status: "confirmed",
    state: "delayed",
    moderator: {
      name: "John Smith",
      email: "john.s@company.com",
      department: "Sales",
      avatar: "JS"
    },
    guests: [
      { id: 4, name: "Alice Cooper", email: "alice.c@client.com", role: "Client", status: "accepted" },
      { id: 5, name: "Bob Martin", email: "bob.m@client.com", role: "Client", status: "accepted" }
    ],
    description: "Product demo for potential enterprise client.",
    roomCondition: "Projector bulb dim, needs replacement",
    duration: "1.5 hours"
  },
  {
    id: 3,
    title: "Training Workshop",
    start: new Date(2026, 1, 24, 9, 0),
    end: new Date(2026, 1, 24, 12, 0),
    roomId: "RM003",
    roomName: "Training Hall",
    status: "confirmed",
    state: "scheduled",
    moderator: {
      name: "Robert Brown",
      email: "robert.b@company.com",
      department: "HR",
      avatar: "RB"
    },
    guests: [
      { id: 6, name: "Patricia Garcia", email: "patricia.g@company.com", role: "Trainee", status: "accepted" },
      { id: 7, name: "David Miller", email: "david.m@company.com", role: "Trainee", status: "accepted" }
    ],
    description: "New employee orientation and training session.",
    roomCondition: "Good",
    duration: "3 hours"
  }
];

export default function FM_Bookings() {
  const [bookings, setBookings] = useState(initialBookings);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [calendarView, setCalendarView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingBooking, setEditingBooking] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editRoomCondition, setEditRoomCondition] = useState("");
  
  // New booking state
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [newBooking, setNewBooking] = useState({
    title: "",
    roomId: "",
    start: null,
    end: null,
    description: "",
    attendees: [],
    moderator: null
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [activeTab, setActiveTab] = useState('details');

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setNewBooking({
      title: "",
      roomId: "",
      start: slotInfo.start,
      end: slotInfo.end,
      description: "",
      attendees: [],
      moderator: null
    });
    setSelectedAttendees([]);
    setActiveTab('details');
    setShowBookingPopup(true);
  };

  const handleSelectBooking = (booking) => {
    // Toggle expansion
    if (expandedBooking?.id === booking.id) {
      setExpandedBooking(null);
    } else {
      setExpandedBooking(booking);
      setEditingBooking(null);
    }
  };

  const handleEditClick = (booking, e) => {
    e.stopPropagation();
    setEditingBooking(booking.id);
    setEditDescription(booking.description || "");
    setEditRoomCondition(booking.roomCondition || "");
  };

  const handleSaveEdit = (bookingId, e) => {
    e.stopPropagation();
    const updatedBookings = bookings.map(b => 
      b.id === bookingId 
        ? { 
            ...b, 
            description: editDescription, 
            roomCondition: editRoomCondition 
          }
        : b
    );
    setBookings(updatedBookings);
    setEditingBooking(null);
    
    // Update expanded booking if it's the same
    if (expandedBooking?.id === bookingId) {
      setExpandedBooking({
        ...expandedBooking,
        description: editDescription,
        roomCondition: editRoomCondition
      });
    }
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingBooking(null);
  };

  const handleDeleteBooking = (bookingId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      const updatedBookings = bookings.filter(b => b.id !== bookingId);
      setBookings(updatedBookings);
      if (expandedBooking?.id === bookingId) {
        setExpandedBooking(null);
      }
    }
  };

  const handleStateChange = (bookingId, newState, e) => {
    e.stopPropagation();
    const updatedBookings = bookings.map(b => 
      b.id === bookingId ? { ...b, state: newState } : b
    );
    setBookings(updatedBookings);
    
    if (expandedBooking?.id === bookingId) {
      setExpandedBooking({ ...expandedBooking, state: newState });
    }
  };

  const handleAddAttendee = (user) => {
    if (!selectedAttendees.find(a => a.id === user.id)) {
      setSelectedAttendees([...selectedAttendees, { ...user, status: "pending" }]);
    }
  };

  const handleRemoveAttendee = (userId) => {
    setSelectedAttendees(selectedAttendees.filter(a => a.id !== userId));
  };

  const handleCreateBooking = () => {
    if (!newBooking.title || !newBooking.roomId || !newBooking.start || !newBooking.end) {
      alert("Please fill in all required fields");
      return;
    }

    const booking = {
      id: Date.now(),
      title: newBooking.title,
      start: newBooking.start,
      end: newBooking.end,
      roomId: newBooking.roomId,
      roomName: rooms.find(r => r.id === newBooking.roomId)?.name,
      status: "confirmed",
      state: "scheduled",
      moderator: mockUsers[0],
      guests: selectedAttendees,
      description: newBooking.description,
      roomCondition: "Good",
      duration: moment(newBooking.end).diff(moment(newBooking.start), 'hours', true).toFixed(1) + " hours"
    };

    const updatedBookings = [...bookings, booking];
    setBookings(updatedBookings);
    
    setShowBookingPopup(false);
    setSelectedSlot(null);
    setSelectedAttendees([]);
    setSearchTerm("");
  };

  const handleTimeChange = (type, value) => {
    if (selectedSlot) {
      const newDate = new Date(selectedSlot.start);
      const [hours, minutes] = value.split(':');
      
      if (type === 'start') {
        newDate.setHours(parseInt(hours), parseInt(minutes));
        setNewBooking({
          ...newBooking,
          start: newDate,
          end: new Date(newDate.getTime() + (selectedSlot.end - selectedSlot.start))
        });
      } else {
        const endDate = new Date(selectedSlot.start);
        endDate.setHours(parseInt(hours), parseInt(minutes));
        setNewBooking({ ...newBooking, end: endDate });
      }
    }
  };

  const handleDateChange = (date) => {
    if (selectedSlot) {
      const newStart = new Date(date);
      newStart.setHours(selectedSlot.start.getHours(), selectedSlot.start.getMinutes());
      const newEnd = new Date(date);
      newEnd.setHours(selectedSlot.end.getHours(), selectedSlot.end.getMinutes());
      
      setNewBooking({
        ...newBooking,
        start: newStart,
        end: newEnd
      });
    }
  };

  const getStateIcon = (state) => {
    switch(state) {
      case 'completed': return <FaCheckCircle className="state-icon completed" />;
      case 'delayed': return <FaDelay className="state-icon delayed" />;
      case 'issue': return <FaExclamationTriangle className="state-icon issue" />;
      case 'scheduled': return <FaClock className="state-icon scheduled" />;
      default: return null;
    }
  };

  const getStateColor = (state) => {
    switch(state) {
      case 'completed': return '#10b981';
      case 'delayed': return '#f59e0b';
      case 'issue': return '#ef4444';
      case 'scheduled': return '#3b82f6';
      default: return '#64748b';
    }
  };

  // Filter users based on search
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort bookings by date (most recent first)
  const sortedBookings = [...bookings].sort((a, b) => a.start - b.start);

  // Custom calendar event
  const EventComponent = ({ event }) => (
    <div className={`calendar-event ${event.state}`}>
      <div className="event-time">{moment(event.start).format("HH:mm")}</div>
      <div className="event-title">{event.title}</div>
      <div className="event-room">{event.roomName}</div>
    </div>
  );

  // Custom toolbar
  const CustomToolbar = () => null;

  return (
    <div className="bookings-wrapper">
      {/* Header */}
      <div className="bookings-header">
        <div>
          <h1>Bookings Management</h1>
          <p className="bookings-subtitle">Schedule and manage all room bookings</p>
        </div>
        <button className="new-booking-btn" onClick={() => {
          setSelectedSlot({
            start: new Date(),
            end: new Date(new Date().setHours(new Date().getHours() + 1))
          });
          setNewBooking({
            title: "",
            roomId: "",
            start: new Date(),
            end: new Date(new Date().setHours(new Date().getHours() + 1)),
            description: "",
            attendees: [],
            moderator: null
          });
          setActiveTab('details');
          setShowBookingPopup(true);
        }}>
          <FaPlus /> New Booking
        </button>
      </div>

      {/* Main Content */}
      <div className="bookings-container">
        {/* Left Column - Calendar */}
        <div className="calendar-column">
          <div className="calendar-card">
            <div className="calendar-header">
              <h2>Schedule</h2>
              <div className="calendar-controls">
                <button 
                  className={`view-btn ${calendarView === 'day' ? 'active' : ''}`}
                  onClick={() => setCalendarView('day')}
                >Day</button>
                <button 
                  className={`view-btn ${calendarView === 'week' ? 'active' : ''}`}
                  onClick={() => setCalendarView('week')}
                >Week</button>
                <button 
                  className={`view-btn ${calendarView === 'month' ? 'active' : ''}`}
                  onClick={() => setCalendarView('month')}
                >Month</button>
              </div>
            </div>
            <div className="calendar-container">
              <Calendar
                localizer={localizer}
                events={bookings}
                startAccessor="start"
                endAccessor="end"
                view={calendarView}
                onView={setCalendarView}
                date={currentDate}
                onNavigate={setCurrentDate}
                views={['day', 'week', 'month']}
                style={{ height: 600 }}
                onSelectEvent={handleSelectBooking}
                onSelectSlot={handleSelectSlot}
                selectable={true}
                components={{ 
                  event: EventComponent,
                  toolbar: CustomToolbar
                }}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: event.state === 'completed' ? 'rgba(16, 185, 129, 0.1)' :
                                   event.state === 'delayed' ? 'rgba(245, 158, 11, 0.1)' :
                                   event.state === 'issue' ? 'rgba(239, 68, 68, 0.1)' :
                                   'rgba(59, 130, 246, 0.1)',
                    borderLeft: `4px solid ${getStateColor(event.state)}`,
                    borderRadius: '8px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }
                })}
              />
            </div>
          </div>

          {/* Legend */}
          <div className="legend-card">
            <div className="legend-item">
              <span className="legend-dot completed"></span>
              <span>Completed</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot delayed"></span>
              <span>Delayed</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot issue"></span>
              <span>Issue</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot scheduled"></span>
              <span>Scheduled</span>
            </div>
          </div>
        </div>

        {/* Right Column - Bookings List */}
        <div className="bookings-list-column">
          <div className="bookings-list-header">
            <h2>Upcoming Bookings</h2>
            <span className="bookings-count">{bookings.length} total</span>
          </div>
          
          <div className="bookings-list-container">
            {sortedBookings.map(booking => (
              <div key={booking.id} className="booking-list-item">
                {/* Compact View - Always Visible */}
                <div 
                  className={`booking-compact ${expandedBooking?.id === booking.id ? 'expanded' : ''}`}
                  onClick={() => handleSelectBooking(booking)}
                >
                  <div className="booking-time-indicator">
                    <div className={`time-dot ${booking.state}`}></div>
                    <div className="booking-time-info">
                      <span className="booking-date">{moment(booking.start).format("MMM D, YYYY")}</span>
                      <span className="booking-time-range">
                        {moment(booking.start).format("HH:mm")} - {moment(booking.end).format("HH:mm")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="booking-main-info">
                    <h3 className="booking-title">{booking.title}</h3>
                    <div className="booking-room-badge">
                      <FaMapMarkerAlt /> {booking.roomName}
                    </div>
                  </div>
                  
                  <div className="booking-actions">
                    <button 
                      className="icon-btn edit"
                      onClick={(e) => handleEditClick(booking, e)}
                      title="Edit booking"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="icon-btn cancel"
                      onClick={(e) => handleDeleteBooking(booking.id, e)}
                      title="Cancel booking"
                    >
                      <FaTimes />
                    </button>
                    <button className="expand-btn">
                      {expandedBooking?.id === booking.id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                </div>

                {/* Expanded View - Shows when clicked */}
                {expandedBooking?.id === booking.id && (
                  <div className="booking-expanded">
                    {/* Status Badges */}
                    <div className="expanded-status">
                      <span className={`status-badge ${booking.state}`}>
                        {getStateIcon(booking.state)}
                        <span>{booking.state.charAt(0).toUpperCase() + booking.state.slice(1)}</span>
                      </span>
                    </div>

                    {/* State Change Buttons */}
                    <div className="state-change-buttons">
                      <button 
                        className={`state-btn small completed ${booking.state === 'completed' ? 'active' : ''}`}
                        onClick={(e) => handleStateChange(booking.id, 'completed', e)}
                      >
                        <FaCheckCircle /> Complete
                      </button>
                      <button 
                        className={`state-btn small delayed ${booking.state === 'delayed' ? 'active' : ''}`}
                        onClick={(e) => handleStateChange(booking.id, 'delayed', e)}
                      >
                        <FaDelay /> Delay
                      </button>
                      <button 
                        className={`state-btn small issue ${booking.state === 'issue' ? 'active' : ''}`}
                        onClick={(e) => handleStateChange(booking.id, 'issue', e)}
                      >
                        <FaExclamationTriangle /> Issue
                      </button>
                    </div>

                    {/* Moderator Info */}
                    <div className="expanded-section">
                      <h4>Moderator</h4>
                      <div className="moderator-info">
                        <div className="moderator-avatar">{booking.moderator.avatar}</div>
                        <div className="moderator-details">
                          <span className="moderator-name">{booking.moderator.name}</span>
                          <span className="moderator-email">{booking.moderator.email}</span>
                          <span className="moderator-dept">{booking.moderator.department}</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="expanded-section">
                      <h4>Attendees ({booking.guests.length})</h4>
                      <div className="attendees-compact-list">
                        {booking.guests.map(guest => (
                          <div key={guest.id} className="attendee-compact">
                            <span className="attendee-name">{guest.name}</span>
                            <span className={`attendee-status ${guest.status}`}>{guest.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Description & Room Condition - Editable */}
                    {editingBooking === booking.id ? (
                      <div className="edit-section">
                        <div className="edit-field">
                          <label>Description</label>
                          <textarea 
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Meeting description..."
                            rows="2"
                          />
                        </div>
                        <div className="edit-field">
                          <label>Room Condition</label>
                          <textarea 
                            value={editRoomCondition}
                            onChange={(e) => setEditRoomCondition(e.target.value)}
                            placeholder="Current room condition..."
                            rows="2"
                          />
                        </div>
                        <div className="edit-actions">
                          <button className="save-btn small" onClick={(e) => handleSaveEdit(booking.id, e)}>
                            <FaSave /> Save
                          </button>
                          <button className="cancel-btn small" onClick={handleCancelEdit}>
                            <FaTimes /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="expanded-section">
                        <h4>Description</h4>
                        <p className="description-text">{booking.description || "No description provided"}</p>
                        
                        <h4>Room Condition</h4>
                        <p className="condition-text">{booking.roomCondition || "Not recorded"}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Popup Modal */}
      {showBookingPopup && selectedSlot && (
        <div className="popup-overlay" onClick={() => setShowBookingPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>New Booking</h2>
              <button className="popup-close" onClick={() => setShowBookingPopup(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="popup-body">
              {/* Time Summary */}
              <div className="time-summary">
                <div className="time-summary-item">
                  <FaRegCalendar className="time-icon" />
                  <div>
                    <span className="time-label">Date</span>
                    <span className="time-value">{moment(selectedSlot.start).format("dddd, MMMM D, YYYY")}</span>
                  </div>
                </div>
                <div className="time-summary-item">
                  <FaRegClock className="time-icon" />
                  <div>
                    <span className="time-label">Time</span>
                    <span className="time-value">
                      {moment(selectedSlot.start).format("HH:mm")} - {moment(selectedSlot.end).format("HH:mm")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="popup-tabs">
                <button 
                  className={`popup-tab ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  <FaInfoCircle /> Details
                </button>
                <button 
                  className={`popup-tab ${activeTab === 'attendees' ? 'active' : ''}`}
                  onClick={() => setActiveTab('attendees')}
                >
                  <FaUserFriends /> Attendees
                </button>
                <button 
                  className={`popup-tab ${activeTab === 'description' ? 'active' : ''}`}
                  onClick={() => setActiveTab('description')}
                >
                  <FaStickyNote /> Description
                </button>
              </div>

              {/* Tab Content */}
              <div className="popup-tab-content">
                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div className="details-tab">
                    <div className="form-group">
                      <label>Meeting Title *</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Weekly Team Sync"
                        value={newBooking.title}
                        onChange={(e) => setNewBooking({...newBooking, title: e.target.value})}
                        autoFocus
                      />
                    </div>

                    <div className="form-group">
                      <label>Room *</label>
                      <select 
                        value={newBooking.roomId}
                        onChange={(e) => setNewBooking({...newBooking, roomId: e.target.value})}
                      >
                        <option value="">Select a room</option>
                        {rooms.map(room => (
                          <option key={room.id} value={room.id}>
                            {room.name} - Floor {room.floor} (Capacity: {room.capacity})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Start Time</label>
                        <input 
                          type="time" 
                          value={moment(newBooking.start).format("HH:mm")}
                          onChange={(e) => handleTimeChange('start', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>End Time</label>
                        <input 
                          type="time" 
                          value={moment(newBooking.end).format("HH:mm")}
                          onChange={(e) => handleTimeChange('end', e.target.value)}
                        />
                      </div>
                    </div>

                    {newBooking.roomId && (
                      <div className="room-preview">
                        <h4>Room Details</h4>
                        <div className="room-amenities">
                          {rooms.find(r => r.id === newBooking.roomId)?.amenities.map((amenity, i) => (
                            <span key={i} className="amenity-tag">{amenity}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Attendees Tab */}
                {activeTab === 'attendees' && (
                  <div className="attendees-tab">
                    <div className="search-box">
                      <FaSearch className="search-icon" />
                      <input 
                        type="text" 
                        placeholder="Search people by name, email, or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {selectedAttendees.length > 0 && (
                      <div className="selected-attendees">
                        <h4>Selected ({selectedAttendees.length})</h4>
                        <div className="selected-list">
                          {selectedAttendees.map(attendee => (
                            <div key={attendee.id} className="selected-tag">
                              <span>{attendee.name}</span>
                              <button onClick={() => handleRemoveAttendee(attendee.id)}>
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="user-list">
                      {filteredUsers.map(user => (
                        <div key={user.id} className="user-item">
                          <div className="user-avatar">{user.avatar}</div>
                          <div className="user-details">
                            <span className="user-name">{user.name}</span>
                            <span className="user-email">{user.email}</span>
                            <span className="user-dept">{user.department}</span>
                          </div>
                          <button 
                            className={`add-btn ${selectedAttendees.find(a => a.id === user.id) ? 'added' : ''}`}
                            onClick={() => handleAddAttendee(user)}
                            disabled={selectedAttendees.find(a => a.id === user.id)}
                          >
                            {selectedAttendees.find(a => a.id === user.id) ? 'Added' : 'Add'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description Tab */}
                {activeTab === 'description' && (
                  <div className="description-tab">
                    <div className="form-group">
                      <label>Meeting Description</label>
                      <textarea 
                        placeholder="Add meeting agenda, goals, or any important information..."
                        rows="6"
                        value={newBooking.description}
                        onChange={(e) => setNewBooking({...newBooking, description: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="popup-footer">
              <button className="cancel-btn" onClick={() => setShowBookingPopup(false)}>
                Cancel
              </button>
              <button className="create-btn" onClick={handleCreateBooking}>
                Create Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}