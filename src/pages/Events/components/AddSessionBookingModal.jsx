import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './AddLiveSessionModal.css';

const AddSessionBookingModal = ({ onClose, onBookingAdded }) => {
  const [liveSessions, setLiveSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
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
      const q = query(sessionsRef, orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const activeSessions = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(session => {
          const sessionDate = new Date(session.date);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate >= today;
        });
      
      setLiveSessions(activeSessions);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
    }
  };

  const handleSessionChange = (sessionId) => {
    const session = liveSessions.find(s => s.id === sessionId);
    setSelectedSession(session);
    setSelectedTimeSlot(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!selectedSession) {
      setError('Please select a live session');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!mobile.trim()) {
      setError('Please enter your mobile number');
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
        sessionDate: selectedSession.date,
        timeSlot: selectedTimeSlot.time,
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        bookedAt: new Date().toISOString(),
        status: 'confirmed'
      });

      // Update the session's time slot booked count
      const sessionRef = doc(db, 'liveSessions', selectedSession.id);
      const updatedTimeSlots = selectedSession.timeSlots.map(slot => {
        if (slot.time === selectedTimeSlot.time) {
          return {
            ...slot,
            booked: (slot.booked || 0) + 1
          };
        }
        return slot;
      });

      await updateDoc(sessionRef, {
        timeSlots: updatedTimeSlots
      });

      onBookingAdded();
    } catch (err) {
      console.error('Error adding booking:', err);
      setError('Failed to add booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableSlots = () => {
    if (!selectedSession || !selectedSession.timeSlots) return [];
    return selectedSession.timeSlots.filter(slot => 
      typeof slot === 'object' && slot.capacity && (slot.booked || 0) < slot.capacity
    );
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
                  {session.sessionName} - {new Date(session.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </option>
              ))}
            </select>
          </div>

          {/* User Details */}
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
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
              placeholder="Enter your email"
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
              placeholder="Enter your mobile number"
              className="form-input"
            />
          </div>

          {/* Time Slot Selection */}
          {selectedSession && (
            <div className="form-group">
              <label>Select Time Slot *</label>
              {getAvailableSlots().length === 0 ? (
                <p className="no-slots-message">No available time slots for this session</p>
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
