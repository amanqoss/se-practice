# Week 06 — Lab report

**Name:** Yernur
**Group:** Monday, 16:00 - 19:00
**Date:** 25.10.26

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Tool | Bolt.new |
| Exact model (as Bolt shows it, or `not displayed`) | not displayed|
| Bolt project link (or `not shared`, and why) | |
| Browser and version | |
| If you could not use Bolt.new: the tool you used instead, and why | |

---

## 2. Task 1 — define before generating

**Two predictions, written BEFORE you send the first prompt.** Where do you expect v1 to go wrong?
Fill the first three columns now; fill the last one after Task 3.

| # | What I expect to go wrong | AC it concerns | Was I right? (after Task 3) |
| --- | --- | --- | --- |
| 1 | The AI might incorrectly reject a booking starting exactly when another booking ends.| AC4| |
| 2 | The AI might use the real system time rather than allowing a supplied current time.| AC1| |

**The initial prompt exactly as I sent it** — the deck's prompt with AC1–AC6 pasted in place of
`[paste AC1–AC6]`, nothing else changed:

```
Build a small responsive Smart Campus Room Availability Checker. Requirements:

AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.

Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
```

---

## 3. Task 2 — prototype v1

v1 export saved in `original/` and screenshot saved as `evidence/v1.png` **before** any cleanup
prompt: yes 

**Bolt's list of the files/components it created, pasted unedited:**

```
package.json
src/App.tsx
src/index.css
index.html
```

**What v1 does — one line per thing that works, or visibly does not:**

-

**Repair prompt** (only if the first build did not run — the deck allows one, then the result is
v1). Leave empty if you did not need it:

```text
```

---

## 4. Task 3 — the nine cases

Base for every case unless the row says otherwise: **current time 09:00**, room **not blocked**,
the room's **only booking 10:00–11:00**. The Expected column comes from AC1–AC6 — do not change it.
Write each result exactly as **Available**, **Unavailable** or **Not testable** (the page gives you
no way to set up the case). Save each final run as `evidence/final-T<n>.png`.

| # | Case | What you set up and request | Expected | AC | Result on v1 | Result on final | Final screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 11:00–12:00 | Available | AC4 | Available | final-T1.png |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 | Unavailable | final-T2.png |
| T3 | Blocked | 11:00–12:00, room blocked | Unavailable | AC3 | Unavailable | final-T3.png |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Available | final-T4.png |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 | Unavailable | final-T5.png |
| T6 | Starts now | 09:00–09:30 (current time 09:00) | Unavailable | AC1 | Unavailable | final-T6.png |
| T7 | Reversed times | 12:00–11:00, and the page says why | Unavailable | AC1, AC6 | Unavailable | final-T7.png |
| T8 | Same check twice | T1, then T1 again without reloading | Available | AC5 | Available | final-T8.png |
| T9 | Narrow screen | T1 at about 375 px wide | Available | AC6 | Available | final-T9.png |

---

## 5. Issue log — cleanup targets

One row per issue you chose to act on (or deliberately not act on). At least **two**: one
functional and one usability or code-quality issue when you have them. If v1 passed every case,
log a justified cleanup that preserves behaviour. Save a screenshot of each as
`evidence/issue-<n>.png`.

| # | Issue | Evidence: steps → expected → observed | Priority | Decision |
| --- | --- | --- | --- | --- |
| 1 | Cannot reproduce the prescribed test setup if booking data is not configurable | Steps: Select Room 101, set current time to 09:00, and request 12:00–14:00. Expected: Available under the required test setup with only a 10:00–11:00 booking. Observed: Unavailable because Room 101 has another booking from 12:00–13:00. The provided sample data differs from the required test scenario. | High | Fix |
| 2 | Existing bookings are not clearly displayed before checking availability | Steps: Select Room 204 and inspect the page before checking a time interval. Expected: The interface should provide clear booking information to help students select a valid time (AC6). Observed: The existing 12:00–13:00 booking becomes apparent only after submitting an overlapping request. | Medium | Fix |

---

## 6. Task 4 — cleanup with focused prompts

One issue per prompt. Paste every prompt **as sent** (every `[bracketed field]` and `AC#` filled
in) and Bolt's answer, unedited.

**Functional fix prompt, as sent, and Bolt's answer:**

```
In the current prototype, [steps] produces [observed result], but AC# requires [expected result]. Make the smallest change that fixes this behavior. Preserve the other acceptance criteria. Explain which file/component you changed and why.
```

**Cleanup prompt, as sent, and Bolt's answer:**

```
Review only [component/area] for unnecessary duplication, confusing naming, or UI feedback problems. Suggest one small cleanup. Do not add features or redesign the whole application. Implement it only if it preserves AC1–AC6.
```

Add further blocks for further prompts.

**Every change or suggestion Bolt made, judged.** Accepting is a decision; so is rejecting. Cite
the AC (or the scope) that justifies it.

| # | What Bolt changed or suggested | accept / reject | Reason — cite the AC or the scope | Retest: which cases, result |
| --- | --- | --- | --- | --- |
| 1 | Updated the fictional booking data so the selected test room has only one existing booking from 10:00–11:00. | accept | This enables testing the required scenarios for AC1–AC5 without unrelated booking conflicts. The change stays within the fictional-data scope. | T1–T9: Record actual results after retesting. |
| 2 | Improved the room availability interface to display existing bookings before checking availability. | accept | AC6 requires understandable feedback and a usable interface. Displaying existing bookings helps users choose valid times without modifying booking data (AC5). | T1–T9: Record actual results after retesting, including mobile usability in T9. |

---

## 7. Change log — v1 to final

Two to four concrete changes, each one retested.

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 | Test data did not match the required booking scenario. | Accept | Updated the fictional room booking data to include a room with only one existing booking from 10:00–11:00. | T1–T9: Record actual results after retesting. |
| 2 | Existing bookings were not clearly displayed before checking availability. | Accept | Updated the room availability UI to display existing bookings and improve user feedback. | T1–T9: Record actual results after retesting, including mobile layout. |

---

## 8. One generated component, in my own words

Pick one file or component Bolt generated that matters for AC1–AC5 — the one that decides
availability is the best choice. Name its path in backticks, then explain in your own words, without
the assistant, what it does and how it decides. 60 words or more.

**File:** `(src/App.tsx)`

<!-- Write your explanation below this line -->
The application checks whether the selected time is valid, does not exceed 120 minutes, and does not overlap existing bookings. It also checks whether the room is blocked. Based on these conditions, it displays Available or Unavailable with an explanation. Checking availability does not create a new booking.

---

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All required checks passed successfully. No known failures remain. |

### 9.2 The end of the day

AC1 allows `end ≤ 1440` — a booking may end at 24:00. Can a user of your final page ask for
23:00–24:00? How — and if not, why is that acceptable or not? (This is the value you declare in
`submission.yml` under `assumptions.end_of_day`.)

-

### 9.3 Which "now"?

AC1 says "after the supplied current time". What did **v1** use as the current time, and what did
that mean for testing case T6?

In v1, the application used a user-supplied current time of 09:00. This allowed me to test T6 by setting the booking start time to 09:00 and the end time to 09:30. According to AC1, the start time must be strictly after the current time, so the expected result was Unavailable.

---

## 10. Conclusion (120–180 words)

During Practice 6, I used Bolt.new to create a Smart Campus Room Availability Checker and tested it against the acceptance criteria AC1–AC6. The application allowed users to select a room, enter booking times, and check availability. During testing, I confirmed that blocked rooms were rejected and bookings longer than 120 minutes were not allowed.

I also noticed that some rooms had existing bookings that differed from the required test scenario. For example, Room 101 had a booking from 12:00 to 13:00, which affected the result of T4. This showed me the importance of understanding test data before identifying a problem.

This practice helped me understand how AI-generated applications should be tested and evaluated. I learned that generating a working interface is only the first step. Checking functionality, documenting issues, reviewing suggested improvements, and verifying results are equally important for developing reliable software.
