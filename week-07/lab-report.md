# Week 07 — Lab report

**Name:** Yernur
**Group:** Monday 16:00 - 19:00
**Date:** 16.11.2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | starter — Week 06 source was not supplied |
| Bolt project link (or `not shared`, and why) | not shared — supplied local starter; no Bolt project |
| Assistant that generated the tests (tool) | ChatGPT  |
| Exact model (with its version, or `not displayed`) | GPT-6 (exact deployed version not displayed) |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | Codex managed Linux workspace; Node 24.22.1 |
| Vitest version (the `RUN  v…` line of a run) | 3.2.4 |
| Test command | cd week-07/app && npx vitest run |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | app/src/App.tsx, check() inside the page component |
| Its inputs | start/end/current-time text converted to s/e/n; blocked and room.bookings |
| What it returned | A local boolean ok; check() itself returned no availability value |
| How the page used it | setResult(ok) rendered Available or Unavailable |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

<!-- Write below this line -->
The decision moved from check() in app/src/App.tsx into the exported canBook function in app/src/booking.ts. The same bounds, strict comparison with now, duration limit, blocked check, and overlap loop remain in the same order. Only variable names and the argument interface changed. App.tsx imports and calls that function, while conversion and validation messages stay in the page. The baseline was committed before extraction. The successful unit runs and production build establish the tested behavior; visual equivalence has not been verified because browser access was blocked. No UI behavior was intentionally changed.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660-720 | true | AC4 | 660 is the existing end; sharing that endpoint uses no booked minute. |
| T02 | 540-570 | false | AC1 | 540 equals now, but the start must be strictly later. |
| T03 | 720-720 | false | AC1 | Equal endpoints give zero duration rather than start before end. |
| T04 | 750-720 | false | AC1 | 750 is later than 720, so the interval is reversed. |
| T05 | 1380-1441 | false | AC1 | 1441 is one minute beyond the allowed end of the day. |
| T06 | 720-840 | true | AC2 | 840 minus 720 is exactly 120; only longer durations are rejected. |
| T07 | 720-841 | false | AC2 | 841 minus 720 is 121, one minute above the duration limit. |
| T08 | 570-600 | true | AC4 | The request ends exactly when the existing booking starts, without overlapping. |
| T09 | 630-690 | false | AC4 | Minutes from 630 until 660 belong to both intervals. |
| T10 | 570-690 | false | AC4 | The request contains the whole existing interval from 600 to 660. |
| T11 | 615-645 | false | AC4 | Every requested minute lies inside the existing booking. |
| T12 | 600-660 | false | AC4 | Identical intervals share every minute, so the room is occupied. |
| T13 | 660-720, blocked = true | false | AC3 | An otherwise valid request is rejected because the room is blocked. |
| T14 | 630-690, bookings = [] | true | AC4 | An empty booking array has no interval that can overlap the request. |
| X1 | 1380-1440 | true | AC1 | 1440 is included in the allowed end boundary; this request lasts 60 minutes. |
| X2 | 660-720, bookings = [{start:600,end:660},{start:720,end:780}] | true | AC4 | With bookings 600-660 and 720-780, the request fits exactly between both endpoints. |
| AC5 | 660-720; compare a deep copy before and after | true, data unchanged | AC5 | Availability is a query; accepting the request must not add, remove, or alter stored bookings. |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prescribed prompt applied during this assistant session.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660-720 | true | AC4 | 660 is the existing end; sharing that endpoint uses no booked minute. |
| T02 | 540-570 | false | AC1 | 540 equals now, but the start must be strictly later. |
| T03 | 720-720 | false | AC1 | Equal endpoints give zero duration rather than start before end. |
| T04 | 750-720 | false | AC1 | 750 is later than 720, so the interval is reversed. |
| T05 | 1380-1441 | false | AC1 | 1441 is one minute beyond the allowed end of the day. |
| T06 | 720-840 | true | AC2 | 840 minus 720 is exactly 120; only longer durations are rejected. |
| T07 | 720-841 | false | AC2 | 841 minus 720 is 121, one minute above the duration limit. |
| T08 | 570-600 | true | AC4 | The request ends exactly when the existing booking starts, without overlapping. |
| T09 | 630-690 | false | AC4 | Minutes from 630 until 660 belong to both intervals. |
| T10 | 570-690 | false | AC4 | The request contains the whole existing interval from 600 to 660. |
| T11 | 615-645 | false | AC4 | Every requested minute lies inside the existing booking. |
| T12 | 600-660 | false | AC4 | Identical intervals share every minute, so the room is occupied. |
| T13 | 660-720, blocked = true | false | AC3 | An otherwise valid request is rejected because the room is blocked. |
| T14 | 630-690, bookings = [] | true | AC4 | An empty booking array has no interval that can overlap the request. |
| X1 | 1380-1440 | true | AC1 | 1440 is included in the allowed end boundary; this request lasts 60 minutes. |
| X2 | 660-720, bookings = [{start:600,end:660},{start:720,end:780}] | true | AC4 | With bookings 600-660 and 720-780, the request fits exactly between both endpoints. |
| AC5 | 660-720; compare a deep copy before and after | true, data unchanged | AC5 | Availability is a query; accepting the request must not add, remove, or alter stored bookings. |

export type Interval = { start: number; end: number };
export type BookingRequest = {
  start: number; end: number; now: number; blocked: boolean; bookings: Interval[];
};

export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
  let ok = true;
  if (!(0 <= start && start < end && end <= 1440)) ok = false;
  else if (!(start > now)) ok = false;
  else if (end - start > 120) ok = false;
  else if (blocked) ok = false;
  else {
    for (const b of bookings) {
      if (start < b.end && end > b.start) {
        ok = false;
        break;
      }
    }
  }
  return ok;
}
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
Run command: cd week-07/app && npx vitest run
AC1: T02-T05, X1. AC2: T06-T07. AC3: T13. AC4: T01, T08-T12, T14, X2. AC5: preservation on an Available request.
AC6: requires browser checks; unit tests cannot establish readable feedback or mobile usability.
Unclear requirement: malformed existing bookings have no specified policy. The suite does not impose one.
The archive file uses ./booking because its executable copy belongs beside app/src/booking.ts.
```

The first suite was saved to `suites/first/` **before** the working copy changed: yes

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | T01-T14, X1, X2 | No wrong expectations found; real import, exact assertions, fresh fixtures | accept | AC1-AC4: expectations checked against arithmetic and overlap rules before execution |
| 2 | AC5 | No preservation weakness found on the accepted path; deep copy precedes the call | accept | AC5: changing nested booking data would differ from the snapshot |
| 3 | Lower-bound coverage | No input below zero; deleting the lower-bound condition could escape | revise | AC1: add X3 with start=-1 and now=-2 to isolate the day bound |
| 4 | Multiple-booking coverage | X2 only touches both entries; checking only the first entry could escape | revise | AC4: add X4 overlapping the second entry only |
| 5 | Unspecified existing data | No observation of a reversed existing booking | revise | Add X5 as characterization for section 9.3, not as an AC requirement |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

 RUN  v3.2.4 /workspace/scratch/266377f4e4f8/se-practice/week-07/app

 ✓ src/booking.test.ts (17 tests) 5ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  23:44:55
   Duration  477ms (transform 54ms, setup 0ms, collect 45ms, tests 5ms, environment 0ms, prepare 101ms)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none | All 17 tests passed | Compared expectations with the plan, imports and fixtures | Neither test repair nor implementation fix | Add coverage without changing correct expectations |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

 RUN  v3.2.4 /workspace/scratch/266377f4e4f8/se-practice/week-07/app

 ✓ src/booking.test.ts (17 tests) 5ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  23:44:55
   Duration  477ms (transform 54ms, setup 0ms, collect 45ms, tests 5ms, environment 0ms, prepare 101ms)

Assistant response (verbatim):
The first run has 17 passed and no failures. No test repairs or implementation fixes are required by that output.
Retain T01-T14, X1, X2 and AC5 unchanged: their expectations match the plan, their assertions are exact, and fixtures are fresh.
Add X3 (AC1): start=-1, end=30, now=-2, bookings=[]. Expect false. It detects a missing lower-bound check without being masked by the start-after-now rule.
Add X4 (AC4): request 750-800 with bookings 600-660 and 780-840. Expect false. It detects an implementation that only checks the first booking.
Add X5: characterize request 660-720 with existing booking 700-650. The current predicate returns true. This is an explicitly observed policy, not an expected value derived from AC1-AC6.
AC6 still needs browser inspection. First-suite mutation detection was not measured; do not claim a before/after mutation score.
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

 RUN  v3.2.4 /workspace/scratch/266377f4e4f8/se-practice/week-07/app

 ✓ src/booking.test.ts (20 tests) 4ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  23:45:53
   Duration  339ms (transform 44ms, setup 0ms, collect 43ms, tests 4ms, environment 0ms, prepare 66ms)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06 | Not applicable; exact-duration assertion failed |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, X2, AC5 | Not applicable; endpoint and accepted-path assertions failed |
| M3 | Remove the blocked-room rejection | Detected | T13 | Not applicable; blocked request incorrectly returned true |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

 RUN  v3.2.4 /workspace/scratch/266377f4e4f8/se-practice/week-07/app

 ❯ src/booking.test.ts (20 tests | 1 failed) 13ms
   ✓ T01 AC4: 660 is the existing end; sharing that endpoint uses no booked minute. 2ms
   ✓ T02 AC1: 540 equals now, but the start must be strictly later. 0ms
   ✓ T03 AC1: Equal endpoints give zero duration rather than start before end. 0ms
   ✓ T04 AC1: 750 is later than 720, so the interval is reversed. 0ms
   ✓ T05 AC1: 1441 is one minute beyond the allowed end of the day. 0ms
   × T06 AC2: 840 minus 720 is exactly 120; only longer durations are rejected. 7ms
     → expected false to be true // Object.is equality
   ✓ T07 AC2: 841 minus 720 is 121, one minute above the duration limit. 0ms
   ✓ T08 AC4: The request ends exactly when the existing booking starts, without overlapping. 0ms
   ✓ T09 AC4: Minutes from 630 until 660 belong to both intervals. 0ms
   ✓ T10 AC4: The request contains the whole existing interval from 600 to 660. 0ms
   ✓ T11 AC4: Every requested minute lies inside the existing booking. 0ms
   ✓ T12 AC4: Identical intervals share every minute, so the room is occupied. 0ms
   ✓ T13 AC3: An otherwise valid request is rejected because the room is blocked. 0ms
   ✓ T14 AC4: An empty booking array has no interval that can overlap the request. 0ms
   ✓ X1 AC1: 1440 is included in the allowed end boundary; this request lasts 60 minutes. 0ms
   ✓ X2 AC4: With bookings 600-660 and 720-780, the request fits exactly between both endpoints. 0ms
   ✓ AC5: an Available request preserves booking data 1ms
   ✓ X3 AC1: reject a start below zero independently of now 0ms
   ✓ X4 AC4: reject overlap with the second existing booking 0ms
   ✓ X5 characterization: reversed existing booking is not rejected 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T06 AC2: 840 minus 720 is exactly 120; only longer durations are rejected.
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:29:59
     27| 
     28| test('T06 AC2: 840 minus 720 is exactly 120; only longer durations are…
     29|   expect(canBook({ ...fixture(), start: 720, end: 840 })).toBe(true);
       |                                                           ^
     30| });
     31| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 19 passed (20)
   Start at  23:45:50
   Duration  517ms (transform 52ms, setup 0ms, collect 59ms, tests 13ms, environment 0ms, prepare 109ms)

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

 RUN  v3.2.4 /workspace/scratch/266377f4e4f8/se-practice/week-07/app

 ❯ src/booking.test.ts (20 tests | 4 failed) 15ms
   × T01 AC4: 660 is the existing end; sharing that endpoint uses no booked minute. 9ms
     → expected false to be true // Object.is equality
   ✓ T02 AC1: 540 equals now, but the start must be strictly later. 0ms
   ✓ T03 AC1: Equal endpoints give zero duration rather than start before end. 0ms
   ✓ T04 AC1: 750 is later than 720, so the interval is reversed. 0ms
   ✓ T05 AC1: 1441 is one minute beyond the allowed end of the day. 0ms
   ✓ T06 AC2: 840 minus 720 is exactly 120; only longer durations are rejected. 0ms
   ✓ T07 AC2: 841 minus 720 is 121, one minute above the duration limit. 0ms
   × T08 AC4: The request ends exactly when the existing booking starts, without overlapping. 1ms
     → expected false to be true // Object.is equality
   ✓ T09 AC4: Minutes from 630 until 660 belong to both intervals. 0ms
   ✓ T10 AC4: The request contains the whole existing interval from 600 to 660. 0ms
   ✓ T11 AC4: Every requested minute lies inside the existing booking. 0ms
   ✓ T12 AC4: Identical intervals share every minute, so the room is occupied. 0ms
   ✓ T13 AC3: An otherwise valid request is rejected because the room is blocked. 0ms
   ✓ T14 AC4: An empty booking array has no interval that can overlap the request. 0ms
   ✓ X1 AC1: 1440 is included in the allowed end boundary; this request lasts 60 minutes. 0ms
   × X2 AC4: With bookings 600-660 and 720-780, the request fits exactly between both endpoints. 1ms
     → expected false to be true // Object.is equality
   × AC5: an Available request preserves booking data 2ms
     → expected false to be true // Object.is equality
   ✓ X3 AC1: reject a start below zero independently of now 0ms
   ✓ X4 AC4: reject overlap with the second existing booking 0ms
   ✓ X5 characterization: reversed existing booking is not rejected 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T01 AC4: 660 is the existing end; sharing that endpoint uses no booked minute.
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:9:59
      7| 
      8| test('T01 AC4: 660 is the existing end; sharing that endpoint uses no …
      9|   expect(canBook({ ...fixture(), start: 660, end: 720 })).toBe(true);
       |                                                           ^
     10| });
     11| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL  src/booking.test.ts > T08 AC4: The request ends exactly when the existing booking starts, without overlapping.
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:37:59
     35| 
     36| test('T08 AC4: The request ends exactly when the existing booking star…
     37|   expect(canBook({ ...fixture(), start: 570, end: 600 })).toBe(true);
       |                                                           ^
     38| });
     39| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

 FAIL  src/booking.test.ts > X2 AC4: With bookings 600-660 and 720-780, the request fits exactly between both endpoints.
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:69:123
     67| 
     68| test('X2 AC4: With bookings 600-660 and 720-780, the request fits exac…
     69|   expect(canBook({ ...fixture(), start: 660, end: 720, bookings: [{ st…
       |                                                                                                                           ^
     70| });
     71| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL  src/booking.test.ts > AC5: an Available request preserves booking data
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:75:54
     73|   const data = fixture();
     74|   const before = structuredClone(data.bookings);
     75|   expect(canBook({ ...data, start: 660, end: 720 })).toBe(true);
       |                                                      ^
     76|   expect(data.bookings).toEqual(before);
     77| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯


 Test Files  1 failed (1)
      Tests  4 failed | 16 passed (20)
   Start at  23:45:51
   Duration  444ms (transform 79ms, setup 0ms, collect 60ms, tests 15ms, environment 0ms, prepare 105ms)

npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm.

 RUN  v3.2.4 /workspace/scratch/266377f4e4f8/se-practice/week-07/app

 ❯ src/booking.test.ts (20 tests | 1 failed) 11ms
   ✓ T01 AC4: 660 is the existing end; sharing that endpoint uses no booked minute. 1ms
   ✓ T02 AC1: 540 equals now, but the start must be strictly later. 0ms
   ✓ T03 AC1: Equal endpoints give zero duration rather than start before end. 0ms
   ✓ T04 AC1: 750 is later than 720, so the interval is reversed. 0ms
   ✓ T05 AC1: 1441 is one minute beyond the allowed end of the day. 0ms
   ✓ T06 AC2: 840 minus 720 is exactly 120; only longer durations are rejected. 0ms
   ✓ T07 AC2: 841 minus 720 is 121, one minute above the duration limit. 0ms
   ✓ T08 AC4: The request ends exactly when the existing booking starts, without overlapping. 0ms
   ✓ T09 AC4: Minutes from 630 until 660 belong to both intervals. 0ms
   ✓ T10 AC4: The request contains the whole existing interval from 600 to 660. 0ms
   ✓ T11 AC4: Every requested minute lies inside the existing booking. 0ms
   ✓ T12 AC4: Identical intervals share every minute, so the room is occupied. 0ms
   × T13 AC3: An otherwise valid request is rejected because the room is blocked. 7ms
     → expected true to be false // Object.is equality
   ✓ T14 AC4: An empty booking array has no interval that can overlap the request. 0ms
   ✓ X1 AC1: 1440 is included in the allowed end boundary; this request lasts 60 minutes. 0ms
   ✓ X2 AC4: With bookings 600-660 and 720-780, the request fits exactly between both endpoints. 0ms
   ✓ AC5: an Available request preserves booking data 0ms
   ✓ X3 AC1: reject a start below zero independently of now 0ms
   ✓ X4 AC4: reject overlap with the second existing booking 0ms
   ✓ X5 characterization: reversed existing booking is not rejected 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > T13 AC3: An otherwise valid request is rejected because the room is blocked.
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.ts:57:74
     55| 
     56| test('T13 AC3: An otherwise valid request is rejected because the room…
     57|   expect(canBook({ ...fixture(), start: 660, end: 720, blocked: true }…
       |                                                                          ^
     58| });
     59| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 19 passed (20)
   Start at  23:45:52
   Duration  331ms (transform 41ms, setup 0ms, collect 35ms, tests 11ms, environment 0ms, prepare 67ms)
```

All three changes reverted, and the full suite run again (section 6.3): yes

---

## 8. Task 7 — manual UI checks

Not completed in this environment. Local Chromium failed to start because socket creation was denied. The shared browser rejected the local file URL under its URL policy. No screenshots were fabricated. Follow UI_CHECKLIST.md on a laptop and replace these rows with actual observations. These are environment limitations, not observed page failures.

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | Browser not opened; Available is unit-tested by T01, but the visible result is unverified. | Not testable |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | Browser not opened; rejection is unit-tested by T13, but replacing the earlier result is unverified. | Not testable |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | Browser not opened; source contains the message, but actual input feedback is unverified. | Not testable |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | Browser not opened; CSS contains a narrow layout, but phone usability and screenshot are unverified. | Not testable |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | Browser not opened; AC5 tests data preservation, but repeated page checks are unverified. | Not testable |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| U1 | Five browser screenshots are missing because browser verification was blocked. The student must capture the real page. |
| U2 | ui-4.png is missing; phone-width usability has not been observed. |

Other pending items outside these checker IDs: identity fields, student-written reflection, independent plan review, fresh-chat workflow requirement, SETUP.md headings, and the actual open GitHub PR.

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 17 / 17 / 0 | 20 / 20 / 0 after restoring all mutants |
| Requirements with meaningful tests (AC IDs and gaps) | AC1-AC5 covered on the planned inputs; negative start and second-item overlap missing; AC6 unverified | AC1-AC5 plus X3 lower bound and X4 second-item overlap; X5 records unspecified behavior; AC6 remains unverified |
| Selected mutants detected | Not run against the first suite; no retrospective score claimed | M1, M2, M3: 3/3 detected by relevant assertion failures |
| Accepted / revised / rejected tests | 17 accepted, 0 expectation repairs, 0 rejected | Original 17 retained unchanged; 3 tests added; five review decisions recorded |
| Remaining limitations | Numeric lower bound, second-booking detection, malformed existing input, and browser behavior were not covered | X5 is only characterization; other malformed data, fractional/nonfinite times, and browser behavior are not comprehensively covered |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

X5 executed canBook with start=660, end=720, now=540, blocked=false, and bookings=[{start:700,end:650}]. It returned true. The overlap predicate checks 660 < 650, which is false, so it does not reject this malformed record. No AC defines validation of existing bookings. This is a recorded current behavior, not a policy derived from the criteria. A real system should decide how to validate stored data before relying on this result; that decision remains outside this lab.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->

There were no inappropriate expectations in the first test suite; however, the coverage was not tight enough to detect some bugs. Namely, negative start times were not checked, and the two bookings' test only checked touching endpoints. Analysis of these scenarios in accordance with AC1 and AC4 revealed their weaknesses, therefore, X3 was introduced to test the lower bound of the day, and X4 was added to check an overlap with the second booking only.

After restoring the correct implementation, all 20 tests have passed successfully. It demonstrates that our logic works correctly with these input parameters and preserves booking data when requests are accepted, although, of course, it cannot account for all possible scenarios and display. The failure of M1 with T06 also proves that the current test suite properly distinguishes a valid 120 minutes limit from the invalid one. However, unfortunately, we do not have a browser screenshot yet, thus mobile usability and validation errors display cannot be verified at the moment. Another uncertainty is related to malformed data; X5 logs the current application behavior when booking dates are swapped since there is no rule in acceptance criteria for this scenario.
