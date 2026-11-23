import { expect, test } from 'vitest';
import type { Room } from './rooms';
import { filterRooms } from './filter';
import { checkRoom } from './booking';

const catalog: Room[] = [
  { id: 'a', name: 'A', capacity: 12, equipment: ['projector','whiteboard'], blocked: false, bookings: [{start:600,end:660}] },
  { id: 'b', name: 'B', capacity: 12, equipment: ['projector','whiteboard'], blocked: false, bookings: [] },
  { id: 'c', name: 'C', capacity: 11, equipment: ['projector'], blocked: false, bookings: [] },
  { id: 'd', name: 'D', capacity: 16, equipment: ['whiteboard'], blocked: true, bookings: [] },
];
const request = {start:615, end:645, now:540};
const criteria = {attendees:12, equipment:[]};

test('F1 B5 includes rooms at exact capacity', () => {
  expect(filterRooms(catalog, criteria)).toContain(catalog[0]);
});
test('F1 B6 excludes a room one seat short', () => {
  expect(filterRooms(catalog, criteria)).not.toContain(catalog[2]);
});
test('F2 requires every equipment item', () => {
  expect(filterRooms(catalog, {attendees:1, equipment:['projector','whiteboard']})).toEqual([catalog[0], catalog[1]]);
});
test('F3 blocked room rejects a free slot', () => {
  expect(checkRoom(catalog, 'd', request)).toBe(false);
});
test('F4 oversized request produces an empty list', () => {
  expect(filterRooms(catalog, {attendees:17, equipment:[]})).toEqual([]);
});
test('F5 same time gives each selected room its own result', () => {
  expect(checkRoom(catalog, 'a', request)).toBe(false);
  expect(checkRoom(catalog, 'b', request)).toBe(true);
});
test('INT checks the room returned by both filters', () => {
  const rooms = filterRooms(catalog, {attendees:12, equipment:['projector','whiteboard']});
  expect(rooms.map(room => checkRoom(catalog, room.id, request))).toEqual([false,true]);
});
test('F5 unknown id is unavailable', () => {
  expect(checkRoom(catalog, 'missing', request)).toBe(false);
});
