# SIS #03 — Report: Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 13.) and every
     ### sub-heading, and the **Label:** words — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and reuse

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Reuse: week-05 if code/original/booking_v1.py is your Week 05 v1, copied unedited;
     week-06 if web/original/ is your Week 06 v1 export; fresh if you generated it for this SIS. -->

| Item | Value |
| --- | --- |
| Coding assistant (tool) | ChatGPT |
| Coding assistant model | GPT-6.2 Astra |
| Bolt.new model | Standard agent |
| Bolt project link | https://bolt.new/~/sb1-ckeoeszb?focus=create-project |
| Language | Python |
| Path | A |
| Python v1 from | week-05 |
| Web v1 from | week-06 |

## 2. Baseline — before any new AI exchange

<!-- Written by you, without AI, before the first exchange of this SIS. Commit and push it
     first (README §2). Reusing Week 05/06 work does not exempt you: this section is new. -->

### 2.1 Scope in my own words

**Scope:** So, this system includes the hours and number of rooms a student wants to test for availability on campus before making the booking. The results appear without involving the student's remaining hours or the booking system.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | Rooms and hours should both be positive integers. |
| AC2 | A booking can be made of 20 hours or less, which includes a booking of 20 hours only. |
| AC3 | In case the room is not available (offline/closed), then the booking cannot be processed. |
| AC4 | There must be sufficient hours left for all the rooms. When three hours are reserved in two different rooms, this accounts for six hours from the total allowance. |
| AC5 | The page states whether "Available" or "Unavailable." Rechecking the same booking does not affect the remaining hours. |
| AC6 | If any input is wrong, the page will state which field needs to be fixed. The input box, submit button, and output need to be mobile-friendly. |

### 2.3 Likely failure points

<!-- At least two. The brief's examples: endpoint overlap, starts-now. -->

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | The system could reject 20 hours precisely. | AC2 | Since there is space in the room and 30 hours allowed, I will start with 1 room for 20 hours, and then 1 room for 21 hours. The first one should be feasible while the latter is not. |
| 2 | The program could validate just the session time while neglecting to verify the number of rooms. | AC4 | Since the room is free and there is an allowance of 5 hours, I will ask for 2 rooms for 3 hours. I would expect “Unavailable,” as the booking requires 6 hours. |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Desired booking commencement time | Valid date-time / timestamp |
| `end` | Requested time for ending booking | Valid date-time / timestamp |
| `hours` | Hours spent in one room session | Positive integer |
| `blocked` | Whether the room is blocked or unavailable during the specified time slot | Boolean |
| `existing` | Existing bookings or conflicting reservations for the room | List of time intervals |
| returns | Availability of the room for the particular time slot | True or False |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. The page is aware of the hours left that the student can book.
2. The units used in booking each room hour are one unit per hour.

**Checked manually:**

- I will set the remaining hours to 2, check the 1 hour booking twice, and see if the shown allowance remains 2.

## 3. Python v1 review

<!-- One row per conditional branch in code/original/booking_v1.py (your language's v1 on
     Path B). Quote the condition exactly. AC1-AC4 must all appear in the AC column. -->

## 3. Python v1 review

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if not (0 <= start < end <= 1440 and start > now):` | AC1 | Partly | Rejects reversed, empty, past and out-of-day intervals. Fractions such as 720.5 pass the arithmetic comparison. |
| `if end - start > 120:` | AC2 | Yes | The first invalid duration is 121 minutes. T4 and T5 land on opposite sides. |
| `if blocked:` | AC3 | Yes | A blocked room exits before the booking scan, even when the interval would fit. |
| `for old_start, old_end in existing:` | AC4, AC5 | Yes | Visits each stored interval in order without writing to it. A conflict can be in the second entry. |
| `if start <= old_end and end >= old_start:` | AC4 | No | At 11:00 a 10:00–11:00 booking has ended. The inclusive comparison incorrectly rejects the next interval. |
| `return True` | AC5 | Yes, conditional on the preceding checks | The success path returns a Boolean without reserving the room. The incorrect overlap branch can prevent reaching it. |


## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements:

AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.

Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
~~~~

<!-- Main generated files or components, with their path inside web/original/
     (for example src/App.tsx). At least two. -->

| Generated file or component | Path | Its role |
| --- | --- | --- |
| App | `src/App.tsx` | Mounts the checker and passes the fictional room list. |
| RoomChecker | `src/components/RoomChecker.tsx` | Connects the selected room and time fields to a decision and renders the schedule. |
| Availability rules | `src/lib/availability.ts` | Parses the clock and checks the time, room and conflicts. |
| Sample schedules | `src/data.ts` | Stores the read-only intervals. |
| Styles and entry point | `src/index.css`, `index.html` | Load Tailwind styles and provide the root element. |

**What v1 does:**

- Change of either the room or the time refreshes the decision instantly. It shows the bookings for the selected room and describes any problems that arise. Its native End button does not support the expression of 24:00. The original screen grab of Week 06 is `evidence/web-v1.png`.

## 5. Test cases — executed on both artifacts

<!-- Base for every case unless the row says otherwise: now = 540, blocked = False,
     existing = [(600, 660)]. Do not change the first four columns.
     Python columns: True, False or Error (it raised) — what the call actually returned.
       T11: the result of the SECOND call. T12: n/a.
       Path A: the checker runs both of your files on T1-T11 and compares (C2, C3).
     Page columns: Available, Unavailable or Not testable — what the page actually showed.
     Never write a result you did not observe. -->

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | False | True | Available | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Unavailable | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Unavailable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Available | Available |
| T5 | 121 min | 720–841 | Unavailable | False | False | Unavailable | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | False | False | Unavailable | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | False | False | Unavailable | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Not testable | Available |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Not testable | Unavailable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Not testable | Unavailable |
| T11 | Same check twice | 660–720, twice | Available | False | True | Available | Available |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Available | Available |


**T10 in v1.** The shipped page cannot accommodate the two prescribed intervals. Room 204 was available during 12:00-13:00 since the second interval of that room is from 14:00 onwards. Another run through another browser window used the same unmodified v1 RoomChecker program along with the same fixtures in all twelve examples. In this example, T10 was unavailable when the second interval was 11:40-12:40.

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | `code/booking.py`, `RoomChecker.tsx` end parser | T6–T9 and start 720.5 | Reject starts-now, reversed, past-midnight and fractional times. Accept 24:00. | Python accepted the fraction. Page could not enter either midnight case. | Python rejects the fraction. Page rejects T6, T7 and T9 and accepts T8. |
| AC2 | `booking.py` duration guard, `availability.ts` duration guard | T4 and T5 | 120 allowed, 121 rejected | Both produced the expected pair. | Both produced the same pair. |
| AC3 | `booking.py` blocked guard, `availability.ts` room check | T3, Lab A | Reject a free interval in the blocked room. | Python False, page Unavailable. | Python False, page Unavailable. |
| AC4 | `booking.py` overlap loop, `availability.ts` overlaps | T1, T2, T10 | Allow touching, reject either conflict. | Python rejected T1. Page allowed T1. T10 required the exact fixture in the original component. | Both allowed T1 and rejected T2 and T10. |
| AC5 | `booking.py`, `RoomCard` and result card | T11, check twice | Available twice, original schedule and order preserved. | Python returned False twice because of AC4. Page returned Available with the same bookings. | Python True twice. Page Available twice. The unsorted Python list kept its order. |
| AC6 | `RoomChecker.tsx` input feedback and responsive grid | T9, T12, empty End | Identify the field and show a readable decision on a phone. | Empty End gave generic feedback. At 375 pixels T1 displayed Available. | Invalid End is named. At 375 pixels T1 displayed Available without horizontal overflow. |

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | A valid midnight end cannot be entered. | T8, 23:00–24:00. The original time control clears the End value. | High | B5 requests a text End field accepting 24:00 and field-specific feedback. The final converts 24:00 to minute 1440. | T8 Available. T9 at 24:01 Unavailable with the allowed End range. |
| 2 | Python accepts fractional minutes. | AC1, 720.5–750 with the base schedule returns True in v1. | High | B4 requests integer endpoint checks before comparisons and retains the duration and overlap guards. | The final returns False for fractions, strings and booleans. All 28 tests passed. |
| 3 | The second required conflict is absent from the selectable schedules. | T10, Room 204 displays Available at 12:00–13:00 in v1. | Medium | B5 specifies both fictional intervals for Room 204 so students can reproduce the case from the page. | T10 displays Unavailable and identifies the 11:40–12:40 booking. |

**Before / after:** Issue 1 is shown in `evidence/before-1.png` and `evidence/after-1.png`. Both display Room 101 booking at 23:00 hours, with the same bookings as earlier. In the second screenshot, the value in the End field is 24:00, while the green card reads Available.

## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | Python accepts fractional starts. | An independent call with 720.5 returned True in v1. The final unit suite checks both endpoints. | Accept | AC1 specifies integer minutes. |
| 2 | Inclusive Python overlap rejects touching. The page already uses strict comparisons. | T1 returned False in v1 Python and Available on the rendered v1 page. T2 still rejected a real overlap. | Accept | AC4 permits touching. The repair belongs in Python. |
| 3 | The duration limit, blocked-room guard and list preservation work. | T4/T5 split at 120/121, T3 rejected, and T11 preserved the displayed list. A direct Python check compared an unsorted list after both calls. | Accept | AC2, AC3 and AC5. The wrong T11 Python Boolean comes from AC4. |
| 4 | Use a free-text End field and provide format feedback. | Chromium cleared 24:00 in v1. The final displays Available at 24:00 and gives a field-specific reason at 24:01. | Modify | Keep the native controls for Current time and Start. Only End needs midnight. AC1 and AC6. |
| 5 | The decision is labelled and the page sorts a copy, but invalid input and narrow layout need checking. | Read RoomCard’s slice-and-sort, compared displayed bookings on T11, inspected the generic v1 error and the 375-pixel capture. | Accept | AC5 and AC6. The phone capture and measured width support the layout observation. |

## 9. Coding-agent analysis

### 9.1 The loop

<!-- One real pass through the loop from this assignment — with your assistant or with Bolt. -->

| Step | What happened in this assignment |
| --- | --- |
| User goal | Make the Python and Bolt decisions agree for the course cases. |
| Model / plan | Reuse both first versions, test the exact boundaries, then change only a failing behavior and its supporting fixtures. |
| Tool call | The browser runner set Start to 23:00, attempted End 24:00, and read the rendered decision. |
| Observation | Chromium cleared the original End input. Python accepted the interval ending at minute 1440. |
| Next step | A focused repair changed End validation. Chromium then displayed Available at midnight and Unavailable one minute later. |
| Human review | The student confirmed Python Path A and approved the second assistant. Final review of the screenshots, decisions, and disclosure belongs to the student. |

### 9.2 Context, tools and permissions

<!-- At least three rows. Last column: Observed (you saw it happen) or Assumed (you infer it
     about the internals). Use both at least once. -->

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| Coding assistant | The supplied handout, PR baseline, original files and checker output. | Read repository files, wrote working files and ran local Python and browser tests. | Observed |
| GitHub integration | The existing pull request and its branch. | Read the baseline and source files. Requests to publish a blob and update PR metadata returned HTTP 403. | Observed |
| Bolt.new | The Week 06 prompt and the exported React project. | The archive documents the output. Bolt’s internal file selection and prompts are unknown. | Assumed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before approving the generated fixes, the original Python blob and the Bolt tree were compared against the Week 05 and Week 06 Git objects. Modifications were identified in the last copies, and the dependencies were installed in different build directories. The screenshots were taken using Chromium.

**Reliability, security, responsibility:** The green function test is not capable of determining whether a person has the capability to join within the boundaries of its value. It was the browser test which filled this gap at midnight. The unutilized database package has been deleted from the final export after inspecting its imports. The student will have to do his part by reviewing the focused changes, declaring them, and controlling the final push.

## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->

(write here)

## 11. Appendix A — AI exchanges

<!-- At least four. Complete prompts and complete responses, as text — never screenshots. Paste
     each inside the ~~~~ block that follows its label.
     Stage: Plan, Generate, Critique or Repair (the brief's A-D) — at least one of each.
     Source: this SIS, week-05 or week-06. Reused exchanges keep their original date.
     The Generate exchange for Python must contain your v1 exactly as it is in code/original/.
     Add B5, B6 … if you ran more. -->

### B1

- **Tool:** ChatGPT
- **Model:** GPT-6
- **Date:** 22.11.2026
- **Stage:** Plan
- **Source:** week-05

**Prompt:**

~~~~text
Create an outline for implementation of can_book. Provide the tests in order and state your assumptions. Use Python 3 and the rules provided. Do not write any code yet. Mention some boundary conditions which may reveal a wrong implementation.
~~~~

**Response:**

~~~~text
1. Check `0 <= start < end <= 1440` and `start > now` (AC1).
2. Reject a duration longer than 120 minutes (AC2).
3. Reject a blocked room (AC3).
4. For each existing active interval `(a, b)`, reject the request when `start < b and end > a` (AC4).
5. Otherwise return `True`, and never modify arguments or the existing list (AC5).
Assumptions: `now` and stored bookings are valid by contract, and all intervals are half-open. Boundary suggestions: zero-length, reversed endpoints, 0/1440, start equal to now, exactly 120/121 minutes, touching on either side, nested intervals, multiple existing bookings, and mutation checks.
~~~~

### B2

- **Tool:** ChatGPT
- **Model:** GPT-6
- **Date:** 22.11.2026
- **Stage:** Generate
- **Source:** week-05

**Prompt:**

~~~~text
Implement can_book in booking.py based on the provided specification along with AC1-AC5. Preserve the signature. Import only the standard library. Do not alter the preexisting code. Provide the implementation and a brief description for each assertion condition.
~~~~

**Response:**

~~~~text
def can_book(start, end, now, blocked, existing):
    """Determine whether a room can be booked on the current day."""
    if not (0 <= start < end <= 1440 and start > now):
        return False
    if end - start > 120:
        return False
    if blocked:
        return False
    for old_start, old_end in existing:
        if start <= old_end and end >= old_start:
            return False
    return True
~~~~

### B3

- **Tool:** Codex in ChatGPT
- **Model:** GPT-6.2 Astra
- **Date:** 22.11.2026
- **Stage:** Critique
- **Source:** SIS - 03

**Prompt:**

~~~~text
Assess both original artifacts in sis03-repo/sis-03/code/original/booking_v1.py and sis03-repo/sis-03/web/original/ relative to AC1-AC6 in sis03-repo/sis-03/README.md. Find at least one concrete claim to evaluate independently, including at least one recommendation that entails a trade-off. Focus on the discrepancy between the specification and the student input possible. Limit your critique to around 120 words, use actual evidence to support all claims, and do not change any files. This discussion becomes part of the lab’s critique exchange.
~~~~

**Response:**

~~~~text
Python v1 accepted `660.5` as a start, violating AC1. With an existing booking from 600 to 660, it rejected 660–720 because its overlap comparisons include equality. The web function already uses strict comparisons for AC4. Python accepted exactly 120 minutes, rejected 121, rejected a blocked room, and preserved the booking list in all six calls. The page labels valid decisions “Available” or “Unavailable” and sorts a copy for display.

Python accepted 1380–1440, but the page’s time parser stops at 23:59. A text field for End could accept `24:00`, at the cost of requiring explicit format feedback. Clearing a field currently gives only “Enter valid times.” At 375 pixels, verify that a student can identify the field to correct and read the resulting decision.
~~~~

### B4

- **Tool:** Codex in ChatGPT
- **Model:** GPT-6.2 Astra
- **Date:** 22.11.2026
- **Stage:** Repair
- **Source:** sis - 03

**Prompt:**

~~~~text
In sis03-repo/sis-03/code, keep the original. In the Week 05 v1, (660,720,540,False,[(600,660)]) evaluates to False and 720.5 to True. The current final solution already takes care of overlapping intervals. Change booking.py and test_booking.py alone by rejecting any noninteger candidate endpoints prior to comparison and by running the function repeatedly with the same bookings. Keep the Week 05 testsuite, run the final testsuite, and explain precisely what was done and why those tests identify the bugs. Do not commit. Provide one single final response in the Repair discussion.
~~~~

**Response:**

~~~~text
I added an integer check for `start` and `end` before `can_book` compares the times. Before the change, a fractional endpoint and a `True` start could produce `True`, while a numeric string or `None` raised `TypeError`. Each now returns `False` as required by AC1.

I retained the 24 Week 05 tests and added four. Three cover invalid endpoint types. The fourth requests 11:00–12:00 twice between two adjacent bookings stored in reverse chronological order. Both calls returned `True`, and the test checked the booking list against its original contents and order after each call. This exercises endpoint touching under AC4 and detects in-place sorting or reservation under AC5.

All **28 tests passed** with `python -m unittest -v`. The original v1 file is unchanged.
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

<!-- The complete terminal output of your final suite. Path A: python -m unittest -v, run inside
     code/ — the part ending in "Ran N tests" and OK or FAILED. -->

~~~~text
test_at_day_end (test_booking.BookingTests.test_at_day_end) ... ok
test_beyond_day (test_booking.BookingTests.test_beyond_day) ... ok
test_blocked (test_booking.BookingTests.test_blocked) ... ok
test_boolean_start_is_not_a_minute (test_booking.BookingTests.test_boolean_start_is_not_a_minute) ... ok
test_contains_existing (test_booking.BookingTests.test_contains_existing) ... ok
test_empty_bookings (test_booking.BookingTests.test_empty_bookings) ... ok
test_exactly_120_with_conflict (test_booking.BookingTests.test_exactly_120_with_conflict) ... ok
test_exactly_two_hours (test_booking.BookingTests.test_exactly_two_hours) ... ok
test_inside_existing (test_booking.BookingTests.test_inside_existing) ... ok
test_negative_start (test_booking.BookingTests.test_negative_start) ... ok
test_no_mutation (test_booking.BookingTests.test_no_mutation) ... ok
test_noninteger_end (test_booking.BookingTests.test_noninteger_end) ... ok
test_noninteger_start (test_booking.BookingTests.test_noninteger_start) ... ok
test_one_minute (test_booking.BookingTests.test_one_minute) ... ok
test_over_two_hours (test_booking.BookingTests.test_over_two_hours) ... ok
test_overlap_ends_at_existing_end (test_booking.BookingTests.test_overlap_ends_at_existing_end) ... ok
test_overlap_starts_at_existing_start (test_booking.BookingTests.test_overlap_starts_at_existing_start) ... ok
test_partial_overlap (test_booking.BookingTests.test_partial_overlap) ... ok
test_repeated_touching_check_preserves_unsorted_bookings (test_booking.BookingTests.test_repeated_touching_check_preserves_unsorted_bookings) ... ok
test_reversed (test_booking.BookingTests.test_reversed) ... ok
test_same_interval (test_booking.BookingTests.test_same_interval) ... ok
test_several_conflict_second (test_booking.BookingTests.test_several_conflict_second) ... ok
test_several_no_overlap (test_booking.BookingTests.test_several_no_overlap) ... ok
test_start_before_now (test_booking.BookingTests.test_start_before_now) ... ok
test_starts_now (test_booking.BookingTests.test_starts_now) ... ok
test_touching_end_allowed (test_booking.BookingTests.test_touching_end_allowed) ... ok
test_touching_start_allowed (test_booking.BookingTests.test_touching_start_allowed) ... ok
test_zero_length (test_booking.BookingTests.test_zero_length) ... ok

----------------------------------------------------------------------
Ran 28 tests in 0.000s

OK
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. --> Python Path A.

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

<!-- One row per check ID in submission.yml known_fails, and any limitation you know of.
     If the checker is clean and you know of none, one row that says so. -->

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| B1 | The original student baseline uses an hours allowance, a 20-hour limit, and an hours parameter. The assigned contract uses integer minutes and now. | The student should correct §2 in a later dated commit in their own words, retaining the initial commit. |
| Q1 | The assignment reserves the reflection for the student. | The student should add their independent 100–200 words, then rerun the checker and declaration validator. |
| X2 | The original Week 05 Generate explanation was not found. The preserved response contains 58 checker-counted words. | Recover the original full chat response if available. The archived source is reproduced verbatim. |
| Original page T8–T10 | The original time widget cannot represent midnight or later. No shipped room has the exact T10 booking pair. | The final exposes all three cases through normal controls. The isolated original component also confirms the T10 booking rule. |
| Bolt project link | The downloadable final was improved locally from the Week 06 Bolt export. The hosted Bolt project has not been updated or verified. | To align a live demo with the submission, apply the final source in Bolt and preview it. |
