import { useState, useEffect } from 'react';
import { updateDoc, doc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './AddLiveSessionModal.css';

const EditSessionBookingModal = ({ booking, onClose, onBookingUpdated }) => {
  const [liveSessions, setLiveSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [name, setName] = useState(booking.name || '');
  const [email, setEmail] = useState(booking.email || '');
  const [mobile, setMobile] = useState(booking.mobile || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  useEffect(() => {
    if (liveSessions.length > 0 && booking.sessionId) {
      const session = liveSessions.find(s => s.id === booking.sessionId);
      if (session) {
        setSelectedSession(session);
        // Find the matching time slot
        const slot = session.timeSlots?.find(s => 
          (typeof s === 'string' ? s : s.time) === booking.timeSlot
        );
        if (slot) {
          setSelectedTimeSlot(slot);
        }
      }
    }
  }, [liveSessions, booking]);

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

  const getAvailableTimeSlots = () => {
    if (!selectedSession?.timeSlots) return [];
    
    return selectedSession.timeSlots.filter(slot => {
      if (typeof slot === 'string') return true;
      
      const booked = slot.booked || 0;
      const capacity = slot.capacity || 0;
      
      // Allow current booking's slot even if full
      const currentSlot = (typeof slot === 'string' ? slot : slot.time);
      if (currentSlot === booking.timeSlot) {
        return true;
      }
      
      return booked < capacity;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !mobile.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!selectedSession) {
      setError('Please select a session');
      return;
    }

    if (!selectedTimeSlot) {
      setError('Please select a time slot');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const slotTime = typeof selectedTimeSlot === 'string' ? selectedTimeSlot : selectedTimeSlot.time;
      
      // Check if session or time slot changed
      const sessionChanged = booking.sessionId !== selectedSession.id;
      const timeSlotChanged = booking.timeSlot !== slotTime;
      
      // Update booking
      const bookingRef = doc(db, 'sessionBookings', booking.id);
      await updateDoc(bookingRef, {
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        sessionId: selectedSession.id,
        sessionName: selectedSession.sessionName,
        sessionDate: selectedSession.date,
        timeSlot: slotTime,
        updatedAt: new Date().toISOString()
      });

      // Update capacity counts if session or time slot changed
      if (sessionChanged || timeSlotChanged) {
        // Decrease booked count from old slot
        if (booking.sessionId) {
          const oldSessionRef = doc(db, 'liveSessions', booking.sessionId);
          const oldSessionDoc = await getDocs(query(collection(db, 'liveSessions')));
          const oldSession = oldSessionDoc.docs.find(d => d.id === booking.sessionId)?.data();
          
          if (oldSession?.timeSlots) {
            const updatedOldSlots = oldSession.timeSlots.map(slot => {
              const time = typeof slot === 'string' ? slot : slot.time;
              if (time === booking.timeSlot && typeof slot === 'object') {
                return {
                  ...slot,
                  booked: Math.max(0, (slot.booked || 0) - 1)
                };
              }
              return slot;
            });
            
            await updateDoc(oldSessionRef, { timeSlots: updatedOldSlots });
          }
        }

        // Increase booked count in new slot
        const newSessionRef = doc(db, 'liveSessions', selectedSession.id);
        const updatedNewSlots = selectedSession.timeSlots.map(slot => {
          const time = typeof slot === 'string' ? slot : slot.time;
          if (time === slotTime && typeof slot === 'object') {
            return {
              ...slot,
              booked: (slot.booked || 0) + 1
            };
          }
          return slot;
        });
        
        await updateDoc(newSessionRef, { timeSlots: updatedNewSlots });
      } else {
        // Only update booking details, no capacity change
        // Just update the session reference if needed
        const sessionRef = doc(db, 'liveSessions', selectedSession.id);
        const updatedSlots = selectedSession.timeSlots.map(slot => {
          const time = typeof slot === 'string' ? slot : slot.time;
          if (time === slotTime && typeof slot === 'object' && !slot.booked) {
            return {
              ...slot,
              booked: 1
            };
          }
          return slot;
        });
        
        await updateDoc(sessionRef, { timeSlots: updatedSlots });
      }

      onBookingUpdated();
    } catch (error) {
      console.error('Error updating booking:', error);
      setError('Failed to update booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const availableSlots = getAvailableTimeSlots();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Booking</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Session *</label>
            <select
              value={selectedSession?.id || ''}
              onChange={(e) => handleSessionChange(e.target.value)}
              required
            >
              <option value="">Select a session</option>
              {liveSessions.map(session => (
                <option key={session.id} value={session.id}>
                  {session.sessionName} - {new Date(session.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="form-group">
            <label>Mobile *</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter mobile number"
              required
            />
          </div>

          {selectedSession && (
            <div className="form-group">
              <label>Select Time Slot *</label>
              {availableSlots.length === 0 ? (
                <p className="no-slots-message">No available time slots for this session</p>
              ) : (
                <div className="time-slots-selection">
                  {availableSlots.map((slot, index) => {
                    const slotTime = typeof slot === 'string' ? slot : slot.time;
                    const capacity = typeof slot === 'object' ? slot.capacity : null;
                    const booked = typeof slot === 'object' ? (slot.booked || 0) : 0;
                    const isSelected = selectedTimeSlot && (typeof selectedTimeSlot === 'string' ? selectedTimeSlot : selectedTimeSlot.time) === slotTime;

                    return (
                      <div
                        key={index}
                        className={`time-slot-option ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedTimeSlot(slot)}
                      >
                        <div className="slot-time-display">{slotTime}</div>
                        {capacity && (
                          <div className="slot-availability">
                            {booked}/{capacity} booked
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading || !selectedSession || !selectedTimeSlot}
            >
              {loading ? 'Updating...' : 'Update Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSessionBookingModal;
