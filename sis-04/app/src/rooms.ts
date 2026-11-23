export type Interval = { start: number; end: number };
export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Interval[];
};

export const ROOMS: Room[] = [
  { id: 'a101', name: 'Room A-101', capacity: 18, equipment: ['Projector', 'Whiteboard'],
    blocked: false, bookings: [{start: 600, end: 660}] },
  { id: 'b204', name: 'Room B-204', capacity: 30, equipment: ['Projector', 'Whiteboard'],
    blocked: false, bookings: [] },
  { id: 'c303', name: 'Studio C-303', capacity: 10, equipment: ['Whiteboard'],
    blocked: false, bookings: [{start: 720, end: 780}] },
  { id: 'd404', name: 'Lab D-404', capacity: 36, equipment: ['Projector', 'Video'],
    blocked: true, bookings: [] },
];
