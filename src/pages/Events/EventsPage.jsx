import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AddLiveSessionModal from './components/AddLiveSessionModal';
import EditLiveSessionModal from './components/EditLiveSessionModal';
import AddSessionBookingModal from './components/AddSessionBookingModal';
import EditSessionBookingModal from './components/EditSessionBookingModal';
import './EventsPage.css';

const EventsPage = () => {
  const [selectedSection, setSelectedSection] = useState('live-sessions');
  const [showAddLiveSession, setShowAddLiveSession] = useState(false);
  const [showEditLiveSession, setShowEditLiveSession] = useState(false);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [showEditBooking, setShowEditBooking] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [liveSessions, setLiveSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Booking filters
  const [bookingSessionFilter, setBookingSessionFilter] = useState('');
  const [bookingDateFilter, setBookingDateFilter] = useState('');
  const [bookingTimeSlotFilter, setBookingTimeSlotFilter] = useState('');

  useEffect(() => {
    fetchLiveSessions();
    fetchBookings();
  }, []);

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

  const fetchBookings = async () => {
    try {
      const bookingsRef = collection(db, 'sessionBookings');
      const q = query(bookingsRef, orderBy('bookedAt', 'desc'));
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

  const handleLiveSessionAdded = () => {
    setShowAddLiveSession(false);
    fetchLiveSessions();
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
    if (window.confirm('Are you sure you want to delete this entire session?')) {
      try {
        await deleteDoc(doc(db, 'liveSessions', sessionId));
        fetchLiveSessions();
      } catch (error) {
        console.error('Error deleting session:', error);
        alert('Failed to delete session. Please try again.');
      }
    }
  };

  const handleDeleteIndividualDate = async (sessionId, dateToDelete) => {
    const session = liveSessions.find(s => s.id === sessionId);
    if (!session || !session.dates) return;

    if (session.dates.length === 1) {
      alert('Cannot delete the only date. Delete the entire session instead.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete the date: ${new Date(dateToDelete).toLocaleDateString()}?`)) {
      try {
        const updatedDates = session.dates.filter(d => d.date !== dateToDelete);
        const sessionRef = doc(db, 'liveSessions', sessionId);
        await updateDoc(sessionRef, { dates: updatedDates });
        fetchLiveSessions();
      } catch (error) {
        console.error('Error deleting date:', error);
        alert('Failed to delete date. Please try again.');
      }
    }
  };

  const handleEditIndividualDate = (session, dateToEdit) => {
    // Create a session object with only the selected date
    const singleDateSession = {
      ...session,
      dates: [session.dates.find(d => d.date === dateToEdit)]
    };
    setSelectedSession(singleDateSession);
    setShowEditLiveSession(true);
  };

  const handleBookingAdded = () => {
    setShowAddBooking(false);
    fetchBookings();
    fetchLiveSessions(); // Refresh to update capacity counts
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setShowEditBooking(true);
  };

  const handleBookingUpdated = () => {
    setShowEditBooking(false);
    setSelectedBooking(null);
    fetchBookings();
    fetchLiveSessions();
  };

  const handleDeleteBooking = async (bookingId, sessionId, timeSlot) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        // Delete booking
        await deleteDoc(doc(db, 'sessionBookings', bookingId));
        
        // Update session capacity
        if (sessionId) {
          const session = liveSessions.find(s => s.id === sessionId);
          if (session?.timeSlots) {
            const updatedSlots = session.timeSlots.map(slot => {
              const time = typeof slot === 'string' ? slot : slot.time;
              if (time === timeSlot && typeof slot === 'object') {
                return {
                  ...slot,
                  booked: Math.max(0, (slot.booked || 0) - 1)
                };
              }
              return slot;
            });
            
            const sessionRef = doc(db, 'liveSessions', sessionId);
            await updateDoc(sessionRef, { timeSlots: updatedSlots });
          }
        }
        
        fetchBookings();
        fetchLiveSessions();
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Failed to delete booking. Please try again.');
      }
    }
  };

  // Filter live sessions based on search and date
  const filteredLiveSessions = liveSessions.filter(session => {
    const matchesSearch = session.sessionName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Handle both old (single date) and new (dates array) format
    let matchesDate = !dateFilter;
    if (dateFilter) {
      if (session.dates) {
        // New format: check if any date matches
        matchesDate = session.dates.some(d => d.date === dateFilter);
      } else if (session.date) {
        // Old format: direct date comparison
        matchesDate = session.date === dateFilter;
      }
    }
    
    return matchesSearch && matchesDate;
  });

  // Get active sessions (present and future)
  const getActiveSessions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return liveSessions.filter(session => {
      // Handle both old and new format
      if (session.dates) {
        // New format: check if any date is present or future
        return session.dates.some(d => {
          const sessionDate = new Date(d.date);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate >= today;
        });
      } else if (session.date) {
        // Old format
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate >= today;
      }
      return false;
    });
  };

  // Get unique time slots from filtered bookings
  const getUniqueTimeSlots = () => {
    const timeSlots = new Set();
    bookings.forEach(booking => {
      if (booking.timeSlot) {
        timeSlots.add(booking.timeSlot);
      }
    });
    return Array.from(timeSlots).sort();
  };

  // Filter bookings based on filters
  const filteredBookings = bookings.filter(booking => {
    const matchesSession = !bookingSessionFilter || booking.sessionId === bookingSessionFilter;
    const matchesDate = !bookingDateFilter || booking.sessionDate === bookingDateFilter;
    const matchesTimeSlot = !bookingTimeSlotFilter || booking.timeSlot === bookingTimeSlotFilter;
    return matchesSession && matchesDate && matchesTimeSlot;
  });

  const renderSectionContent = () => {
    switch (selectedSection) {
      case 'live-sessions':
        return (
          <div>
            <div className="content-header">
              <div>
                <h2>Live Sessions</h2>
                <p className="content-subtitle">Create and manage your live sessions</p>
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
                      {/* Handle both old and new data formats */}
                      {session.dates ? (
                        // New format: Multiple dates
                        session.dates.map((dateEntry, dateIndex) => (
                          <div key={dateIndex} className="session-date-group">
                            <div className="date-group-header">
                              <div className="session-date">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4C14 3.26362 13.403 2.66667 12.6667 2.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M10.6667 1.33333V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M5.33333 1.33333V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M2 6.66667H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {new Date(dateEntry.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                              {session.dates.length > 1 && (
                                <div className="date-actions">
                                  <button
                                    className="btn-icon-edit"
                                    onClick={() => handleEditIndividualDate(session, dateEntry.date)}
                                    title="Edit this date"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                      <path d="M10.5 1.5L12.5 3.5M1 13L3.5 12.5L12.5 3.5L10.5 1.5L1.5 10.5L1 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </button>
                                  <button
                                    className="btn-icon-delete"
                                    onClick={() => handleDeleteIndividualDate(session.id, dateEntry.date)}
                                    title="Delete this date"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                      <path d="M1.75 3.5H12.25M5.25 6.125V10.5M8.75 6.125V10.5M2.625 3.5L3.5 12.25H10.5L11.375 3.5M5.25 3.5V1.75H8.75V3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="session-time-slots">
                              <div className="time-slots-label">Time Slots:</div>
                              <div className="time-slots-list-view">
                                {dateEntry.timeSlots?.map((slot, index) => (
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
                          </div>
                        ))
                      ) : (
                        // Old format: Single date
                        <>
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
                        </>
                      )}
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

      case 'session-bookings':
        return (
          <div>
            <div className="content-header">
              <div>
                <h2>Session Bookings</h2>
                <p className="content-subtitle">Manage all session bookings</p>
              </div>
              <button 
                className="btn-primary"
                onClick={() => setShowAddBooking(true)}
              >
                Add Booking
              </button>
            </div>

            {/* Filters */}
            <div className="filters-container">
              <div className="filter-group">
                <label className="filter-label">Session</label>
                <select
                  value={bookingSessionFilter}
                  onChange={(e) => setBookingSessionFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Sessions</option>
                  {getActiveSessions().map(session => (
                    <option key={session.id} value={session.id}>
                      {session.sessionName} - {new Date(session.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Date</label>
                <input
                  type="date"
                  value={bookingDateFilter}
                  onChange={(e) => setBookingDateFilter(e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Time Slot</label>
                <select
                  value={bookingTimeSlotFilter}
                  onChange={(e) => setBookingTimeSlotFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Time Slots</option>
                  {getUniqueTimeSlots().map(timeSlot => (
                    <option key={timeSlot} value={timeSlot}>
                      {timeSlot}
                    </option>
                  ))}
                </select>
              </div>

              {(bookingSessionFilter || bookingDateFilter || bookingTimeSlotFilter) && (
                <button
                  className="clear-all-filters-btn"
                  onClick={() => {
                    setBookingSessionFilter('');
                    setBookingDateFilter('');
                    setBookingTimeSlotFilter('');
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div className="empty-state">
                <p>{(bookingSessionFilter || bookingDateFilter || bookingTimeSlotFilter) 
                  ? 'No bookings match your filters' 
                  : 'No bookings yet'}</p>
                {!(bookingSessionFilter || bookingDateFilter || bookingTimeSlotFilter) && (
                  <button 
                    className="btn-primary"
                    onClick={() => setShowAddBooking(true)}
                    style={{ marginTop: '12px' }}
                  >
                    Add First Booking
                  </button>
                )}
              </div>
            ) : (
              <div className="bookings-table-wrapper">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Session</th>
                      <th>Date</th>
                      <th>Time Slot</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(booking => (
                      <tr key={booking.id}>
                        <td>{booking.name}</td>
                        <td>{booking.email}</td>
                        <td>{booking.mobile}</td>
                        <td>{booking.sessionName}</td>
                        <td>{new Date(booking.sessionDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</td>
                        <td>{booking.timeSlot}</td>
                        <td>
                          <span className={`status-badge ${booking.status || 'confirmed'}`}>
                            {booking.status || 'Confirmed'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="btn-edit-small"
                              onClick={() => handleEditBooking(booking)}
                              title="Edit booking"
                            >
                              Edit
                            </button>
                            <button
                              className="btn-delete-small"
                              onClick={() => handleDeleteBooking(booking.id, booking.sessionId, booking.timeSlot)}
                              title="Delete booking"
                            >
                              Delete
                            </button>
                          </div>
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
          <p className="page-subtitle">Manage live sessions and bookings</p>
        </div>
      </div>

      <div className="events-layout">
        {/* Left Column - Navigation */}
        <div className="events-sidebar">
          <h3 className="sidebar-title">Manage</h3>
          <div className="events-nav-list">
            <button
              className={`nav-item ${selectedSection === 'live-sessions' ? 'active' : ''}`}
              onClick={() => setSelectedSection('live-sessions')}
            >
              Live Sessions
            </button>
            <button
              className={`nav-item ${selectedSection === 'session-bookings' ? 'active' : ''}`}
              onClick={() => setSelectedSection('session-bookings')}
            >
              Session Bookings
            </button>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="section-content">
          {renderSectionContent()}
        </div>
      </div>

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

      {showAddBooking && (
        <AddSessionBookingModal
          onClose={() => setShowAddBooking(false)}
          onBookingAdded={handleBookingAdded}
        />
      )}

      {showEditBooking && selectedBooking && (
        <EditSessionBookingModal
          booking={selectedBooking}
          onClose={() => {
            setShowEditBooking(false);
            setSelectedBooking(null);
          }}
          onBookingUpdated={handleBookingUpdated}
        />
      )}
    </div>
  );
};

export default EventsPage;
