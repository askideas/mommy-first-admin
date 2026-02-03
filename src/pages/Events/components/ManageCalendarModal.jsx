import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './ManageCalendarModal.css';

const ManageCalendarModal = ({ onClose, onSave }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([{ time: '', capacity: '' }]);
  const [saving, setSaving] = useState(false);

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { time: '', capacity: '' }]);
  };

  const handleRemoveTimeSlot = (index) => {
    const newSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(newSlots);
  };

  const handleTimeSlotChange = (index, field, value) => {
    const newSlots = [...timeSlots];
    newSlots[index][field] = value;
    setTimeSlots(newSlots);
  };

  const handleAddDate = () => {
    if (!currentDate) {
      alert('Please select a date');
      return;
    }

    const validSlots = timeSlots.filter(slot => slot.time && slot.capacity);
    if (validSlots.length === 0) {
      alert('Please add at least one valid time slot with capacity');
      return;
    }

    const dateEntry = {
      date: currentDate,
      timeSlots: validSlots
    };

    setSelectedDates([...selectedDates, dateEntry]);
    setCurrentDate('');
    setTimeSlots([{ time: '', capacity: '' }]);
  };

  const handleRemoveDate = (index) => {
    const newDates = selectedDates.filter((_, i) => i !== index);
    setSelectedDates(newDates);
  };

  const handleSave = async () => {
    if (selectedDates.length === 0) {
      alert('Please add at least one date with time slots');
      return;
    }

    try {
      setSaving(true);
      
      // Save each date configuration to Firebase
      const calendarRef = collection(db, 'eventCalendar');
      
      for (const dateEntry of selectedDates) {
        for (const slot of dateEntry.timeSlots) {
          await addDoc(calendarRef, {
            date: dateEntry.date,
            time: slot.time,
            capacity: parseInt(slot.capacity),
            bookedCount: 0,
            createdAt: serverTimestamp()
          });
        }
      }

      alert('Calendar configuration saved successfully!');
      onSave();
    } catch (error) {
      console.error('Error saving calendar:', error);
      alert('Failed to save calendar configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Manage Calendar</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="date-config-section">
            <h3>Add Available Date</h3>
            
            <div className="form-group">
              <label>Select Date</label>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="time-slots-section">
              <h4>Time Slots & Capacity</h4>
              {timeSlots.map((slot, index) => (
                <div key={index} className="time-slot-row">
                  <input
                    type="time"
                    value={slot.time}
                    onChange={(e) => handleTimeSlotChange(index, 'time', e.target.value)}
                    placeholder="Time"
                  />
                  <input
                    type="number"
                    value={slot.capacity}
                    onChange={(e) => handleTimeSlotChange(index, 'capacity', e.target.value)}
                    placeholder="Capacity"
                    min="1"
                  />
                  {timeSlots.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-slot"
                      onClick={() => handleRemoveTimeSlot(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn-add-slot"
                onClick={handleAddTimeSlot}
              >
                + Add Time Slot
              </button>
            </div>

            <button
              type="button"
              className="btn-add-date"
              onClick={handleAddDate}
            >
              Add Date Configuration
            </button>
          </div>

          {selectedDates.length > 0 && (
            <div className="selected-dates-section">
              <h3>Configured Dates</h3>
              <div className="dates-list">
                {selectedDates.map((dateEntry, index) => (
                  <div key={index} className="date-card">
                    <div className="date-card-header">
                      <strong>{new Date(dateEntry.date).toLocaleDateString()}</strong>
                      <button
                        className="btn-remove-date"
                        onClick={() => handleRemoveDate(index)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="date-card-body">
                      {dateEntry.timeSlots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="slot-info">
                          {slot.time} - Capacity: {slot.capacity}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving || selectedDates.length === 0}
          >
            {saving ? 'Saving...' : 'Save Calendar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageCalendarModal;
