# Week 10 — Lab report

**Name:**
**Group:**
**Date:**

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | ChatGPT|
| Exact model (with its version, or `not displayed`) | GPT 6 |
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) | Bolt.new & chat with pasted files|
| Starting point (`week-08` or `week-07`) | week-08 |
| Baseline commit — the checkpoint of Part 0 | 2bc1f68 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) |my computer|
| Vitest version (the `RUN  v…` line of a run) | 3.2.4 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-10/app/` before any change. **Exists:** `yes` or `no` (is there such a
script, or such a tool in `package.json`?). **Result:** `pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | Installed Vitest discovered 22 tests. |
| `npm test` | yes | pass | The test script ran those same 22 tests. |
| `npm run test:unit` | no | missing | npm reported Missing script. The playbook named this command. |
| `npm run build` | yes | pass | TypeScript compiled, then Vite built dist/index.html. |
| `npm run lint` | no | missing | npm reported Missing script. No ESLint dependency or configuration in app/. |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-10/app/`, before any change:

```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

 RUN  v3.2.4 /workspace/scratch/266377f4e4f8/wk10repo/week-10/app

 ✓ src/booking.test.ts (22 tests) 7ms

 Test Files  1 passed (1)
      Tests  22 passed (22)
   Start at  17:34:00
   Duration  513ms (transform 60ms, setup 0ms, collect 52ms, tests 7ms, environment 1ms, prepare 112ms)
```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

```text
Please read this "AGENTS.md" file that I attach, consider all requirements that written there. But before accomplishing this task provide me overview of your steps.
```

The assistant's answer, pasted unedited:

```text
I read the project-root `AGENTS.md`. The React + TypeScript page uses Vite. Booking logic lives in `src/booking.ts`, the page in `src/App.tsx`, and tests in `src/booking.test.ts`.

The file says `canBook` must reject requests with `start ≥ end`, requests in the past, durations over 120 minutes, blocked rooms, and overlaps including bookings that touch at an endpoint. It must return Available or Unavailable without changing booking data.

The exact test command listed is `npm run test:unit`. The other listed commands are `npm install`, `npm run dev`, and `npm run build`. The file also calls for checking that the page loads, using real KBTU timetable data, and running `npx netlify deploy --prod` after a successful build. It permits project edits, new packages, and optional Supabase persistence with login.

This was a read-only review. I made no edits, ran no project commands, accessed no portal data, and performed no deployment.
```

Which rules in its summary are wrong for this project, and how you know:

<!-- Write below this line -->

---

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

<!-- Write below this line -->

Git status showed no changes in app/ after the review.

What you sent, exactly (the deck's prompt):

```text
Analyze this Smart Campus Room Availability Check application WITHOUT modifying any files. List possible problems for correctness, security, privacy, reliability, maintainability, and agent execution. For each problem, list the exact source code line/missing test, describe the consequence, recommend how to confirm it, and note any uncertainties. Do not fabricate results.
```

The assistant's answer, pasted unedited:

```text
Static review only. I read the local files without editing them, running project code, or accessing external services. The checks below are proposed verification steps. No test or build results were observed.

| Area | Finding and impact | How to verify | Uncertainty |
|---|---|---|---|
| Correctness | `AGENTS.md:19` says touching endpoints overlap. `src/booking.ts:18` permits them, and `src/booking.test.ts:8–10,36–38` expects that behavior. The same answer can satisfy the tests and violate the written contract. | Ask the course owner to adjudicate both endpoint cases against an existing 600–660 booking. | The conflict is definite. The authoritative rule is unresolved within the app. |
| Correctness and trust | `src/App.tsx:22–23,47,60–64` uses an editable clock and checkbox. `check()` ignores `room.blocked`. A blocked fixture could appear available, and a student can set “now” earlier than the actual time. | Use a synthetic blocked room with the checkbox clear, then compare the same request under two clock settings. | Both supplied rooms are unblocked. Editable controls may be intentional for a simulator. |
| Reliability | `src/App.tsx:55–69` retains the previous result when inputs change. The page can display one room’s availability beside another room’s bookings. | Check B-204 for 10:15–10:45 at 09:00, then select A-101 without clicking Check again. | The stale state follows from the handlers. Browser behavior was not exercised. |
| Data integrity | `src/booking.ts:17–19` assumes valid existing intervals. `src/booking.test.ts:89–92` explicitly permits an Available answer with a reversed booking. Corrupt schedule data could therefore produce a misleading result. | Agree on the expected handling of malformed records and check it with synthetic intervals. | Current fixtures are valid. No external ingestion path was found. |
| Maintainability | `src/booking.ts:1–12` duplicates the request shape, `src/App.tsx:6` redeclares `Interval`, and `src/booking.ts:20` implies an update immediately before a plain `return true`. A maintainer could reintroduce mutation that violates AC5. | Compare the declarations and inspect both return paths. The existing AC5 regression at `src/booking.test.ts:100–105` checks an available request. | I found no current write to `bookings` in `canBook`. Type drift and future mutation are prospective risks. |
| Test operations | `AGENTS.md:26` specifies `npm run test:unit`. `package.json:6–10` defines only `npm test` for Vitest, so the documented command cannot select the suite. | Compare the script names. In an authorized execution environment, use `npm test`. | The manifest mismatch is definite. Suite status is unverified. |
| Privacy | `AGENTS.md:12` requests a real portal timetable. `src/App.tsx:9–12,71–72` embeds room schedules in client code and renders the selected room’s bookings. Substituting restricted records would make those records available to app recipients. | Inspect fixtures locally for real identifiers and confirm publication rights before introducing any real schedule. | The checked-in fixtures contain room labels and minute ranges. Their provenance is unknown. No personal records were observed. |
| Security and agent operations | `AGENTS.md:31–38` permits new packages, login, and persistence, then describes `npx netlify deploy --prod` as publishing a preview. Following that instruction with deployment credentials could change a production site. | Compare each proposed external action with task authorization and inspect the deployment flag without executing it. | The instruction is present. Credentials, target site, and access were not checked. |
```

### 3.2 Challenging the AI's claims

At least **five** claims from the answer, across at least **three** categories. **What I
inspected** is what you opened or ran yourself. **Label:** `confirmed`, `plausible` or
`unsupported`.

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | Endpoint rules disagree | Correctness | Compared provided/AGENTS.md, canBook’s strict inequalities and both AC4 endpoint tests. | confirmed | At end = booking.start or start = booking.end there is no overlap under the course contract. |
| 2 | Changing rooms retains the old result | Reliability | Drove Chromium with now 09:00 and request 10:15–10:45. B-204 showed Available. Switching to A-101 still showed Available until another click. | confirmed | A fresh check returned Unavailable for A-101, whose booking is 10:00–11:00. |
| 3 | The documented test script is missing | Agent operations | Compared app/package.json with the original playbook and actually ran both npm commands. | confirmed | The documented command returned a missing-script error. The supported command executed 22 tests. |
| 4 | Request types and a comment can mislead a maintainer | Maintainability | Compared BookingRequest with the inline parameter and inspected the line before return true. | confirmed | The type shape was duplicated. The comment described writing a booking although the function never wrote one. |
| 5 | Restricted timetable data could become visible | Privacy | Inspected the fixture literals and the selected-room booking list in App.tsx. | plausible | The client exposes its fixtures. Only room labels and times were observed, with no actual restricted record or portal access. |

---

## 4. Task 4 — the risk register

### 4.1 The register

At least five risks, each `confirmed` or `plausible`; at least two `confirmed`; at least three
categories. **Score = L × I.** **Component** is a path inside `app/` or `missing: <check>`.

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Agent operations | Playbook orders production publishing → an agent follows it after a build → a local change can go public. | AGENTS.md | Original Before you finish section explicitly invokes a production deploy. | confirmed | 3 | 3 | 9 | Remove external actions and require passing tests before acceptance. | Project owner | Compare the approved diff with the supplied file and rerun the audit. |
| R2 | Correctness | Missing integer checks → fractional minutes pass validation → the public function reports an invalid slot as available. | src/booking.ts canBook | Both fractional-start and fractional-end calls returned true in the red run in §7.1. | confirmed | 2 | 3 | 6 | Extract a pure request-window check and test each endpoint independently. | Booking maintainer | Run all Vitest cases including both R2 regressions and existing AC4 cases. |
| R3 | Reliability | Room or time changes → old result stays visible → user may rely on an answer for another request. | src/App.tsx | B-204 to A-101 retained Available until Check returned Unavailable for the same times. | confirmed | 3 | 2 | 6 | Require a fresh check after edits in the supervised demo. Clear stale results before general use. | UI maintainer | Repeat the switch case and require cleared or recalculated feedback before release. |
| R4 | Maintainability | Repeated request types and stale comment → edits diverge → maintenance or diagnosis takes longer. | src/booking.ts | The checkpoint repeats BookingRequest fields inline and implies a write immediately before return true. | confirmed | 2 | 1 | 2 | Reuse BookingRequest and remove the misleading write comment during the small refactor. | Booking maintainer | Inspect the code diff and run the type check through the build. |
| R5 | Privacy | Instructions request real timetable data → a contributor substitutes restricted records → the bundle exposes them to its readers. | src/App.tsx | Client renders embedded room/time pairs. No live feed or personal records were observed. | plausible | 1 | 3 | 3 | Keep the local fixtures synthetic and inspect fixture changes in review. | Project owner | Review room constants and their provenance before accepting future updates. |

### 4.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R1** — 3 × 3. The playbook explicitly instructed every successful build to publish. With suitable credentials, one routine run could change a public site.
2. **R2** — 2 × 3. Both invalid numeric calls returned Available. The time picker limits exposure, but any caller of the exported function can pass a fraction and rely on a false availability decision. R3 ties at six. R2 was chosen because two isolated regression cases can guard every caller.

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

`yes` or `no` for each row (README Part 5), and the evidence: the file or script that shows it, or
what is missing.

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | No Prettier configuration or dependency. |
| 1b | Linter | no | No ESLint configuration, dependency or lint script. |
| 1c | Type checks | yes | tsconfig.json and typescript in package.json. The build runs tsc. |
| 1d | Unit tests | yes | src/booking.test.ts imports Vitest, which is in package.json. |
| 1e | Pinned dependencies (lockfile) | yes | package-lock.json is committed. |
| 2a | `.env.example` | no | No example environment file in app/. |
| 2b | Architecture notes | no | No app README or separate architecture note. AGENTS.md gives a short file map. |
| 2c | `AGENTS.md` | yes | app/AGENTS.md exists at the project root. |
| 3a | CI | no | No push workflow in the checkpoint. |
| 3b | Pre-commit hooks | no | No hook configuration or hook package in app/. |
| 3c | Integration checks | no | At the checkpoint only the booking module was under test. The final tests exercise its new helper through canBook. |
| 3d | Reviewable evidence | no | No checkpoint workflow artifact or PR template in app/ requiring attached test output. |

### 5.2 The level and the gaps

**Level:** 0

**Missing evidence for the next level:**

<!-- Name the rows and what would have to exist. Then one or two lines on the README's accuracy
     and the folder layout. -->
- Level 1 is 3/5 (60%). A configuration of either a formatter (1a) or a linter (1b) would raise its status to 4/5.

---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

The assistant's answer, pasted unedited:

```text
`AGENTS.md` was the only project documentation I found in the app directory. It requests real KBTU data (`:12`), permits a database and login (`:33`), and directs a production deployment (`:38`). It omits the one-room limit, a secrets rule, AC6, and the requirement to run tests before proposing acceptance. Its test command (`:26`) also differs from the `npm test` script identified in the earlier manifest review.

The local AC4 summary says touching endpoints conflict. The earlier review found that the tests expect those requests to be available. The approved AC1–AC6 wording is absent from the reviewed documentation, so the draft references the approved contract and requires resolving discrepancies before acceptance.

**Proposed patch, pending approval**

```diff
--- a/AGENTS.md
+++ b/AGENTS.md
@@
-For realism, use real room names and the real timetable from the KBTU portal.
+Use exactly one fictional room and a synthetic timetable. Do not access the KBTU portal.
+Keep the app local, with no login, database, or secrets.
@@
-- AC1 Reject start ≥ end and requests in the past.
-- AC2 Enforce the maximum allowed duration (120 minutes).
-- AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
-- AC5 Return Available / Unavailable without changing booking data.
+Preserve the approved AC1–AC6 in full. If the contract is unavailable or a test
+conflicts with it, obtain the approved wording before changing expected behavior.
@@
-- Tests: `npm run test:unit`
+- Tests: `npm test`
@@
-- If bookings need to persist, add a small Supabase table and a login page.
@@
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test` before proposing acceptance and report the observed result.
+- Do not deploy externally, including preview or production deployments.
```


### 6.2 Findings and my decisions

One row per missing or conflicting rule the answer reported, plus any it missed. **Decision:**
`approve`, `reject` or `modify`.

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | Real portal timetable | C1 conflicts with synthetic data and omits the one-room limit. | approve | Use one fictional room and synthetic bookings in the instructions. |
| 2 | Supabase table and login | C2 permits unnecessary persistence and authentication. | approve | The local checker needs neither capability. |
| 3 | No secrets rule | C4 is missing. | approve | State explicitly that an agent must never use or share secrets. |
| 4 | AC1–AC6 | AC4 contradicts touching-endpoint tests and AC6 is absent. | modify | Keep the individual criteria, correct AC4 and add desktop/mobile feedback instead of referencing an unspecified contract. |

### 6.3 The approved patch

`git diff app/AGENTS.md`, after you applied only what you approved:

```text
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..8757663 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,31 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room with synthetic bookings. Do not use real timetable data.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at an endpoint.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
 
-- Edit any file in the project.
+- Edit only files required by the approved task.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add a login or database. Never use or share secrets.
 
 ## Before you finish
 
-- Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Check the page and run npm test; all tests must pass before proposing acceptance.
+- Do not deploy externally or publish previews.
```

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R2**. The real run, with the new test failing:

```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

 RUN  v3.2.4 /workspace/scratch/266377f4e4f8/wk10repo/week-10/app

 ❯ src/booking.test.ts (24 tests | 2 failed) 32ms
   ✓ T01 AC4: 660 is the existing end; sharing that endpoint uses no booked minute. 1ms
   ✓ T02 AC1: 540 equals now, but the start must be strictly later. 0ms
   ✓ T03 AC1: Equal endpoints give zero duration rather than start before end. 0ms
   ✓ T04 AC1: 750 is later than 720, so the interval is reversed. 0ms
   ✓ T05 AC1: 1441 is one minute beyond the allowed end of the day. 1ms
   ✓ T06 AC2: 840 minus 720 is exactly 120; only longer durations are rejected. 1ms
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
   ✓ BUG-A AC4: a 90-minute request fits between two touching bookings 0ms
   ✓ BUG-B AC5: a non-touching Available request leaves bookings unchanged 6ms
   × R2 AC1: a fractional end cannot represent a whole-minute booking 18ms
     → expected true to be false // Object.is equality
   × R2 AC1: a fractional start cannot represent a whole-minute booking 1ms
     → expected true to be false // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > R2 AC1: a fractional end cannot represent a whole-minute booking
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.ts:108:87
    106| 
    107| test('R2 AC1: a fractional end cannot represent a whole-minute booking…
    108|   expect(canBook({ start: 660, end: 720.5, now: 540, blocked: false, b…
       |                                                                                       ^
    109| });
    110| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/booking.test.ts > R2 AC1: a fractional start cannot represent a whole-minute booking
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.ts:112:87
    110| 
    111| test('R2 AC1: a fractional start cannot represent a whole-minute booki…
    112|   expect(canBook({ start: 660.5, end: 720, now: 540, blocked: false, b…
       |                                                                                       ^
    113| });
    114| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed | 22 passed (24)
   Start at  17:37:14
   Duration  589ms (transform 71ms, setup 0ms, collect 61ms, tests 32ms, environment 0ms, prepare 121ms)
```

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | 1000 × 780 | With A-101 booked 10:00–11:00, entered 11:00–12:00 and pressed Check. | Available. Touching endpoints were accepted. | `evidence/ui-desktop.png` |
| Mobile | 375 × 812 | Set the room blocked and checked at phone width. | Unavailable. Document width measured 375 px with no horizontal overflow. | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

<!-- Name each one and why. "None" only if it is true. -->
- Earlier I did not checked some units where attemted and both scripts were missing, I recognized it after deploying.

---

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R1

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
(the refactor prompt, if this is the refactor)
```

**Problem → pattern → benefit:**

**What I rejected from the agent's patch, and why:**

The diff I approved (`git diff`):

```text
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..8757663 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,31 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room with synthetic bookings. Do not use real timetable data.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at an endpoint.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
 
-- Edit any file in the project.
+- Edit only files required by the approved task.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add a login or database. Never use or share secrets.
 
 ## Before you finish
 
-- Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Check the page and run npm test; all tests must pass before proposing acceptance.
+- Do not deploy externally or publish previews.
```

### 8.2 The second mitigation

**Risk:** R2

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
Move the availability-related logic into a minimalistic pure module without altering any functionality of the function and UI. Consider a design pattern only when there is a design issue in the program. Do not extend the functionality and do not include any other dependencies.
```

**Problem → pattern → benefit:** The booking loop combined schedule examination with candidate time interval validation and failed to consider the minute-long contract.

**What I rejected from the agent's patch, and why:** Revised the proposal to ensure all checks remain inline.

The diff I approved (`git diff`):

```text
diff --git a/week-10/app/src/booking.ts b/week-10/app/src/booking.ts
index 51d84ca..0b815cc 100644
--- a/week-10/app/src/booking.ts
+++ b/week-10/app/src/booking.ts
@@ -1,22 +1,15 @@
+import { validRequestWindow } from './requestWindow';
+
 export type Interval = { start: number; end: number };
 export type BookingRequest = {
   start: number; end: number; now: number; blocked: boolean; bookings: Interval[];
 };
 
-export function canBook({ start, end, now, blocked, bookings }: {
-  start: number;
-  end: number;
-  now: number;
-  blocked: boolean;
-  bookings: { start: number; end: number }[];
-}): boolean {
-  if (!(0 <= start && start < end && end <= 1440)) return false;
-  if (!(start > now)) return false;
-  if (end - start > 120) return false;
+export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
+  if (!validRequestWindow(start, end, now)) return false;
   if (blocked) return false;
   for (const b of bookings) {
     if (start < b.end && end > b.start) return false;
   }
-  // keep the room's list current with the slot that was just found free
   return true;
 }
diff --git a/week-10/app/src/requestWindow.ts b/week-10/app/src/requestWindow.ts
new file mode 100644
index 0000000..bf475d1
--- /dev/null
+++ b/week-10/app/src/requestWindow.ts
@@ -0,0 +1,6 @@
+// Candidate times are whole minutes on one day, with 1440 allowed as the end.
+export function validRequestWindow(start: number, end: number, now: number): boolean {
+  return Number.isInteger(start) && Number.isInteger(end)
+    && start >= 0 && start < end && end <= 1440
+    && start > now && end - start <= 120;
+}
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 3 | 3 | 9 | 1 | 3 | 3 | The patch removes the publish command and adds an acceptance gate. Consequences of a manual external action remain serious. |
| R2 | 2 | 3 | 6 | 1 | 2 | 2 | The two failing integer cases now pass, and the build preserves the public API. Residual exposure is limited to future changes or callers bypassing validation. |

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text
npm warn Unknown env config "http-proxy". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.

 RUN  v3.2.4 /workspace/scratch/266377f4e4f8/wk10repo/week-10/app

 ✓ src/booking.test.ts (24 tests) 9ms

 Test Files  1 passed (1)
      Tests  24 passed (24)
   Start at  17:37:16
   Duration  570ms (transform 95ms, setup 0ms, collect 97ms, tests 9ms, environment 0ms, prepare 122ms)
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

Rules for an agent working asynchronously on a separate branch. Be specific to this project: name
its files and its commands.

| Rule | What I require |
| --- | --- |
| Isolation | Work in a fresh worktree on a task branch from the reviewed checkpoint, with no deployment credentials. |
| Permitted files | Limit a booking task to src/booking.ts, src/requestWindow.ts and src/booking.test.ts. Request human review before widening the diff. |
| Commands | From week-10/app run npm ci, npm test and npm run build. Record the outputs and exit status. |
| Prohibited actions | No real timetable access, login, database, external deployment, secrets, force-push or direct updates to main. |
| Required evidence | Attach the focused diff, red and green test output, build result, affected risk scores and a review note. |
| Before merging or deploying | A human must review tests and the focused diff. Keep this grading PR open. The lab permits local use only. |

### 9.2 Optional — the deck's checklist prompt (not graded)

<!-- If you sent it: the answer, and one thing it has that your rules in 9.1 do not, or the reverse. -->

### 9.3 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

---

## 10. Release decision and conclusion

**Decision:** CONDITIONAL

<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words, in your own words, without the assistant: why this decision, from the
     register, the tests and what you are still unsure about. Name at least two risk IDs.
     Worthless: "The project is mostly fine, so GO."
     Worth everything: "CONDITIONAL. R2 (the deploy line in AGENTS.md, 3 x 3 = 9) is closed by the
     approved patch, now 1 x 3. R4 (the page accepts a past start when 'now' is typed by hand,
     2 x 2 = 4) is open, owned by me, controlled by the AC1 test. The UI was checked at two widths,
     but no test covers App.tsx, so a regression there would be invisible." -->

<!-- Write your conclusion below this line -->

I would use room checker to demonstrate in class under the guidance of a teacher. The R1 score dropped from 9 to 3 after the production deployment team was removed from the playbook and tests had to be completed before acceptance. The R2 score dropped from 6 to 2 after the booking function started rejecting requests for a few minutes. Both new tests were not completed before the fix, and all 24 were completed later. The value of R3 remains 6, because when switching from B-204 to A-101, the message “Available” may remain on the screen, even if A-101 is booked. During the demo, I clicked the Check button after each change. Before using it more widely, I would clear the old result when changing the input data and add a browser test for this room switching.
