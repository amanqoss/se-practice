import type { Booking, CheckInput, CheckResult, Room } from "../types";
import { DAY_MINUTES, MAX_BOOKING_MINUTES } from "../types";

function overlaps(a: Booking, start: number, end: number): boolean {
  // Touching endpoints are allowed: [a,b] and [b,c] do NOT overlap.
  return start < a.end && end > a.start;
}

export function checkAvailability(
  rooms: Room[],
  input: CheckInput
): CheckResult {
  const reasons: string[] = [];

  // AC1: 0 <= start < end <= 1440, and start must be after current time.
  if (
    !Number.isFinite(input.start) ||
    !Number.isFinite(input.end) ||
    input.start < 0 ||
    input.end > DAY_MINUTES ||
    input.start >= input.end
  ) {
    reasons.push(
      "Interval must satisfy 0 <= start < end <= 1440 minutes (00:00 to 24:00)."
    );
  } else if (input.start <= input.currentTime) {
    reasons.push("Start time must be later than the supplied current time.");
  }

  // AC2: booking longer than 120 minutes is rejected.
  if (input.end - input.start > MAX_BOOKING_MINUTES) {
    reasons.push("Booking length must not exceed 120 minutes.");
  }

  const room = rooms.find((r) => r.id === input.roomId);

  // AC3: blocked room.
  if (!room) {
    reasons.push("Selected room does not exist.");
  } else if (room.blocked) {
    reasons.push(`${room.name} is currently blocked and cannot be booked.`);
  }

  // AC4: overlap with existing bookings (only if the interval itself is valid so far).
  if (room && !room.blocked) {
    const clashing = room.bookings.filter((b) =>
      overlaps(b, input.start, input.end)
    );
    if (clashing.length > 0) {
      const first = clashing[0];
      reasons.push(
        `Overlaps existing booking ${fmt(first.start)}-${fmt(first.end)} (${first.reservedBy}).`
      );
    }
  }

  return { decision: reasons.length === 0 ? "available" : "unavailable", reasons };
}

function fmt(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function minutesToHHMM(min: number): string {
  return fmt(min);
}

export function hhmmToMinutes(value: string): number | null {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
  if (!match) return null;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}
