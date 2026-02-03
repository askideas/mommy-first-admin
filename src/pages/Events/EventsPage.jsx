import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ManageCalendarModal from './components/ManageCalendarModal';
import AddBookingModal from './components/AddBookingModal';
import AddLiveSessionModal from './components/AddLiveSessionModal';
import EditLiveSessionModal from './components/EditLiveSessionModal';
import './EventsPage.css';

const EventsPage = () => {
  const [selectedView, setSelectedView] = useState('live-sessions');
  const [showManageCalendar, setShowManageCalendar] = useState(false);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [showAddLiveSession, setShowAddLiveSession] = useState(false);
  const [showEditLiveSession, setShowEditLiveSession] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchBookings(), fetchAvailableDates(), fetchLiveSessions()]);
  };

  const fetchBookings = async () => {
    try {
      const bookingsRef = collection(db, 'eventBookings');
      const q = query(bookingsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchAvailableDates = async () => {
    try {
      setLoading(true);
      const calendarRef = collection(db, 'eventCalendar');
      const today = new Date().toISOString().split('T')[0];
      const q = query(calendarRef, where('date', '>=', today));
      const querySnapshot = await getDocs(q);
      
      const slots = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Group by date
      const grouped = {};
      slots.forEach(slot => {
        if (!grouped[slot.date]) {
          grouped[slot.date] = [];
        }
        grouped[slot.date].push(slot);
      });

      // Convert to array and sort
      const datesArray = Object.entries(grouped)
        .map(([date, slots]) => ({
          date,
          slots: slots.sort((a, b) => a.time.localeCompare(b.time))
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setAvailableDates(datesArray);
    } catch (error) {
      console.error('Error fetching available dates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveSessions = async () => {
    try {
      setLoading(true);
      const sessionsRef = collection(db, 'liveSessions');
      const q = query(sessionsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const sessionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setLiveSessions(sessionsData);
    } catch (error) {
      console.error('Error fetching live sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarSaved = () => {
    setShowManageCalendar(false);
    fetchData();
  };

  const handleBookingAdded = () => {
    setShowAddBooking(false);
    fetchData();
  };

  const handleLiveSessionAdded = () => {
    setShowAddLiveSession(false);
    fetchData();
  };

  const handleEditSession = (session) => {
    setSelectedSession(session);
    setShowEditLiveSession(true);
  };

  const handleSessionUpdated = () => {
    setShowEditLiveSession(false);
    setSelectedSession(null);
    fetchLiveSessions();
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await deleteDoc(doc(db, 'liveSessions', sessionId));
        fetchLiveSessions();
      } catch (error) {
        console.error('Error deleting session:', error);
        alert('Failed to delete session. Please try again.');
      }
    }
  };

  // Filter live sessions based on search and date
  const filteredLiveSessions = liveSessions.filter(session => {
    const matchesSearch = session.sessionName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || session.date === dateFilter;
    return matchesSearch && matchesDate;
  });

  const renderContent = () => {
    switch (selectedView) {
      case 'live-sessions':
        return (
          <div className="section-content">
            <div className="content-header">
              <div>
                <h2>Live Sessions</h2>
                <p className="content-subtitle">Manage live session schedules and time slots</p>
              </div>
              <button 
                className="btn-primary"
                onClick={() => setShowAddLiveSession(true)}
              >
                Add Live Session
              </button>
            </div>

            {/* Search and Filter */}
            <div className="filters-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by session name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="date-filter">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="date-filter-input"
                  placeholder="Filter by date"
                />
                {dateFilter && (
                  <button
                    className="clear-filter-btn"
                    onClick={() => setDateFilter('')}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Sessions List */}
            {loading ? (
              <div className="loading-state">Loading live sessions...</div>
            ) : filteredLiveSessions.length === 0 ? (
              <div className="empty-state">
                <p>{searchQuery || dateFilter ? 'No sessions match your filters' : 'No live sessions yet'}</p>
                {!searchQuery && !dateFilter && (
                  <button 
                    className="btn-primary"
                    onClick={() => setShowAddLiveSession(true)}
                    style={{ marginTop: '12px' }}
                  >
                    Create First Session
                  </button>
                )}
              </div>
            ) : (
              <div className="sessions-grid">
                {filteredLiveSessions.map((session) => (
                  <div key={session.id} className="session-card">
                    <div className="session-card-header">
                      <h3>{session.sessionName}</h3>
                      <span className="session-status active">Active</span>
                    </div>
                    <div className="session-card-body">
                      <div className="session-date">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4C14 3.26362 13.403 2.66667 12.6667 2.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10.6667 1.33333V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5.33333 1.33333V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 6.66667H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {new Date(session.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="session-time-slots">
                        <div className="time-slots-label">Time Slots:</div>
                        <div className="time-slots-list-view">
                          {session.timeSlots?.map((slot, index) => (
                            <div key={index} className="time-slot-badge">
                              <span className="slot-time">
                                {typeof slot === 'string' ? slot : slot.time}
                              </span>
                              {typeof slot === 'object' && slot.capacity && (
                                <span className="slot-capacity">
                                  {slot.booked || 0}/{slot.capacity}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="session-card-actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditSession(session)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'available-dates':
        return (
          <div className="section-content">
            <div className="content-header">
              <div>
                <h2>Available Dates & Times</h2>
                <p className="content-subtitle">Manage your event calendar and time slots</p>
              </div>
              <button 
                className="btn-primary"
                onClick={() => setShowManageCalendar(true)}
              >
                Manage Calendar
              </button>
            </div>

            {loading ? (
              <div className="loading-state">Loading available dates...</div>
            ) : availableDates.length === 0 ? (
              <div className="empty-state">
                <p>No available dates configured</p>
                <button 
                  className="btn-primary"
                  onClick={() => setShowManageCalendar(true)}
                  style={{ marginTop: '12px' }}
                >
                  Create Calendar Slots
                </button>
              </div>
            ) : (
              <div className="dates-grid">
                {availableDates.map((dateEntry, index) => (
                  <div key={index} className="date-card">
                    <div className="date-card-header">
                      <h3>
                        {new Date(dateEntry.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                    </div>
                    <div className="date-card-body">
                      {dateEntry.slots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="time-slot-item">
                          <span className="time">{slot.time}</span>
                          <span className="capacity">
                            {slot.bookedCount || 0} / {slot.capacity} booked
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'bookings':
        return (
          <div className="section-content">
            <div className="content-header">
              <div>
                <h2>Bookings List</h2>
                <p className="content-subtitle">View and manage all event bookings</p>
              </div>
              <button 
                className="btn-primary"
                onClick={() => setShowAddBooking(true)}
              >
                Add Booking
              </button>
            </div>

            {loading ? (
              <div className="loading-state">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="empty-state">
                <p>No bookings yet</p>
                <button 
                  className="btn-primary"
                  onClick={() => setShowAddBooking(true)}
                  style={{ marginTop: '12px' }}
                >
                  Add First Booking
                </button>
              </div>
            ) : (
              <div className="bookings-table-wrapper">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking.id}>
                        <td>{booking.firstName} {booking.lastName}</td>
                        <td>{booking.email}</td>
                        <td>{booking.mobile}</td>
                        <td>{new Date(booking.eventDate).toLocaleDateString()}</td>
                        <td>{booking.eventTime}</td>
                        <td>
                          <span className={`status-badge ${booking.status || 'confirmed'}`}>
                            {booking.status || 'Confirmed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="events-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Events Management</h1>
          <p className="page-subtitle">Manage event calendar and bookings</p>
        </div>
      </div>

      <div className="events-layout">
        {/* Left Column - Navigation */}
        <div className="events-sidebar">
          <h3 className="sidebar-title">Manage</h3>
          <div className="events-nav-list">
            <button
              className={`nav-item ${selectedView === 'live-sessions' ? 'active' : ''}`}
              onClick={() => setSelectedView('live-sessions')}
            >
              Live Sessions
            </button>
            <button
              className={`nav-item ${selectedView === 'available-dates' ? 'active' : ''}`}
              onClick={() => setSelectedView('available-dates')}
            >
              Available Dates & Times
            </button>
            <button
              className={`nav-item ${selectedView === 'bookings' ? 'active' : ''}`}
              onClick={() => setSelectedView('bookings')}
            >
              Bookings List
            </button>
          </div>
        </div>

        {/* Right Column - Content */}
        {renderContent()}
      </div>

      {showManageCalendar && (
        <ManageCalendarModal
          onClose={() => setShowManageCalendar(false)}
          onSave={handleCalendarSaved}
        />
      )}

      {showAddBooking && (
        <AddBookingModal
          onClose={() => setShowAddBooking(false)}
          onBookingAdded={handleBookingAdded}
        />
      )}

      {showAddLiveSession && (
        <AddLiveSessionModal
          onClose={() => setShowAddLiveSession(false)}
          onSessionAdded={handleLiveSessionAdded}
        />
      )}

      {showEditLiveSession && selectedSession && (
        <EditLiveSessionModal
          session={selectedSession}
          onClose={() => {
            setShowEditLiveSession(false);
            setSelectedSession(null);
          }}
          onSessionUpdated={handleSessionUpdated}
        />
      )}
    </div>
  );
};

export default EventsPage;
