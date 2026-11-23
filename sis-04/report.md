# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | ChatGPT |
| Assistant model | GPT-6.2 |
| Starting point | week-08 |
| Baseline commit | 77bd61c |
| Language (ts or js) | ts |
| Vitest version | 3.2.4 |
| Where I ran the tests | Node and npm, inside sis-04/app |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

 RUN  v3.2.4 /workspace/scratch/266377f4e4f8/sis04-repo/sis-04/app

 ✓ src/booking.test.ts (22 tests) 5ms

 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  09:24:24
   Duration  355ms (transform 65ms, setup 0ms, collect 56ms, tests 5ms, environment 0ms, prepare 87ms)
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
src/App.tsx — catalog, time form and check() handler
src/booking.ts — shared canBook decision and request types
src/booking.test.ts — fixed regression examples
src/main.tsx — mounts the React application
src/index.css — desktop and narrow form layout
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
Week 08 Map: 
src/App.tsx contains the two-room catalog, the time form, a global blocked checkbox, and check();
src/booking.ts exports canBook;
src/booking.test.ts tests it;
src/main.tsx renders App;
src/index.css styles it.
AC1 orders future times, AC2 no more than 120 minutes, AC3 denies blocked, AC4 denies overlapping but allows touch, AC5 makes a decision without mutation, AC6 provides feedback. F1 capacity >= number of attendees, F2 requires ALL equipment, F3 blocked never available, F4 explicit empty state, F5 refresh from selected room's bookings.
Fictional data, fixed now, no login, payments, live APIs or database. 
Examine sis04-repo/sis-04/app.
List identified risks, and provide a small numbered plan, with an option regarding the blocked rooms. Do not provide any code and make no changes.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | Blocked status can refer to the wrong room | src/App.tsx, check() | The handler passes the checkbox state even though each catalog entry has its own blocked field. | High |
| 2 | A previous room’s decision survives a selection change | src/App.tsx | The selector updates roomId. Only the button handler calls setResult. | High |
| 3 | Filtering could leave an undefined room | src/App.tsx | The non-null assertion after find has no empty-selection path before reading room.bookings. | High |
| 4 | Two places decide whether the end follows the start | src/App.tsx and src/booking.ts | The handler tests s < e, then canBook checks start < end again. | Medium |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Keep the 22 test baseline intact. Assign boundary IDs and write failing catalog tests using fixed fixtures.
2. Create the catalog, add capacity and equipment filtering capabilities, and then conduct all tests.
3. Request resolution based on room ID and leave the decision and timing up to canBook.
4. Get the active selection and decision from the same visible list. Check for empty, blocked, switched room, and phone cases.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Hide blocked rooms to reduce unusable choices. | Rejected | Keeping matched rooms visible with a blocked label lets students distinguish a capacity mismatch from a room that meets F1 and F2 but fails F3. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

The catalog includes four fictional rooms, each with 10–36 seats. Type in the attendee count and tick the equipment you need, and the room selector narrows right away. A room has to meet two conditions: enough seats and every checked item. Straightforward enough. Blocked rooms show a label, so they don’t quietly vanish. In practice, the room that stays visible drives both the bookings list and the availability result, which is why the selection matters so much. If nothing matches, the form clears the previous decision and tells you how to widen the search.

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | 18 attendees, Projector and Whiteboard. Two rooms qualify. A-101 is selected and meets the capacity exactly. |
| `evidence/filter-empty.png` | 99 attendees exceed the largest capacity. No room selector or stale result remains. |
| `evidence/switch-a.png` | A-101 at 10:00–11:00. Its existing booking occupies the whole requested interval, so the page shows Unavailable. |
| `evidence/switch-b.png` | B-204 at the same 10:00–11:00. Its schedule is empty and the page now shows Available. |
| `evidence/narrow.png` | B-204 stays Available with the same criteria at a 375-pixel viewport. Controls stack vertically and the document width measures 375 pixels. |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Room and interval types, fictional schedules and catalog metadata. |
| `src/booking.ts` | Pure time decision and lookup by room ID. |
| `src/filter.ts` | Capacity threshold and all-equipment requirement. |
| `src/App.tsx` | Form state, clock conversion, selection and accessible results. |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Show blocked matches with a label | Exclude them from the list | F1 and F2 describe suitability. F3 independently explains why a suitable room cannot be used. |
| Derive the current decision during rendering | Store a Boolean and clear it in each handler | F5 depends on the current selection. Calculating it from that selection removes the stale result observed in the baseline code. |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| App.check and canBook both evaluated whether start precedes end. | Only canBook compares the endpoints. The UI handles missing fields and displays the shared decision. |
| booking.ts repeated the BookingRequest fields inline in the canBook signature. | canBook takes the named BookingRequest type. |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| --- | --- | --- |
| AC1 | T02 AC1: 540 equals now, but the start must be strictly later. | start = now → false |
| AC2 | T06 B1 AC2: 840 minus 720 is exactly 120; only longer durations are rejected. | 120 min → true |
| AC3 | T13 AC3: An otherwise valid request is rejected because the room is blocked. | blocked → false |
| AC4 | T01 B3 AC4: 660 is the existing end; sharing that endpoint uses no booked minute. | 660 touches existing end → true |
| AC5 | AC5: an Available request preserves booking data | successful check → same data |
| F1 | F1 B5 includes rooms at exact capacity | 12 seats for 12 → included |
| F2 | F2 requires every equipment item | two items required → only A and B |
| F3 | F3 blocked room rejects a free slot | blocked D → false |
| F4 | F4 oversized request produces an empty list | 17 attendees → empty |
| F5 | F5 same time gives each selected room its own result | A busy and B free → false then true |
| B1 | T06 B1 AC2: 840 minus 720 is exactly 120; only longer durations are rejected. | 720–840 → true |
| B2 | T07 B2 AC2: 841 minus 720 is 121, one minute above the duration limit. | 720–841 → false |
| B3 | T01 B3 AC4: 660 is the existing end; sharing that endpoint uses no booked minute. | 660–720 → true |
| B4 | T09 B4 AC4: Minutes from 630 until 660 belong to both intervals. | 630–690 → false |
| B5 | F1 B5 includes rooms at exact capacity | capacity 12 → included |
| B6 | F1 B6 excludes a room one seat short | capacity 11 → excluded |
| INT | INT checks the room returned by both filters | two eligible rooms → [false,true] |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
cd sis-04/app
npm ci --no-audit --no-fund
npx vitest run
npm run build
npx vitest run
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

 RUN  v3.2.4 /workspace/scratch/266377f4e4f8/sis04-repo/sis-04/app

 ✓ src/booking.test.ts (22 tests) 5ms
 ✓ src/catalog.test.ts (8 tests) 4ms

 Test Files  2 passed (2)
      Tests  30 passed (30)
   Start at  09:27:09
   Duration  264ms (transform 59ms, setup 0ms, collect 73ms, tests 9ms, environment 0ms, prepare 120ms)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 22/22 | 30/30 | Compared the two terminal summaries in §§1.1 and 6.3. |
| Duplicated logic locations removed | 2 redundant locations | 0 of the 2 remain | Inspected the two source changes listed in §5.3 against the baseline commit. |
| Code structure: modules and their responsibilities | App, booking, main, stylesheet and one test file | Added rooms, filter and catalog.test. App handles presentation. | Compared git ls-files for app/src with the baseline tree. Followed imports for the component diagrams. |
| Remaining limitation | Two rooms and no capacity or equipment fields. | The four schedules are fixed examples for a single fictional day. | Inspected both catalog definitions and checked the displayed schedule while switching rooms. |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** ChatGPT 6
**Date:** 23.11.2026
**Purpose:** Codebase analysis

**Prompt:**

```text
Our Week 08 map is small, but each file has a clear job. `src/App.tsx` handles the two-room catalog, the time form, the global blocked checkbox, and `check()`; `src/booking.ts` exports `canBook`; `src/booking.test.ts` tests it; `src/main.tsx` mounts `App`; and `src/index.css` styles everything.
AC1 covers ordered future times. AC2 caps bookings at 120 minutes. AC3 rejects blocked rooms. AC4 rejects overlaps, but still allows touching. AC5 shows a decision without mutation, and AC6 handles responsive feedback.
The feature set breaks into F1 through F5. F1 means capacity must be greater than or equal to attendees. F2 requires ALL equipment. F3 says blocked is never available. F4 requires an explicit empty state, and F5 refreshes from the selected room’s bookings.

The data is fictional. The time is fixed to now. No login, payments, live APIs, or database are involved.

Take a look at `sis04-repo/sis-04/app`. Identify the likely risks and propose a small numbered plan, with a choice about blocked rooms. No code, no edits. Return your answer in your final reply.
```

**Output used:**

```text
Filtering also makes the asserted lookup `ROOMS.find(...)!` unsafe when zero rooms match. Finally, `App.check()` and `canBook()` both compare start and end, so future changes to AC1 would require reviewing two locations.
```

**Problems found:** Hiding blocked rooms obscures why a matching room is unavailable.
**Changes made:** Kept blocked rooms selectable and made the empty result explicit.
**Verified by:** Baseline App.check and selected-room lookup, F3/F4 tests and filter-empty.png.

### 8.2 Exchange 2

**Tool and model:** ChatGPT 6
**Date:** 23.11.2026
**Purpose:** Test design

**Prompt:**

```text
Suggest a concise executable test plan for F1-F5, B5/B6, and INT using fixed test rooms which vary in size, equipment, and bookings. Also suggest a method by which a filter may inadvertently accept ANY equipment. Do not modify files.
```

**Output used:**

```text
Request both items with one attendee. Assert that the returned IDs are exactly A and B. An ANY implementation incorrectly includes C and D.
```

**Problems found:** A test catalog where every room contains both items would also pass a faulty ANY implementation.
**Changes made:** Used rooms missing different items and a separate blocked room in catalog.test.ts.
**Verified by:** F2 returns only A and B. INT runs checkRoom on each actual match.

### 8.3 Exchange 3

**Tool and model:** ChatGPT 6
**Date:** 23.11.2026
**Purpose:** UI implementation

**Prompt:**

```text
Implement the responsive room catalog page in app/src/App.tsx and app/src/index.css only, under sis04-repo/sis-04. Import ROOMS, filterRooms and checkRoom from sibling rooms, filter and booking modules. Use a fixed 09:00, preserve 24:00, show matching rooms, capacity, selectable equipment, blocked labels and existing bookings, and derive a fresh result whenever the room, times or filters change. Make controls and decisions usable at 375 px. Preserve helpful validation feedback, with no duplicated booking rules. Do not commit. Tell me the control labels and how to verify the change.
```

**Output used:**

```text
The page derives matching rooms from `filterRooms` and evaluates the selected room with `checkRoom` whenever a filter, time or selection changes. Blocked rooms stay visible with a label. An empty match list displays a recovery message and clears the room decision.
```

**Problems found:** An empty selection cannot supply room data for a booking check.
**Changes made:** Used the current visible room for both the schedule and decision and hid the decision in the empty state.
**Verified by:** Chromium verified opposite decisions at identical times and no selector after a 99-person filter.

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

I showed the assistant my room availability checker, stating that it used pretend information. Previously, there was only one study room. I would like students to be able to filter multiple rooms based on having certain support (projectors, whiteboards, etc.) or a certain amount of seats. Additionally, I also want to state that when students check availability, that it should not automatically book that room.

The assistant recommended making rooms hidden if they were currently under maintenance. This initially seemed good, but I also thought about how if a person wants to use the only room available for a group of ten, making it hidden would make them feel like there are no study rooms that can accommodate a group that size. I chose to leave the room visible but marked as unavailable if under maintenance.

The best test I was able to perform was switching between two different rooms using the same study room duration. In both cases, one had an open availability while the other had three booked times back-to-back. After switching between the two, the named of the room changed but the next available time remained the same. Initially, I tested each availability separately and failed to test what would occur when switching.

The next test I would perform would be to click both rooms, checking the next available time after each. Based on this test, I would calculate the next available time based on the currently selected room. Additionally, I would also try viewing just using the keyboard, as 
