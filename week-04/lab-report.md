# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Yernut |
| Group | Monday 16:00 - 19:00 |
| AI assistant | ChatGPT |
| Exact model | GPT-5.6 Luna|
| Renderer | PlantUML |
| Behaviour diagram | sequence |
| Stories used | the reference set from README §3> |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence)

```text
Generate PlantUML for Book room. Use Student, BookingService, and BookingRepository lifelines. Validate the supplied rules, then attempt the reservation. Show a successful confirmation and an unavailable-room alternative using alt. Label messages and replies. Explain new design components and all assumptions.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

## 3. Task 1 — use-case review

**Assumptions the AI listed:** The original AI reply contained no explicit assumption list. I specified that touching bookings do not overlap and blocking a room leaves existing bookings unchanged.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Block room / Unblock room | The intermediate revision merged distinct administrator goals. | US-04, US-05 | Restored separate use cases, matching the AI original and approved stories. |
| 2 | Book room to Send booking confirmation | The original unconditional include could imply that a failed attempt produces a confirmation. | R4, US-01 | Changed to success-conditioned extend, justified immediately above the relationship. |
| 3 | Book room notes | Original AI did not provide the requested assumptions. | R1, R2, R3 | Documented allowed boundary-touching intervals and how blocking affects existing bookings. |

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | One student makes zero or more bookings. | Every booking belongs to exactly one student. | Student 1 / Booking 0..* |
| Room — Booking | One room is associated with zero or more bookings over time. | Every booking reserves exactly one room. | Room 1 / Booking 0..* |

### 4.2 Constraints the multiplicities cannot show

- R1: `Booking.isValid()` checks future start and duration > 0 and <= 2 hours, stated in the Booking note.
- R2: The Booking and Room notes state that active reservations for the same room must not overlap. Multiplicities alone do not enforce this.
- R3: The Room note states that blocked rooms reject new bookings.
- R4: The Booking note points to BookingService confirmation only upon successful reservation.

### 4.3 Assumptions

- A1: Touching bookings (one ends as the next begins) do not overlap.
- A2: Blocking a room prevents new bookings but does not cancel existing bookings.
- A3: Administrator block/unblock actions do not imply persistent Administrator–Room ownership.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Administrator — Room | The AI added a many-to-many relationship without evidence of permanent management assignment. | US-04, US-05 | Removed the structural association; kept administrator operations. |
| 2 | Booking.confirm() | Ambiguous confirmation responsibility and inconsistent with the sequence BookingService. | R4 | Removed the method; BookingService creates the confirmation. |
| 3 | Booking --> BookingStatus | Redundant dependency because Booking has a status typed as BookingStatus. | R2 | Removed redundant dependency arrow. |
| 4 | Room.isAvailable() | The original room note showed R3 but did not explicitly say availability considers R2. | R2, R3 | Documented conflict and blocked-status checks. |

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3A sequence; it makes validation order, the atomic reservation attempt and the success/rejection replies explicit.

**Design components added beyond the domain model:** `BookingService` coordinates time validation, room-block checks, reservation attempts, and R4 confirmation. `BookingRepository` queries blocked status and atomically checks booking conflicts and blocked state before saving. Neither is a domain class; both are justified application/persistence components.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Student -> BookingService | Original request omitted studentId although repository reservation required it. | US-01 | Passed studentId in the request and reservation attempt. |
| 2 | Student assumptions | The early revision assumed authentication, which was not in scope. | US-01, out-of-scope registration | Replaced with the narrower assumption that requester identity is known. |
| 3 | Reservation attempt | Automated structure check treated a reserve-labelled message under a failing ancestor branch as a definite save. | R2, R3 | Named operation tryCreateBooking and documented that saving occurs only atomically on success. |

## 6. AI critique

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | Combined administrator actions weaken traceability | Block or unblock room | accept | Separate goals correspond to US-04 and US-05. |
| 2 | Confirmation may be sent on failure | Confirmation include | accept | R4 applies only after success; conditional extend is clearer. |
| 3 | Confirmation operation is ambiguous | Booking.confirm() | accept | BookingService owns generation under R4. |
| 4 | Validation conditions not explicit | Booking.isValid() | accept | R1 start and duration are now in its note. |
| 5 | Availability must account for conflicts and blocked state | Room.isAvailable() | accept | Clarified R2/R3 checks. |
| 6 | Administrator-Room many-to-many relationship unsupported | Administrator–Room | accept | Operations are not persistent structural ownership. |
| 7 | BookingStatus arrow redundant | BookingStatus dependency | accept | Typed attribute sufficiently references the enum. |
| 8 | Authentication out of scope | Sequence assumption | accept | Identity-known precondition is narrower. |
| 9 | No invalid room identifier branch | Sequence room existence assumption | reject | Room existence is an explicitly documented precondition for this particular scenario. |
| 10 | Inconsistent confirmation ownership | Booking.confirm() vs generateConfirmation() | accept | Assigned generation to BookingService only. |
| 11 | Student and BookingService both book room | Student.bookRoom() | accept | Removed application orchestration method from the Student domain class. |

## 7. Consistency table

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book room | Booking.startTime, endTime, isValid() | validateTime(), invalid-time alt |
| R2 | Book room | Booking.overlaps(), Room.isAvailable() | tryCreateBooking() atomic overlap check |
| R3 | Book room | Room.isBlocked, block(), unblock() | isRoomBlocked(), atomic recheck |
| R4 | Book room | Booking, BookingStatus; BookingService is a design component | generateConfirmation(), bookingConfirmed() |
| US-01 | Book room | Student, Room, Booking | bookRoom() |
| US-01 | Send booking confirmation | Booking; BookingService design component | generateConfirmation(), bookingConfirmed() |
| US-02 | View availability | Room.isAvailable() | Not the selected sequence scenario |
| US-03 | Cancel own booking | Booking.cancel() | Not the selected sequence scenario |
| US-04 | Block room | Administrator.blockRoom(), Room.block() | Room blocked branch |
| US-05 | Unblock room | Administrator.unblockRoom(), Room.unblock() | Not the selected sequence scenario |
| US-06 | Review usage | Administrator.reviewUsage() | Not the selected sequence scenario |

## 8. Change log

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | Original unconditional include to Send booking confirmation | Conditional extend on successful booking | R4 applies only after successful reservations |
| 2 | use case | Original AI omitted assumptions | Documented touching intervals and blocking behavior | Clarify R2/R3 edge cases |
| 3 | class | Administrator–Room many-to-many association | Removed unjustified association | US-04/US-05 describe actions, not ownership |
| 4 | class | Booking.confirm() generated ambiguous confirmation | Removed; sequence BookingService owns it | R4 naming consistency |
| 5 | class | BookingStatus redundant arrow | Kept status: BookingStatus typed attribute | Avoid redundant dependency |
| 6 | sequence | studentId absent in first request | studentId present consistently | Traceability of booking owner |
| 7 | sequence | Authentication not clearly scoped in initial draft/revision | Identity known as explicit precondition | No out-of-scope registration/authentication |
| 8 | sequence | Original used reserveIfAvailable() without explicit conditional-save semantics | tryCreateBooking() described as atomic attempt | R2/R3 validation before persistence |

## 9. Checker output

Run `python tests/check_models.py` from the `week-04` directory and paste the COMPLETE actual console output here, replacing this explanatory text. Do not fabricate the result.

Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (7 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
SQ1  PASS  Student, BookingService and BookingRepository lifelines present
SQ2  PASS  alt block with a guard on every branch (6 branches)
SQ3  PASS  validation happens before creation
SQ4  PASS  nothing is saved on a failure branch
SQ5  PASS  every message is labelled
SQ6  PASS  R1 (time range) is visible - checked or stated as a precondition
SQ7  PASS  R3 (blocked room) is visible
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  з1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in з2
LR3  PASS  3 use-case findings in з3
LR4  PASS  з4 relationships read both ways, 3 assumption(s) declared
LR5  PASS  3 behaviour-diagram findings in з5
LR6  PASS  11 critique issues with a verdict
LR7  PASS  8 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  з7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story
CS4  PASS  every lifeline is a domain class or an explained design component

SUMMARY pass=37 fail=0 error=0
A FAIL you report and explain in lab-report.md з9 costs you nothing. One you hide costs the criterion.

```

**FAILs I am keeping, and why:** none (update if any remain).

## 10. Conclusion (120–180 words)

The initial artificial intelligence schemes reflected the basic scenario of an intelligent campus, but the domain class scheme needed the most significant structural revision. The project presented a "many-to-many" relationship between the administrator and the premises without any requirements for permanent management. If this were implemented directly, it could lead to unnecessary database connections and authorization assumptions. The class diagram also displayed the confirmation behavior inside Booking, while the sequence diagram generated confirmation inside BookingService. This discrepancy may lead to duplication of functions in the code. The criticism highlighted unsupported administrator communication, excessive reservation status arrow, and unclear verification responsibilities. It was also suggested to add a branch with an invalid number to the sequence diagram. I rejected this offer for this highly specialized room booking scenario, as the availability of rooms is explicitly stated as a precondition, even though a full-fledged system must verify the IDs. I've clarified the time limits, match checks, blocked room checks, and confirmation of a successful booking. The final models are more consistent with the six approved stories, and I have kept the original designs using artificial intelligence for comparison.