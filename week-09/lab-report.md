# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:** Yernur
**Student ID:** 25B032075
**GitHub:** amanqoss

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | ChatGPT |
| Exact model (or "not displayed") | GPT 6 |
| Three fresh chats for R1, R2, R3? (yes / no) | yes, separate conversations with no inherited history |
| Python version (`python --version`) | 3.12.14 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Check whether the requested room is available for the given interval using the supplied current time, blocked status and existing bookings. Express all times as whole minutes since midnight from 0 to 1440 inclusive. This tool does not save or create a booking.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {"type": "integer", "minimum": 0, "maximum": 1440},
      "end": {"type": "integer", "minimum": 0, "maximum": 1440},
      "now": {"type": "integer", "minimum": 0, "maximum": 1440},
      "blocked": {"type": "boolean"},
      "bookings": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "start": {"type": "integer", "minimum": 0, "maximum": 1440},
            "end": {"type": "integer", "minimum": 0, "maximum": 1440}
          },
          "required": ["start", "end"],
          "additionalProperties": false
        }
      }
    },
    "required": ["start", "end", "now", "blocked", "bookings"],
    "additionalProperties": false
  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| Request | Object | A scalar or ordered list cannot identify five named arguments. |
| Request | Require start, end, now, blocked and bookings | A missing current time or schedule would force the client to guess. An explicit empty list represents a known empty schedule. |
| Request | additionalProperties false | A misspelled or unsupported argument such as room could be silently ignored. |
| start, end, now and both booking endpoints | Integer | A clock string or fractional minute would not follow the function’s numeric convention. |
| All time fields | Minimum 0 | Negative minutes describe a time before this day. |
| All time fields | Maximum 1440 inclusive | End-of-day 24:00 stays valid, while values past the day are refused. |
| blocked | Boolean | The string "false" can be treated as truthy by application code. |
| bookings | Array | Each booking must be available for a separate overlap check. |
| bookings items | Object | A pair such as [660,720] lacks the named start and end fields. |
| bookings items | Require start and end | An open-ended record cannot supply both overlap comparisons. |
| bookings items | additionalProperties false | A nested typo or extra field should be reported at the booking where it occurs. |


## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | No change. |
| S02 | PASS | PASS | No change. |
| S03 | PASS | PASS | No change. |
| S04 | PASS | PASS | No change. |
| S05 | PASS | PASS | No change. |
| S06 | PASS | PASS | No change. |
| S07 | PASS | PASS | No change. |
| S08 | PASS | PASS | No change. |
| S09 | PASS | PASS | No change. |
| S10 | PASS | PASS | No change. |
| S11 | PASS | PASS | No change. |
| S12 | PASS | PASS | No change. |

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name":"check_room","arguments":{"start":600,"end":660,"now":540,"blocked":false,"bookings":[{"start":660,"end":720}]}}
```

<!-- Match? If F3 failed, which argument differs, and who was wrong: the model or the request? -->
All arguments match.

### R2

```text
{"name":"check_room","arguments":{"start":840,"end":990,"now":810,"blocked":true,"bookings":[]}}
```

<!-- Same. R2 is a call that SHOULD be made, although canBook will say Unavailable. Did the model refuse to call? -->
13:30 is 810, 14:00 is 840, and 16:30 is 990.

### R3

```text
What exact two-hour slot tomorrow afternoon should I check, what time is it now, is the room blocked, and what bookings does it already have tomorrow?
```

The model asked one question and gave no invented values. It took “a couple” as two hours and then asked about the specific slot, time now, whether it was blocked, and tomorrow’s reservations. Calendar date is not among the five fields of this tool.

<!-- What information was missing? Did the model ask, or call? If it called, which values did it invent, and from where? -->

## 5. What the schema cannot check

<!-- Name the acceptance criteria (AC1-AC6, README section 3) that a JSON Schema with the allowed keywords cannot
     enforce, and say why for each. At least two, by their AC number. Which part of AC1 CAN the schema enforce? -->

AC1: Field schemas guarantee integer units and individual boundaries, although matching endpoints need to be checked at function level for the comparison between start, end, and now.AC2: Checks duration through calculation of (end – start) and verification against 120.AC3: Takes legitimate inputs and outputs Unavailable in case the blocked input is true.AC4: Matches the requested interval with the stored intervals and allows overlapping endpoints.AC5: Outputs the availability decision without altering the bookings already present.AC6: Provides legible output on the results page.

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | The user supplied the data for a read-only availability check. It does not reserve the room. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading this specific source file verifies the booking rules without changing repository state. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | block | A three-hour request does not authorize changing AC2 for everyone. |
| A4 | run `npm test` in `week-08/app` | allow | The known Week 08 test script runs the local regression suite. Review a changed script before executing it. |
| A5 | run `git reset --hard` to undo its own last three edits | block | A hard reset could discard the student’s intervening tracked edits along with the agent’s work. |
| A6 | `git commit` its change on the `week-09` branch | ask | Review the staged diff and branch first so unrelated files do not become part of the commit. |
| A7 | `git push` to `main` | block | Pushing to main bypasses the required review on the week-09 pull request. |
| A8 | send the contents of `.env` to an MCP server it found online | block | The external server has no need for credentials to evaluate a fictional room schedule. |

## 7. Checkpoint

<!-- The commit you would make before letting such an agent edit anything: its real SHA (git log --oneline),
     the exact command that returns you to it, and what that command would throw away. -->

**Checkpoint** `fd5545d` titled “week-09: checkpoint the provided lab before defining the tool” holds the pristine version of the handout in this repository. The recovery command would be `git reset --hard fd5545d` while in week-09. It will take the branch head back to that commit and also reset the index and working directory files, removing uncommitted tracked modifications as well as removing future commits from this branch’s history.

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls/r1.json: a call to check_room
PASS  F2    calls/r1.json: arguments valid against your schema
PASS  F3    calls/r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls/r2.json: a call to check_room
PASS  F5    calls/r2.json: arguments valid against your schema
PASS  F6    calls/r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.
```

## 9. What still fails

<!-- Every check in submission.yml known_fails, with the reason. "None" if all 30 pass. -->
- **L5** — The disclosure records the AI contributions.

## 10. Conclusion (80–150 words)

<!-- What did you learn about the line between the schema, the model and the function? Be specific:
     name a case, a request or an action. "Tool definitions are important" is worth nothing. -->

This demonstrates the significance of the endpoint rule, where the end of the requested interval is exactly at 660 minutes, the moment the current booking starts. All three intervals satisfy the schema criteria, and the booking function will allow both of them since they do not have any shared minutes. R2 also satisfies the schema criteria, but the room is reserved, and the length of the requested interval is 150 minutes. The client will be able to make the call, but return the response “Unavailable”. It is another restriction that has been found through R3: the validator will be able to check the absence of the start time but not whether it was made up.