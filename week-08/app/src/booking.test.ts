import { expect, test } from 'vitest';
import { canBook } from './booking';

const fixture = () => ({
  now: 540, blocked: false, bookings: [{ start: 600, end: 660 }],
});

test('T01 AC4: 660 is the existing end; sharing that endpoint uses no booked minute.', () => {
  expect(canBook({ ...fixture(), start: 660, end: 720 })).toBe(true);
});

test('T02 AC1: 540 equals now, but the start must be strictly later.', () => {
  expect(canBook({ ...fixture(), start: 540, end: 570 })).toBe(false);
});

test('T03 AC1: Equal endpoints give zero duration rather than start before end.', () => {
  expect(canBook({ ...fixture(), start: 720, end: 720 })).toBe(false);
});

test('T04 AC1: 750 is later than 720, so the interval is reversed.', () => {
  expect(canBook({ ...fixture(), start: 750, end: 720 })).toBe(false);
});

test('T05 AC1: 1441 is one minute beyond the allowed end of the day.', () => {
  expect(canBook({ ...fixture(), start: 1380, end: 1441 })).toBe(false);
});

test('T06 AC2: 840 minus 720 is exactly 120; only longer durations are rejected.', () => {
  expect(canBook({ ...fixture(), start: 720, end: 840 })).toBe(true);
});

test('T07 AC2: 841 minus 720 is 121, one minute above the duration limit.', () => {
  expect(canBook({ ...fixture(), start: 720, end: 841 })).toBe(false);
});

test('T08 AC4: The request ends exactly when the existing booking starts, without overlapping.', () => {
  expect(canBook({ ...fixture(), start: 570, end: 600 })).toBe(true);
});

test('T09 AC4: Minutes from 630 until 660 belong to both intervals.', () => {
  expect(canBook({ ...fixture(), start: 630, end: 690 })).toBe(false);
});

test('T10 AC4: The request contains the whole existing interval from 600 to 660.', () => {
  expect(canBook({ ...fixture(), start: 570, end: 690 })).toBe(false);
});

test('T11 AC4: Every requested minute lies inside the existing booking.', () => {
  expect(canBook({ ...fixture(), start: 615, end: 645 })).toBe(false);
});

test('T12 AC4: Identical intervals share every minute, so the room is occupied.', () => {
  expect(canBook({ ...fixture(), start: 600, end: 660 })).toBe(false);
});

test('T13 AC3: An otherwise valid request is rejected because the room is blocked.', () => {
  expect(canBook({ ...fixture(), start: 660, end: 720, blocked: true })).toBe(false);
});

test('T14 AC4: An empty booking array has no interval that can overlap the request.', () => {
  expect(canBook({ ...fixture(), start: 630, end: 690, bookings: [] })).toBe(true);
});

test('X1 AC1: 1440 is included in the allowed end boundary; this request lasts 60 minutes.', () => {
  expect(canBook({ ...fixture(), start: 1380, end: 1440 })).toBe(true);
});

test('X2 AC4: With bookings 600-660 and 720-780, the request fits exactly between both endpoints.', () => {
  expect(canBook({ ...fixture(), start: 660, end: 720, bookings: [{ start: 600, end: 660 }, { start: 720, end: 780 }] })).toBe(true);
});

test('AC5: an Available request preserves booking data', () => {
  const data = fixture();
  const before = structuredClone(data.bookings);
  expect(canBook({ ...data, start: 660, end: 720 })).toBe(true);
  expect(data.bookings).toEqual(before);
});

// Additional coverage accepted after reviewing the first suite.
test('X3 AC1: reject a start below zero independently of now', () => {
  expect(canBook({ start: -1, end: 30, now: -2, blocked: false, bookings: [] })).toBe(false);
});

test('X4 AC4: reject overlap with the second existing booking', () => {
  expect(canBook({ ...fixture(), start: 750, end: 800,
    bookings: [{ start: 600, end: 660 }, { start: 780, end: 840 }] })).toBe(false);
});

test('X5 characterization: reversed existing booking is not rejected', () => {
  expect(canBook({ ...fixture(), start: 660, end: 720,
    bookings: [{ start: 700, end: 650 }] })).toBe(true);
});

// These regressions are committed while both provided defects are still present.
test('BUG-A AC4: a 90-minute request fits between two touching bookings', () => {
  expect(canBook({ start: 660, end: 750, now: 540, blocked: false,
    bookings: [{ start: 600, end: 660 }, { start: 750, end: 810 }] })).toBe(true);
});

test('BUG-B AC5: a non-touching Available request leaves bookings unchanged', () => {
  const bookings = [{ start: 600, end: 660 }];
  const before = structuredClone(bookings);
  expect(canBook({ start: 720, end: 780, now: 540, blocked: false, bookings })).toBe(true);
  expect(bookings).toEqual(before);
});
