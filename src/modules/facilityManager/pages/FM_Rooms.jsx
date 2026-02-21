import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./FM_Rooms.css";
import RoomDetailsModal from "../components/RoomDetailsModal";

const localizer = momentLocalizer(moment);

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

// Bookings data
const bookings = [
  {
    id: 1,
    title: "Weekly Team Sync",
    start: new Date(2026, 1, 23, 10, 0),
    end: new Date(2026, 1, 23, 12, 0),
    roomId: "RM001",
    roomName: "Conference A",
    status: "confirmed",
    moderator: {
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      matricule: "EMP001"
    },
    attendees: [
      { id: 1, name: "Sarah Johnson", role: "Moderator", email: "sarah.j@company.com", checkInTime: "09:55" },
      { id: 2, name: "Michael Chen", role: "Developer", email: "michael.c@company.com", checkInTime: "09:58" },
      { id: 3, name: "Emma Davis", role: "Designer", email: "emma.d@company.com", checkInTime: "10:02" },
      { id: 4, name: "James Wilson", role: "Product Manager", email: "james.w@company.com", checkInTime: "09:50" }
    ]
  },
  {
    id: 2,
    title: "Client Presentation",
    start: new Date(2026, 1, 23, 14, 0),
    end: new Date(2026, 1, 23, 15, 30),
    roomId: "RM002",
    roomName: "Meeting Room 2",
    status: "confirmed",
    moderator: {
      name: "John Smith",
      email: "john.s@company.com",
      matricule: "EMP006"
    },
    attendees: [
      { id: 5, name: "John Smith", role: "Account Executive", email: "john.s@company.com", checkInTime: "13:55" },
      { id: 6, name: "Alice Cooper", role: "Client", email: "alice.c@client.com", checkInTime: "14:00" },
      { id: 7, name: "Bob Martin", role: "Client", email: "bob.m@client.com", checkInTime: "14:02" },
      { id: 8, name: "Carol White", role: "Solutions Architect", email: "carol.w@company.com", checkInTime: "13:58" }
    ]
  },
  {
    id: 3,
    title: "Training Workshop",
    start: new Date(2026, 1, 24, 9, 0),
    end: new Date(2026, 1, 24, 12, 0),
    roomId: "RM003",
    roomName: "Training Hall",
    status: "confirmed",
    moderator: {
      name: "Robert Brown",
      email: "robert.b@company.com",
      matricule: "EMP008"
    },
    attendees: [
      { id: 9, name: "Robert Brown", role: "Trainer", email: "robert.b@company.com", checkInTime: "08:45" },
      { id: 10, name: "Patricia Garcia", role: "Trainee", email: "patricia.g@company.com", checkInTime: "08:50" },
      { id: 11, name: "David Miller", role: "Trainee", email: "david.m@company.com", checkInTime: "08:55" },
      { id: 12, name: "Jennifer Lee", role: "Trainee", email: "jennifer.l@company.com", checkInTime: "09:00" }
    ]
  }
];

// Helper to get room status
const getRoomStatus = (roomId) => {
  const now = new Date();
  const hasActiveEvent = bookings.some(event => 
    event.roomId === roomId && 
    now >= event.start && 
    now <= event.end
  );
  return hasActiveEvent ? "Occupied" : "Available";
};

export default function FM_Rooms() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [calendarView, setCalendarView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setShowBookingForm(true);
  };

  const handleCloseModals = () => {
    setShowRoomModal(false);
    setShowBookingModal(false);
    setShowBookingForm(false);
    setSelectedRoom(null);
    setSelectedBooking(null);
    setSelectedSlot(null);
  };

  const handleCreateBooking = (bookingData) => {
    // In real app, this would call an API
    console.log("Creating booking:", bookingData);
    alert(`Booking created for ${bookingData.roomName} from ${moment(bookingData.start).format("HH:mm")} to ${moment(bookingData.end).format("HH:mm")}`);
    handleCloseModals();
  };

  // Custom calendar event
  const EventComponent = ({ event }) => (
    <div className={`calendar-event ${event.status}`}>
      <div className="event-time">
        {moment(event.start).format("HH:mm")}
      </div>
      <div className="event-title">{event.title}</div>
      <div className="event-room">{event.roomName}</div>
    </div>
  );

  // Custom toolbar to remove default
  const CustomToolbar = () => null;

  return (
    <div className="rooms-wrapper">
      {/* Header */}
      <div className="rooms-header">
        <h2>Rooms Management</h2>
        <p>Manage meeting rooms, schedules, and reservations</p>
      </div>

      {/* Room Cards */}
      <div className="room-status-grid">
        {rooms.map((room) => {
          const status = getRoomStatus(room.roomId);
          const roomBookings = bookings.filter(b => b.roomId === room.roomId);
          
          return (
            <div
              key={room.roomId}
              className={`room-card ${status.toLowerCase()}`}
              onClick={() => handleRoomClick(room)}
            >
              <div className="room-card-header">
                <div>
                  <h3>{room.name}</h3>
                  <span className="room-id">{room.roomId}</span>
                </div>
                <span className="room-capacity-badge">{room.capacity} seats</span>
              </div>
              
              <div className="room-details">
                <p><strong>Department:</strong> {room.department}</p>
                <p><strong>Floor:</strong> {room.floor}</p>
              </div>
              
              <div className="room-status-row">
                <span className={`status-dot ${status.toLowerCase()}`}></span>
                <span className="status-text">{status}</span>
              </div>

              <div className="room-amenities">
                {room.amenities.slice(0, 3).map((a, i) => (
                  <span key={i} className="amenity-tag">{a}</span>
                ))}
              </div>

              <div className="room-footer">
                <span className="meeting-count">
                  {roomBookings.length} booking{roomBookings.length !== 1 ? 's' : ''}
                </span>
                <span className="view-link">View Details →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Calendar */}
      <div className="calendar-section">
        <div className="calendar-header">
          <h3>Weekly Schedule</h3>
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
            onSelectEvent={handleBookingClick}
            onSelectSlot={handleSelectSlot}
            selectable={true}
            components={{ 
              event: EventComponent,
              toolbar: CustomToolbar
            }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.status === 'confirmed' 
                  ? 'rgba(0, 178, 255, 0.15)' 
                  : 'rgba(255, 117, 20, 0.15)',
                borderLeft: `4px solid ${event.status === 'confirmed' ? '#00b2ff' : '#ff7514'}`,
                borderRadius: '8px',
                padding: '4px 8px',
                color: '#002857',
                cursor: 'pointer'
              }
            })}
          />
        </div>
      </div>

      {/* Room Details Modal */}
      {showRoomModal && selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          onClose={handleCloseModals}
          onBookRoom={() => {
            handleCloseModals();
            setShowBookingForm(true);
            setSelectedSlot({
              start: new Date(),
              end: new Date(new Date().setHours(new Date().getHours() + 1))
            });
          }}
        />
      )}

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content booking-details-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModals}>×</button>
            
            <div className="modal-header">
              <h2>{selectedBooking.title}</h2>
              <div className="booking-meta">
                <span className="badge">📍 {selectedBooking.roomName}</span>
                <span className={`badge status-${selectedBooking.status}`}>
                  ● {selectedBooking.status}
                </span>
              </div>
            </div>

            <div className="modal-body">
              <div className="booking-time-details">
                <div className="time-detail-card">
                  <span className="time-label">Start</span>
                  <span className="time-value">{moment(selectedBooking.start).format("MMMM Do YYYY, HH:mm")}</span>
                </div>
                <div className="time-detail-card">
                  <span className="time-label">End</span>
                  <span className="time-value">{moment(selectedBooking.end).format("MMMM Do YYYY, HH:mm")}</span>
                </div>
              </div>

              <div className="moderator-card">
                <h3>Moderator</h3>
                <div className="moderator-info">
                  <div className="moderator-avatar">
                    {selectedBooking.moderator.name.charAt(0)}
                  </div>
                  <div>
                    <div className="moderator-name">{selectedBooking.moderator.name}</div>
                    <div className="moderator-email">{selectedBooking.moderator.email}</div>
                    <div className="moderator-matricule">Matricule: {selectedBooking.moderator.matricule}</div>
                  </div>
                </div>
              </div>

              <div className="attendees-section">
                <h3>Attendees ({selectedBooking.attendees.length})</h3>
                <div className="attendees-grid">
                  {selectedBooking.attendees.map((attendee) => (
                    <div key={attendee.id} className="attendee-card">
                      <div className="attendee-avatar-large">
                        {attendee.name.charAt(0)}
                      </div>
                      <div className="attendee-details">
                        <span className="attendee-name">{attendee.name}</span>
                        <span className="attendee-role">{attendee.role}</span>
                        <span className="attendee-email">{attendee.email}</span>
                        {attendee.checkInTime && (
                          <span className="checkin-time">✓ Checked in at {attendee.checkInTime}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="secondary-btn" onClick={handleCloseModals}>Close</button>
              <button className="primary-btn" onClick={() => alert(`Editing booking ${selectedBooking.id}`)}>
                Edit Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && selectedSlot && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content booking-form-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModals}>×</button>
            
            <div className="modal-header">
              <h2>Book a Meeting Room</h2>
            </div>

            <div className="modal-body">
              <form onSubmit={(e) => e.preventDefault()} className="booking-form">
                <div className="form-group">
                  <label>Room</label>
                  <select className="form-control" defaultValue="">
                    <option value="" disabled>Select a room</option>
                    {rooms.map(room => (
                      <option key={room.roomId} value={room.roomId}>
                        {room.name} - {room.department} (Capacity: {room.capacity})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      defaultValue={moment(selectedSlot.start).format("YYYY-MM-DD")}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Time</label>
                    <input 
                      type="time" 
                      className="form-control" 
                      defaultValue={moment(selectedSlot.start).format("HH:mm")}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Time</label>
                    <input 
                      type="time" 
                      className="form-control" 
                      defaultValue={moment(selectedSlot.end).format("HH:mm")}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Meeting Title</label>
                  <input type="text" className="form-control" placeholder="e.g., Weekly Team Sync" />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-control" rows="3" placeholder="Meeting agenda..."></textarea>
                </div>

                <div className="form-group">
                  <label>Attendees (email addresses)</label>
                  <input type="text" className="form-control" placeholder="john@company.com, jane@company.com" />
                </div>

                <div className="form-checkbox">
                  <input type="checkbox" id="notify" />
                  <label htmlFor="notify">Send email notifications to attendees</label>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button className="secondary-btn" onClick={handleCloseModals}>Cancel</button>
              <button className="primary-btn" onClick={() => handleCreateBooking({
                roomName: "Conference A",
                start: selectedSlot.start,
                end: selectedSlot.end
              })}>
                Create Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}