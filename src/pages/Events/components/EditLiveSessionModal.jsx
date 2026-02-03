import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './AddLiveSessionModal.css';

const EditLiveSessionModal = ({ session, onClose, onSessionUpdated }) => {
  const [sessionName, setSessionName] = useState('');
  const [sessionDates, setSessionDates] = useState([
    { date: '', timeSlots: [{ time: '', capacity: '' }] }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      setSessionName(session.sessionName || '');
      
      // Handle new format (dates array) and old format (single date)
      if (session.dates) {
        // New format: Multiple dates
        const formattedDates = session.dates.map(dateEntry => ({
          date: dateEntry.date || '',
          timeSlots: dateEntry.timeSlots?.map(slot => ({
            time: typeof slot === 'string' ? slot : (slot.time || ''),
            capacity: typeof slot === 'object' ? (slot.capacity || '') : ''
          })) || [{ time: '', capacity: '' }]
        }));
        setSessionDates(formattedDates);
      } else if (session.date) {
        // Old format: Single date
        const slots = session.timeSlots?.map(slot => {
          if (typeof slot === 'string') {
            return { time: slot, capacity: '' };
          }
          return { time: slot.time || '', capacity: slot.capacity || '' };
        }) || [{ time: '', capacity: '' }];
        
        setSessionDates([{ date: session.date, timeSlots: slots }]);
      }
    }
  }, [session]);

  const handleAddDate = () => {
    setSessionDates([...sessionDates, { date: '', timeSlots: [{ time: '', capacity: '' }] }]);
  };

  const handleRemoveDate = (dateIndex) => {
    if (sessionDates.length > 1) {
      setSessionDates(sessionDates.filter((_, i) => i !== dateIndex));
    }
  };

  const handleDateChange = (dateIndex, value) => {
    const updated = [...sessionDates];
    updated[dateIndex].date = value;
    setSessionDates(updated);
  };

  const handleAddTimeSlot = (dateIndex) => {
    const updated = [...sessionDates];
    updated[dateIndex].timeSlots.push({ time: '', capacity: '' });
    setSessionDates(updated);
  };

  const handleRemoveTimeSlot = (dateIndex, slotIndex) => {
    const updated = [...sessionDates];
    if (updated[dateIndex].timeSlots.length > 1) {
      updated[dateIndex].timeSlots = updated[dateIndex].timeSlots.filter((_, i) => i !== slotIndex);
      setSessionDates(updated);
    }
  };

  const handleTimeChange = (dateIndex, slotIndex, value) => {
    const updated = [...sessionDates];
    updated[dateIndex].timeSlots[slotIndex].time = value;
    setSessionDates(updated);
  };

  const handleCapacityChange = (dateIndex, slotIndex, value) => {
    const updated = [...sessionDates];
    updated[dateIndex].timeSlots[slotIndex].capacity = value;
    setSessionDates(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!sessionName.trim()) {
      setError('Please enter a session name');
      return;
    }

    // Validate each date and its time slots
    const validDates = sessionDates.filter(dateEntry => {
      if (!dateEntry.date) return false;
      const validSlots = dateEntry.timeSlots.filter(slot => 
        slot.time.trim() !== '' && slot.capacity
      );
      return validSlots.length > 0;
    });

    if (validDates.length === 0) {
      setError('Please add at least one date with valid time slots');
      return;
    }

    // Validate capacity values
    const hasInvalidCapacity = validDates.some(dateEntry => {
      return dateEntry.timeSlots.some(slot => {
        if (!slot.time.trim() || !slot.capacity) return false;
        const capacity = parseInt(slot.capacity);
        return isNaN(capacity) || capacity <= 0;
      });
    });

    if (hasInvalidCapacity) {
      setError('Please enter valid capacity (greater than 0) for all time slots');
      return;
    }

    try {
      setLoading(true);

      // Prepare dates data
      const datesData = validDates.map(dateEntry => ({
        date: dateEntry.date,
        timeSlots: dateEntry.timeSlots
          .filter(slot => slot.time.trim() !== '' && slot.capacity)
          .map(slot => ({
            time: slot.time,
            capacity: parseInt(slot.capacity),
            booked: 0
          }))
      }));

      // Update in Firebase
      const sessionRef = doc(db, 'liveSessions', session.id);
      await updateDoc(sessionRef, {
        sessionName: sessionName.trim(),
        dates: datesData
      });

      onSessionUpdated();
    } catch (err) {
      console.error('Error updating live session:', err);
      setError('Failed to update session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Live Session</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="error-message">{error}</div>}

          {/* Session Name */}
          <div className="form-group">
            <label htmlFor="sessionName">Session Name *</label>
            <input
              type="text"
              id="sessionName"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Enter session name"
              className="form-input"
            />
          </div>

          {/* Dates and Time Slots */}
          <div className="form-group">
            <div className="time-slots-header">
              <label>Session Dates & Time Slots *</label>
              <button
                type="button"
                className="btn-secondary-small"
                onClick={handleAddDate}
              >
                + Add Date
              </button>
            </div>

            <div className="dates-list">
              {sessionDates.map((dateEntry, dateIndex) => (
                <div key={dateIndex} className="date-entry">
                  <div className="date-header">
                    <input
                      type="date"
                      value={dateEntry.date}
                      onChange={(e) => handleDateChange(dateIndex, e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="form-input"
                    />
                    {sessionDates.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => handleRemoveDate(dateIndex)}
                      >
                        Remove Date
                      </button>
                    )}
                  </div>

                  <div className="time-slots-section">
                    <div className="time-slots-subheader">
                      <span>Time Slots</span>
                      <button
                        type="button"
                        className="btn-add-slot"
                        onClick={() => handleAddTimeSlot(dateIndex)}
                      >
                        + Add Slot
                      </button>
                    </div>
                    
                    <div className="time-slots-list">
                      {dateEntry.timeSlots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="time-slot-input-row">
                          <input
                            type="time"
                            value={slot.time}
                            onChange={(e) => handleTimeChange(dateIndex, slotIndex, e.target.value)}
                            className="form-input"
                            placeholder="Select time"
                          />
                          <input
                            type="number"
                            value={slot.capacity}
                            onChange={(e) => handleCapacityChange(dateIndex, slotIndex, e.target.value)}
                            className="form-input capacity-input"
                            placeholder="Capacity"
                            min="1"
                          />
                          {dateEntry.timeSlots.length > 1 && (
                            <button
                              type="button"
                              className="btn-remove-slot"
                              onClick={() => handleRemoveTimeSlot(dateIndex, slotIndex)}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
              {loading ? 'Updating...' : 'Update Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLiveSessionModal;
