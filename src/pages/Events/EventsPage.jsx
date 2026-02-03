import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import ManageCalendarModal from './components/ManageCalendarModal';
import AddBookingModal from './components/AddBookingModal';
import './EventsPage.css';

const EventsPage = () => {
  const [selectedView, setSelectedView] = useState('available-dates');
  const [showManageCalendar, setShowManageCalendar] = useState(false);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchBookings(), fetchAvailableDates()]);
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

  const handleCalendarSaved = () => {
    setShowManageCalendar(false);
    fetchData();
  };

  const handleBookingAdded = () => {
    setShowAddBooking(false);
    fetchData();
  };

  const renderContent = () => {
    switch (selectedView) {
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
    </div>
  );
};

export default EventsPage;
