# Acceptance criteria — three selected stories

## Assumptions
- **Overlap:** A booking ending exactly when another begins is **allowed** under R3; adjacent intervals do not overlap.
- **Duration:** A booking lasting exactly two hours is **allowed** under R2; two hours is the maximum.
- Students can cancel only their own reservations.
- A blocked room cannot accept new bookings.

## US-02 — Book room

### AC-01
- **Given** a room is unblocked and free for a future one-hour slot
- **When** a Student books that slot
- **Then** the booking is created and booking confirmation is sent

### AC-02
- **Given** a requested booking starts in the past
- **When** a Student requests it
- **Then** the booking is rejected under R1

### AC-03
- **Given** a room is free and unblocked for a future slot lasting exactly two hours
- **When** a Student books that slot
- **Then** the booking is accepted under R2

### AC-04
- **Given** a room has a reservation from 10:00 to 11:00 on a future day
- **When** a Student requests the same room from 10:30 to 11:30 on that day
- **Then** the booking is rejected under R3

### AC-05
- **Given** a room is blocked
- **When** a Student requests a booking for that room
- **Then** the booking is rejected under R4

## US-04 — Cancel booking

### AC-06
- **Given** a Student has an existing reservation they created
- **When** that Student cancels the reservation
- **Then** the reservation is cancelled, its slot is released, and cancellation confirmation is sent

### AC-07
- **Given** a reservation belongs to another Student
- **When** a Student tries to cancel that reservation
- **Then** cancellation is rejected and the reservation remains in place

### AC-08
- **Given** the specified reservation does not exist
- **When** a Student attempts to cancel it
- **Then** cancellation is rejected without changing any reservations

## US-05 — Block or unblock room

### AC-09
- **Given** a room is unblocked
- **When** an Administrator blocks the room
- **Then** the room becomes blocked and cannot be booked under R4

### AC-10
- **Given** a room is blocked
- **When** an Administrator unblocks the room
- **Then** the room becomes bookable for slots that are otherwise available

### AC-11
- **Given** an Administrator blocked a room
- **When** a Student requests a new booking for it
- **Then** the booking is rejected and no reservation is created under R4