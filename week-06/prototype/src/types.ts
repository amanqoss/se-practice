export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
  bookings: Booking[];
}

export interface Booking {
  start: number; // minutes since midnight, 0..1440
  end: number;   // minutes since midnight, 0..1440
  reservedBy: string;
}

export interface CheckInput {
  roomId: string;
  start: number;
  end: number;
  currentTime: number; // minutes since midnight
}

export type Decision = "available" | "unavailable";

export interface CheckResult {
  decision: Decision;
  reasons: string[];
}

export const DAY_MINUTES = 1440;
export const MAX_BOOKING_MINUTES = 120;
