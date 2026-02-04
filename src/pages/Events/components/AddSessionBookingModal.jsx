import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './AddLiveSessionModal.css';

const AddSessionBookingModal = ({ onClose, onBookingAdded }) => {
  const [liveSessions, setLiveSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  const fetchActiveSessions = async () => {
    try {
      const sessionsRef = collection(db, 'liveSessions');
      const q = query(sessionsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const activeSessions = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(session => {
          // Filter sessions that have at least one future or today's date
          if (session.dates && Array.isArray(session.dates)) {
            return session.dates.some(dateEntry => {
              const sessionDate = new Date(dateEntry.date);
              sessionDate.setHours(0, 0, 0, 0);
              return sessionDate >= today;
            });
          }
          return false;
        });
      
      setLiveSessions(activeSessions);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
    }
  };

  const handleSessionChange = (sessionId) => {
    const session = liveSessions.find(s => s.id === sessionId);
    setSelectedSession(session);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  const handleDateChange = (dateStr) => {
    if (!selectedSession) return;
    const date = selectedSession.dates.find(d => d.date === dateStr);
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const getAvailableDates = () => {
    if (!selectedSession || !selectedSession.dates) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return selectedSession.dates.filter(dateEntry => {
      const sessionDate = new Date(dateEntry.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate >= today;
    });
  };

  const getAvailableSlots = () => {
    if (!selectedDate || !selectedDate.timeSlots) return [];
    return selectedDate.timeSlots.filter(slot => 
      typeof slot === 'object' && slot.capacity && (slot.booked || 0) < slot.capacity
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!selectedSession) {
      setError('Please select a live session');
      return;
    }

    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    if (!name.trim()) {
      setError('Please enter name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter email');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    if (!mobile.trim()) {
      setError('Please enter mobile number');
      return;
    }

    // Mobile validation (10 digits)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile.trim())) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!selectedTimeSlot) {
      setError('Please select a time slot');
      return;
    }

    // Check if slot still has capacity
    if (selectedTimeSlot.booked >= selectedTimeSlot.capacity) {
      setError('Selected time slot is fully booked');
      return;
    }

    try {
      setLoading(true);

      // Add booking to firestore
      await addDoc(collection(db, 'sessionBookings'), {
        sessionId: selectedSession.id,
        sessionName: selectedSession.sessionName,
        sessionDate: selectedDate.date,
        timeSlot: selectedTimeSlot.time,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        bookedAt: new Date().toISOString(),
        status: 'confirmed'
      });

      // Update the session's time slot booked count for the specific date
      const sessionRef = doc(db, 'liveSessions', selectedSession.id);
      const updatedDates = selectedSession.dates.map(dateEntry => {
        if (dateEntry.date === selectedDate.date) {
          return {
            ...dateEntry,
            timeSlots: dateEntry.timeSlots.map(slot => {
              if (slot.time === selectedTimeSlot.time) {
                return {
                  ...slot,
                  booked: (slot.booked || 0) + 1
                };
              }
              return slot;
            })
          };
        }
        return dateEntry;
      });

      await updateDoc(sessionRef, {
        dates: updatedDates
      });

      onBookingAdded();
    } catch (err) {
      console.error('Error adding booking:', err);
      setError('Failed to add booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Booking</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="error-message">{error}</div>}

          {/* Live Session Selection */}
          <div className="form-group">
            <label htmlFor="liveSession">Select Live Session *</label>
            <select
              id="liveSession"
              value={selectedSession?.id || ''}
              onChange={(e) => handleSessionChange(e.target.value)}
              className="form-input"
            >
              <option value="">-- Select a session --</option>
              {liveSessions.map(session => (
                <option key={session.id} value={session.id}>
                  {session.sessionName}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection - Only shown after session is selected */}
          {selectedSession && (
            <div className="form-group">
              <label htmlFor="sessionDate">Select Date *</label>
              <select
                id="sessionDate"
                value={selectedDate?.date || ''}
                onChange={(e) => handleDateChange(e.target.value)}
                className="form-input"
              >
                <option value="">-- Select a date --</option>
                {getAvailableDates().map((dateEntry, index) => (
                  <option key={index} value={dateEntry.date}>
                    {new Date(dateEntry.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* User Details - Only shown after date is selected */}
          {selectedDate && (
            <>
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobile">Mobile Number *</label>
                <input
                  type="tel"
                  id="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="form-input"
                  maxLength="10"
                />
              </div>

              {/* Time Slot Selection */}
              <div className="form-group">
                <label>Select Time Slot *</label>
                {getAvailableSlots().length === 0 ? (
                  <p className="no-slots-message">No available time slots for this date</p>
                ) : (
                  <div className="time-slots-selection">
                    {getAvailableSlots().map((slot, index) => (
                      <div
                        key={index}
                        className={`time-slot-option ${selectedTimeSlot?.time === slot.time ? 'selected' : ''}`}
                        onClick={() => setSelectedTimeSlot(slot)}
                      >
                        <div className="slot-time-text">{slot.time}</div>
                        <div className="slot-capacity-text">
                          {slot.booked || 0}/{slot.capacity} booked
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSessionBookingModal;
