# AI Usage Disclosure — Week 07

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT / Codex | GPT-6; exact deployed version not displayed | First test suite (Task 3) | suites/first/booking.test.ts, app/src/booking.test.ts, evidence/generation-* |
| ChatGPT / Codex | GPT-6; exact deployed version not displayed | Review and improvement prompt (Task 5) | app/src/booking.test.ts, evidence/improvement-*, evidence/pre-run-review.md |
| ChatGPT / Codex | GPT-6; exact deployed version not displayed | Extraction, setup, execution, mutation trials, report draft, declaration and packaging | app/src/booking.ts, app/src/App.tsx, app/package.json, app/package-lock.json, lab-report.md, submission.yml, evidence/*.txt, UI_CHECKLIST.md, AI_USAGE.md |

**I used an assistant to extract `canBook` (Task 1), or to fix a defect in it:** yes. The starter's conditions and ordering were moved into booking.ts; App.tsx now calls the export. No implementation rule was repaired. The first suite passed 17 tests; the final suite passed 20 and the production build succeeded. Browser equivalence was not verified.

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** no. The same ChatGPT/Codex session produced the plan, suites, review, and report. The prescribed prompts are recorded as applied instructions; a separate fresh chat was not used. The plan and reflection are AI-assisted drafts, not independent student writing.

**`suites/first/` holds the assistant's first test file exactly as it generated it:** yes.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes. Complete run output is also in evidence/. Screenshot evidence is absent rather than invented.

**Anything I accepted from the AI without fully understanding it:** I think yeah most of them.


Signed: <Yernur>
Date: 17.11.2026
