# Events Page Usage Guide

## How to Use the Events Management System

### Step 1: Create Available Time Slots
1. Click **"Manage Calendar"** button on the Events page
2. Select a date from the date picker
3. Add time slots:
   - Enter time (e.g., 10:00 AM)
   - Enter capacity (number of people allowed)
   - Click "+ Add Time Slot" for more slots on the same date
4. Click **"Add Date Configuration"** to save this date
5. Repeat for multiple dates if needed
6. Click **"Save Calendar"** to store all configurations to Firebase

**Example:**
```
Date: February 1, 2026
Time Slots:
  - 10:00 AM - Capacity: 20
  - 2:00 PM - Capacity: 15
  - 5:00 PM - Capacity: 10
```

### Step 2: Add Bookings
1. Click **"Add Booking"** button on the Events page
2. Fill in customer information:
   - First Name
   - Last Name
   - Email
   - Mobile Number
3. The modal will automatically load available dates and time slots
4. Select a date and time slot:
   - Slots show remaining capacity
   - Full slots show "Out of Capacity" and cannot be selected
5. Click **"Add Booking"** to confirm

### Step 3: View Bookings
- All bookings are displayed in the table on the main Events page
- Shows: Name, Email, Mobile, Date, Time, and Status

## Important Notes

⚠️ **You must create calendar slots first** using "Manage Calendar" before you can add bookings.

✅ **Capacity Management**: The system automatically:
- Tracks how many bookings per slot
- Prevents overbooking
- Shows remaining capacity
- Hides full slots

🔄 **Refresh**: Click the refresh icon in the booking modal to reload available slots if you just added new dates.

## Firebase Collections

### `eventCalendar`
Stores available dates and time slots:
```javascript
{
  date: "2026-02-01",
  time: "10:00",
  capacity: 20,
  bookedCount: 5,
  createdAt: timestamp
}
```

### `eventBookings`
Stores customer bookings:
```javascript
{
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  mobile: "1234567890",
  eventDate: "2026-02-01",
  eventTime: "10:00",
  slotId: "slot-id",
  status: "confirmed",
  createdAt: timestamp
}
```
