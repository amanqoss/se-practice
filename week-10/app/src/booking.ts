import { validRequestWindow } from './requestWindow';

export type Interval = { start: number; end: number };
export type BookingRequest = {
  start: number; end: number; now: number; blocked: boolean; bookings: Interval[];
};

export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
  if (!validRequestWindow(start, end, now)) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  return true;
}
