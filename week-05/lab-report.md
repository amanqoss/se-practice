# Week 05 — Lab report

**Name:** Yernur
**Group:** Monday: 16:00 - 19:00
**Date:** 18.10.2026

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | ChatGPT |
| **Exact** model name | GPT-6 |
| Language and version | Python 3 |
| Path | A |
| My Week 04 declaration for touching bookings | allowed |

Week 04 declared that touching bookings do not overlap; AC4 confirms this.


## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
1. Check `0 <= start < end <= 1440` and `start > now` (AC1).
2. Reject a duration longer than 120 minutes (AC2).
3. Reject a blocked room (AC3).
4. For each existing active interval `(a, b)`, reject the request when `start < b and end > a` (AC4).
5. Otherwise return `True`, and never modify arguments or the existing list (AC5).
Assumptions: `now` and stored bookings are valid by contract, and all intervals are half-open. Boundary suggestions: zero-length, reversed endpoints, 0/1440, start equal to now, exactly 120/121 minutes, touching on either side, nested intervals, multiple existing bookings, and mutation checks.
```

**What the plan invented or changed:**

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | Verify now and all stored bookings are valid | The contract already guarantees they are valid | Kept them as preconditions; no extra validation |
| 2 | Use strict comparison for overlap | AC4 permits touching endpoints | Kept the strict check |

**Boundary cases the assistant suggested that I kept as tests:**

- Zero and reversed durations, day bounds, exactly 120 minutes, touching endpoints, nested intervals, several bookings, and unchanged input.


## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.py`, exactly as the assistant returned it: **yes**.

**AC map.**

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `if not (0 <= start < end <= 1440 and start > now):` | AC1 | Yes |
| 2 | `if end - start > 120:` | AC2 | Yes; 120 is accepted |
| 3 | `if blocked:` | AC3 | Yes |
| 4 | `if start <= old_end and end >= old_start:` | AC4 | No; rejects touching endpoints |
| 5 | `return True` after the loop | AC5 | Yes if AC1–AC4 are implemented correctly |

**Anything in v1 that no AC asks for:** none. The assistant's only behavioral mistake was AC4's inclusive overlap boundaries.


## 4. Task 3 — my tests

Base input unless stated otherwise: `now=540, blocked=False, existing=[(600, 660)]`. The test code was prepared with AI assistance and the expected outcomes were checked against the stated ACs.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | test_touching_end_allowed | `(660,720)` | none | True | AC4 | FAIL | PASS |
| 2 | test_exactly_two_hours | `(720,840)` | none | True | AC2 | PASS | PASS |
| 3 | test_partial_overlap | `(630,690)` | none | False | AC4 | PASS | PASS |
| 4 | test_over_two_hours | `(720,841)` | none | False | AC2 | PASS | PASS |
| 5 | test_blocked | `(660,720)` | blocked=True | False | AC3 | PASS | PASS |
| 6 | test_starts_now | `(540,570)` | none | False | AC1 | PASS | PASS |
| 7 | test_zero_length | `(660,660)` | existing=[] | False | AC1 | PASS | PASS |
| 8 | test_reversed | `(700,660)` | existing=[] | False | AC1 | PASS | PASS |
| 9 | test_negative_start | `(-1,30)` | now=0, existing=[] | False | AC1 | PASS | PASS |
| 10 | test_beyond_day | `(1400,1441)` | existing=[] | False | AC1 | PASS | PASS |
| 11 | test_at_day_end | `(1439,1440)` | existing=[] | True | AC1 | PASS | PASS |
| 12 | test_empty_bookings | `(700,720)` | existing=[] | True | AC4 | PASS | PASS |
| 13 | test_several_no_overlap | `(660,690)` | existing=[(570,600),(600,660),(720,780)] | True | AC4 | FAIL | PASS |
| 14 | test_several_conflict_second | `(680,730)` | existing=[(570,600),(720,780)] | False | AC4 | PASS | PASS |
| 15 | test_touching_start_allowed | `(570,600)` | none | True | AC4 | FAIL | PASS |
| 16 | test_inside_existing | `(615,645)` | none | False | AC4 | PASS | PASS |
| 17 | test_contains_existing | `(570,690)` | none | False | AC4 | PASS | PASS |
| 18 | test_same_interval | `(600,660)` | none | False | AC4 | PASS | PASS |
| 19 | test_start_before_now | `(539,570)` | existing=[] | False | AC1 | PASS | PASS |
| 20 | test_one_minute | `(541,542)` | existing=[] | True | AC1 | PASS | PASS |
| 21 | test_exactly_120_with_conflict | `(570,690)` | none | False | AC4 | PASS | PASS |
| 22 | test_no_mutation | `(660,720)` | existing=[(720,780),(600,660)] (check order unchanged) | True | AC5 | PASS | PASS |
| 23 | test_overlap_ends_at_existing_end | `(650,660)` | none | False | AC4 | PASS | PASS |
| 24 | test_overlap_starts_at_existing_start | `(600,620)` | none | False | AC4 | PASS | PASS |


## 5. Task 4 — debugging with evidence

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `can_book(660, 720, 540, False, [(600, 660)])` | `True` | `False` (v1) | `if start <= old_end and end >= old_start:` | Use `start < old_end and end > old_start` | AI-assisted review; verified by boundary tests |
| 2 | `can_book(570, 600, 540, False, [(600, 660)])` | `True` | `False` (v1) | Same inclusive overlap line | Same strict interval comparison | AI-assisted review; verified by boundary tests |
| 3 | `can_book(660, 720, 540, False, [(720, 780), (600, 660)])` | `True`, original input order unchanged | A faulty version returned `True` but reordered the list | A mutation fault sorted `existing` in place | Added explicit order-preservation assertion | AI-assisted test review |

**The debug prompt I sent, and the assistant's answer:** No separate optional Prompt 3 was sent. The problem was identified during code/test review.


## 6. Task 5 — the critique

**The assistant's critique:**

```text
1. **AC4, original overlap line:** `if start <= old_end and end >= old_start:` incorrectly rejects requests sharing an endpoint. Change to strict `<` and `>` comparisons.
2. **AC5, mutation test:** Check that the entire `existing` list remains unchanged, including order, not merely its length.
3. **AC1, time validation:** Keep the compound comparison `0 <= start < end <= 1440 and start > now`; it correctly rejects invalid day bounds and requests starting now.
4. **AC2, duration:** Keep `end - start > 120`; exactly 120 is allowed.
5. **Contract, non-integer values:** Avoid inventing a general input sanitization requirement; the contract expressly supplies integer minutes.
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | Replace inclusive overlap tests with strict comparisons | accept | AC4 allows touching endpoints | 24 tests OK |
| 2 | Check preservation of list order | accept | AC5 prohibits changing existing | 24 tests OK, M10 caught |
| 3 | Keep exact AC1 comparison | accept | AC1 requires day bounds and future start | 24 tests OK |
| 4 | Keep strict duration upper bound | accept | AC2 permits exactly 120 minutes | 24 tests OK |
| 5 | Do not invent non-integer validation | accept | Inputs are integer minutes by contract | 24 tests OK |


## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | `start <= old_end and end >= old_start` → `start < old_end and end > old_start` | AC4: touching endpoints must be allowed | F7: v1 failed, final passed; `test_touching_end_allowed` |
| 2 | Initial mutation test with a sorted/single interval → unsorted multiple intervals plus copy | AC5: the existing list must be unchanged, including order | M10: initially survived, then caught by `test_no_mutation` |


### Git history and evidence of process

I created commit `8d1e650` (`week-05: preserve initial AI implementation`) first. The console history shows that this commit added `code/booking.py` and the template files, but **did not include** `code/original/booking_v1.py`. The original v1 file was first committed together with the revised implementation and tests in the second commit `86fb437` (`week-05: fix overlap and add 24 tests`). This does **not** meet the requested order of committing v1 in `code/original/` before changing the implementation. I report this deviation rather than claiming the Git history proves otherwise. The original and final files are both present, distinct, and checked by O1. The checker reported 32/32 PASS and the submission validator reported 16/16 PASS on my machine, but these structural checks do not verify the historical order.

## 8. Evidence — real output

### 8.1 My suite, final run

The following is the real output from running `python -m unittest -v` against the prepared files in this environment. Re-run locally and replace if different.

```text
test_at_day_end (test_booking.BookingTests.test_at_day_end) ... ok
test_beyond_day (test_booking.BookingTests.test_beyond_day) ... ok
test_blocked (test_booking.BookingTests.test_blocked) ... ok
test_contains_existing (test_booking.BookingTests.test_contains_existing) ... ok
test_empty_bookings (test_booking.BookingTests.test_empty_bookings) ... ok
test_exactly_120_with_conflict (test_booking.BookingTests.test_exactly_120_with_conflict) ... ok
test_exactly_two_hours (test_booking.BookingTests.test_exactly_two_hours) ... ok
test_inside_existing (test_booking.BookingTests.test_inside_existing) ... ok
test_negative_start (test_booking.BookingTests.test_negative_start) ... ok
test_no_mutation (test_booking.BookingTests.test_no_mutation) ... ok
test_one_minute (test_booking.BookingTests.test_one_minute) ... ok
test_over_two_hours (test_booking.BookingTests.test_over_two_hours) ... ok
test_overlap_ends_at_existing_end (test_booking.BookingTests.test_overlap_ends_at_existing_end) ... ok
test_overlap_starts_at_existing_start (test_booking.BookingTests.test_overlap_starts_at_existing_start) ... ok
test_partial_overlap (test_booking.BookingTests.test_partial_overlap) ... ok
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
Ran 24 tests in 0.001s

OK
```

### 8.2 The checker, final run

The following is the complete output of my local Windows terminal run of `python tests/check_booking.py` on the `week-05` branch after commit `86fb437`. The checker reported 32 PASS, 0 FAIL and 0 ERROR.

```text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (12 lines)
PASS   S1   your suite has at least 11 tests            24 tests
PASS   S2   your suite is green on your own code        24 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_starts_now
PASS   M2   your tests catch a fault in AC1             caught by test_beyond_day
PASS   M3   your tests catch a fault in AC1             caught by test_zero_length
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_two_hours
PASS   M5   your tests catch a fault in AC3             caught by test_blocked
PASS   M6   your tests catch a fault in AC4             caught by test_no_mutation, test_several_no_overlap, test_touching_end_allowed and 1 more
PASS   M7   your tests catch a fault in AC4             caught by test_several_conflict_second
PASS   M8   your tests catch a fault in AC4             caught by test_contains_existing, test_exactly_120_with_conflict
PASS   M9   your tests catch a fault in AC5             caught by test_no_mutation
PASS   M10  your tests catch a fault in AC5             caught by test_no_mutation
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 2 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              5 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  24 tests listed
PASS   L5   report 5: debugging evidence                3 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 5 points judged
PASS   L7   report 7: change log                        2 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      169 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F2 F3 F4 F5 F6 F9 F10 - fails F1 F7 F8 - identical to your final: no
SUMMARY pass=32 fail=0 error=0   (32 checks)
Behaviour and shape are clean. This says nothing about the quality of your review.
```

### 8.3 Path B only — three faults I planted myself

Not applicable: Path A (Python).


## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

No checker FAIL or ERROR remains (32 PASS, 0 FAIL, 0 ERROR). **Process deviation:** `booking_v1.py` was not committed in `code/original/` until the second commit, so the requested initial-version Git order was not followed.

### 9.2 Outside the contract

The implementation has no dedicated non-integer validation. A floating-point `start=600.5` can be compared arithmetically and may return a Boolean. Passing `start="600"` raises `TypeError` during numeric comparison. This is acceptable for the specified contract because time arguments are integer minutes; this behavior is outside the required input domain. Declaration: **not-handled**.

### 9.3 A bound that never decides

The bound `0 <= start` in AC1 can never be the only rejection reason: `now >= 0` by contract and the required strict `start > now` already implies `start > 0`. Therefore a request with `start < 0` always fails `start > now` as well.


## 10. Conclusion (120–180 words)

The final overlap condition is `start < old_end and end > old_start`. Both comparisons must hold for two half-open intervals to overlap. Strict comparisons matter because a requested booking beginning exactly when another ends, or ending exactly when another begins, shares no minutes with it. The original version used inclusive comparisons, so it rejected those legitimate bookings. The touching-end tests exposed that problem; tests with only partial overlaps would not have detected it. A later test gap concerned AC5: checking that the list contained the same entries was insufficient unless their order was checked too. A faulty implementation could sort `existing` in place while still returning the right Boolean. I therefore used an intentionally unsorted list and compared it with a saved copy. One decision left outside the contract was how to handle non-integer times. I did not introduce additional validation, since the input contract guarantees integer minutes. The most useful lesson is that a test suite must evaluate side effects and boundary behavior, not just common return values.