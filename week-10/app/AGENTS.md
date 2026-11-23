# AGENTS.md — Smart Campus Room Availability Checker

Instructions for any coding agent working in this project. Read this file before you change
anything, and follow it over any general habit of yours.

## Project

A React + TypeScript page (Vite) that tells a student whether a campus room is free for a
requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
the tests are in `src/booking.test.ts`.

Use one fictional room with synthetic bookings. Do not use real timetable data.

## Acceptance contract

- AC1 Reject start ≥ end and requests in the past.
- AC2 Enforce the maximum allowed duration (120 minutes).
- AC3 Reject a blocked room.
- AC4 Reject overlaps; allow bookings that only touch at an endpoint.
- AC5 Return Available / Unavailable without changing booking data.
- AC6 Preserve clear feedback on desktop and mobile.

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npm test`
- Build: `npm run build`

## You may

- Edit only files required by the approved task.
- Add packages when a task needs them.
- Do not add a login or database. Never use or share secrets.

## Before you finish

- Check the page and run npm test; all tests must pass before proposing acceptance.
- Do not deploy externally or publish previews.
