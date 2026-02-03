import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './AddLiveSessionModal.css';

const EditLiveSessionModal = ({ session, onClose, onSessionUpdated }) => {
  const [sessionName, setSessionName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([{ time: '', capacity: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      setSessionName(session.sessionName || '');
      setSelectedDate(session.date || '');
      
      // Handle both old format (string array) and new format (object array)
      const slots = session.timeSlots?.map(slot => {
        if (typeof slot === 'string') {
          return { time: slot, capacity: '' };
        }
        return { time: slot.time || '', capacity: slot.capacity || '' };
      }) || [{ time: '', capacity: '' }];
      
      setTimeSlots(slots);
    }
  }, [session]);

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { time: '', capacity: '' }]);
  };

  const handleRemoveTimeSlot = (index) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((_, i) => i !== index));
    }
  };

  const handleTimeChange = (index, value) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index].time = value;
    setTimeSlots(updatedSlots);
  };

  const handleCapacityChange = (index, value) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index].capacity = value;
    setTimeSlots(updatedSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!sessionName.trim()) {
      setError('Please enter a session name');
      return;
    }

    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    const validTimeSlots = timeSlots.filter(slot => slot.time.trim() !== '' && slot.capacity);
    if (validTimeSlots.length === 0) {
      setError('Please add at least one time slot with capacity');
      return;
    }

    // Validate capacity values
    const hasInvalidCapacity = validTimeSlots.some(slot => {
      const capacity = parseInt(slot.capacity);
      return isNaN(capacity) || capacity <= 0;
    });

    if (hasInvalidCapacity) {
      setError('Please enter valid capacity (greater than 0) for all time slots');
      return;
    }

    try {
      setLoading(true);

      // Update in Firebase
      const sessionRef = doc(db, 'liveSessions', session.id);
      await updateDoc(sessionRef, {
        sessionName: sessionName.trim(),
        date: selectedDate,
        timeSlots: validTimeSlots.map(slot => ({
          time: slot.time,
          capacity: parseInt(slot.capacity),
          booked: 0
        }))
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

          {/* Date Selection */}
          <div className="form-group">
            <label htmlFor="sessionDate">Date *</label>
            <input
              type="date"
              id="sessionDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="form-input"
            />
          </div>

          {/* Time Slots */}
          <div className="form-group">
            <div className="time-slots-header">
              <label>Time Slots *</label>
              <button
                type="button"
                className="btn-secondary-small"
                onClick={handleAddTimeSlot}
              >
                + Add Time Slot
              </button>
            </div>

            <div className="time-slots-list">
              {timeSlots.map((slot, index) => (
                <div key={index} className="time-slot-input-row">
                  <input
                    type="time"
                    value={slot.time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className="form-input"
                    placeholder="Select time"
                  />
                  <input
                    type="number"
                    value={slot.capacity}
                    onChange={(e) => handleCapacityChange(index, e.target.value)}
                    className="form-input capacity-input"
                    placeholder="Capacity"
                    min="1"
                  />
                  {timeSlots.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => handleRemoveTimeSlot(index)}
                    >
                      Remove
                    </button>
                  )}
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
