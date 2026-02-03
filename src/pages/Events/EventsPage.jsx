import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import AddLiveSessionModal from './components/AddLiveSessionModal';
import EditLiveSessionModal from './components/EditLiveSessionModal';
import AddSessionBookingModal from './components/AddSessionBookingModal';
import './EventsPage.css';

const EventsPage = () => {
  const [selectedSection, setSelectedSection] = useState('live-sessions');
  const [showAddLiveSession, setShowAddLiveSession] = useState(false);
  const [showEditLiveSession, setShowEditLiveSession] = useState(false);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [liveSessions, setLiveSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

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

  const handleBookingAdded = () => {
    setShowAddBooking(false);
    fetchBookings();
    fetchLiveSessions(); // Refresh to update capacity counts
  };

  // Filter live sessions based on search and date
  const filteredLiveSessions = liveSessions.filter(session => {
    const matchesSearch = session.sessionName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || session.date === dateFilter;
    return matchesSearch && matchesDate;
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

      case 'session-bookings':
        return (
          <div>
            <div className="content-header">
              <div>
                <h2>Live Session Bookings</h2>
                <p className="content-subtitle">Manage session bookings and attendees</p>
              </div>
              <button 
                className="btn-primary"
                onClick={() => setShowAddBooking(true)}
              >
                Add Booking
              </button>
            </div>

            {/* Bookings List */}
            {bookings.length === 0 ? (
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
                      <th>Session</th>
                      <th>Date</th>
                      <th>Time Slot</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
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
    </div>
  );
};

export default EventsPage;
