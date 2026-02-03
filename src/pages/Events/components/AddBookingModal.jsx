import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { RefreshCw } from 'lucide-react';
import './AddBookingModal.css';

const AddBookingModal = ({ onClose, onBookingAdded }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      setError('');
      const calendarRef = collection(db, 'eventCalendar');
      const today = new Date().toISOString().split('T')[0];
      
      const q = query(calendarRef, where('date', '>=', today));
      const querySnapshot = await getDocs(q);
      
      const slots = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        availableSpots: doc.data().capacity - (doc.data().bookedCount || 0)
      }));

      // Filter out slots that are full
      const availableSlots = slots.filter(slot => slot.availableSpots > 0);
      
      // Sort by date and time
      availableSlots.sort((a, b) => {
        if (a.date === b.date) {
          return a.time.localeCompare(b.time);
        }
        return a.date.localeCompare(b.date);
      });

      setAvailableSlots(availableSlots);
      
      if (availableSlots.length === 0) {
        setError('No available slots found. Please create slots using "Manage Calendar" first.');
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setError('Failed to load available slots');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSlotSelect = (slot) => {
    if (slot.availableSpots > 0) {
      setSelectedSlot(slot);
      setError('');
    } else {
      setError('This slot is out of capacity');
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      setError('Valid 10-digit mobile number is required');
      return false;
    }
    if (!selectedSlot) {
      setError('Please select a date and time');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Double-check capacity before booking
    if (selectedSlot.availableSpots <= 0) {
      setError('Sorry, this slot is now out of capacity');
      fetchAvailableSlots(); // Refresh slots
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // Add the booking
      const bookingData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        eventDate: selectedSlot.date,
        eventTime: selectedSlot.time,
        slotId: selectedSlot.id,
        status: 'confirmed',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'eventBookings'), bookingData);

      // Update the booked count in the calendar
      const slotRef = doc(db, 'eventCalendar', selectedSlot.id);
      await updateDoc(slotRef, {
        bookedCount: (selectedSlot.bookedCount || 0) + 1
      });

      alert('Booking added successfully!');
      onBookingAdded();
    } catch (error) {
      console.error('Error adding booking:', error);
      setError('Failed to add booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const groupSlotsByDate = () => {
    const grouped = {};
    availableSlots.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    return grouped;
  };

  const groupedSlots = groupSlotsByDate();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Booking</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="form-section">
              <h3>Customer Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="slots-header">
                <h3>Select Date & Time</h3>
                <button
                  type="button"
                  className="btn-refresh-slots"
                  onClick={fetchAvailableSlots}
                  disabled={loading}
                  title="Refresh available slots"
                >
                  <RefreshCw size={16} className={loading ? 'spinning' : ''} />
                </button>
              </div>
              
              {loading ? (
                <div className="loading-slots">Loading available slots...</div>
              ) : availableSlots.length === 0 ? (
                <div className="no-slots">
                  <p>No available slots at the moment.</p>
                  <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    Use "Manage Calendar" to create available time slots first.
                  </p>
                </div>
              ) : (
                <div className="slots-container">
                  {Object.entries(groupedSlots).map(([date, slots]) => (
                    <div key={date} className="date-group">
                      <div className="date-header">
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="time-slots-grid">
                        {slots.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            className={`slot-btn ${selectedSlot?.id === slot.id ? 'selected' : ''} ${slot.availableSpots === 0 ? 'full' : ''}`}
                            onClick={() => handleSlotSelect(slot)}
                            disabled={slot.availableSpots === 0}
                          >
                            <div className="slot-time">{slot.time}</div>
                            <div className="slot-capacity">
                              {slot.availableSpots === 0 ? (
                                <span className="out-of-capacity">Out of Capacity</span>
                              ) : (
                                <span>{slot.availableSpots} spots left</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !selectedSlot}
            >
              {submitting ? 'Adding Booking...' : 'Add Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookingModal;
