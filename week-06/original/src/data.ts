import type { Room } from "./types";

// Fictional sample data only. Bookings use minutes since midnight.
// Touching endpoints are allowed, so [540,600] and [600,660] do not overlap.
export const SAMPLE_ROOMS: Room[] = [
  {
    id: "room-101",
    name: "Room 101",
    building: "Engineering Block",
    capacity: 30,
    blocked: false,
    bookings: [
      { start: 540, end: 600, reservedBy: "Intro to Circuits" },
      { start: 720, end: 780, reservedBy: "Faculty Meeting" },
      { start: 900, end: 960, reservedBy: "Robotics Lab Prep" },
    ],
  },
  {
    id: "room-204",
    name: "Room 204",
    building: "Engineering Block",
    capacity: 18,
    blocked: false,
    bookings: [
      { start: 600, end: 660, reservedBy: "Algorithms Tutorial" },
      { start: 840, end: 900, reservedBy: "Study Group" },
    ],
  },
  {
    id: "lab-a",
    name: "Lab A",
    building: "Science Wing",
    capacity: 24,
    blocked: true,
    bookings: [],
  },
  {
    id: "hall-main",
    name: "Main Hall",
    building: "Central",
    capacity: 120,
    blocked: false,
    bookings: [
      { start: 480, end: 540, reservedBy: "Morning Assembly" },
      { start: 1020, end: 1080, reservedBy: "Guest Lecture" },
    ],
  },
];
