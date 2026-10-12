# User stories — Smart Campus study room booking

### US-01
**Story:** As a Student, I want to view available study rooms and time slots, so that I can select a suitable room for studying.
**Priority:** High
**Assumption:** Availability reflects current reservations and blocked rooms.

### US-02
**Story:** As a Student, I want to book an available study room for a time slot, so that I can reserve space for individual or group study.
**Priority:** High
**Assumption:** A booking starts in the future, lasts at most two hours, does not overlap another booking of that room, and cannot use a blocked room.

### US-03
**Story:** As a Student, I want to receive confirmation when I book a study room, so that I know my reservation succeeded.
**Priority:** Medium
**Assumption:** Confirmation belongs to UC-06 and is limited to successful booking confirmation.

### US-04
**Story:** As a Student, I want to cancel my own room reservation, so that I can release a room I no longer need.
**Priority:** High
**Assumption:** Students may cancel reservations they created.

### US-05
**Story:** As an Administrator, I want to block or unblock a study room, so that unusable rooms cannot be booked and usable rooms return to availability.
**Priority:** High
**Assumption:** Blocking prevents new bookings; unblocking does not override existing reservations.

### US-06
**Story:** As an Administrator, I want to review room usage over a selected period, so that I can understand how rooms are being used.
**Priority:** Medium
**Assumption:** Usage information is based on reservations in the selected period.

### US-07
**Story:** As a Student, I want to receive confirmation after cancelling a reservation, so that I know the cancellation succeeded.
**Priority:** Medium
**Assumption:** Confirmation occurs only after successful cancellation under UC-06.