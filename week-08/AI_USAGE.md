# AI Usage Disclosure — Week 08

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT, fresh plain diagnostic context | GPT-6; exact deployed version not displayed | Diagnosis without the procedure (Task 4) | none — read only no-skill-prompt.txt and returned an answer |
| ChatGPT, fresh procedure-guided context | GPT-6; exact deployed version not displayed | Prompt-only bug-detector diagnosis (Task 5) | none — read only simulation-setup.txt and with-skill-prompt.txt and returned an answer |
| ChatGPT, coordinating context | GPT-6; exact deployed version not displayed | Baseline copy, hypothesis drafting, tests, exact skill text packaging, actual runs, review, fixes, report and declaration drafts | app/src/booking.ts, app/src/booking.test.ts, skills/bug-detector/SKILL.md, skills/bug-detector.zip, evidence/*, lab-report.md, AI_USAGE.md, submission.yml |

**`skills/bug-detector/SKILL.md` was typed by me from the deck's text, not generated:** no. The coordinating assistant reproduced the supplied text exactly and packaged it. The student must complete the hand-typing exercise and retain this preparation disclosure.

**I applied the patches myself, one minimal change per bug, after reviewing what the assistant
proposed:** no. The coordinating assistant added one line for BUG-A and removed one line for BUG-B in separate commits following the failed regression commit.
<!-- If an assistant edited app/ directly, say which change and how you reviewed it. -->

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes. Fresh isolated diagnostic contexts, I used Claude on the same inherited model, were used for the comparison; they did not inherit the coordinator's history. The plain context received only its prompt file. The procedure-guided context received the simulation setup and its prompt file. Both were instructed not to edit files.

<!-- If "yes": which one, the exact model, and for which section. -->

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes. Original complete outputs and exact diffs are preserved in evidence/. The diagnostic responses are preserved verbatim in separate files; the report explicitly separates response text from provenance notes. No screenshots were invented.

**I can explain both bugs and both fixes — which line, why it was wrong, which test proves the
fix — without the assistant:** yes

**Anything I accepted from the AI without fully understanding it:** If I didn't understand something, I would ask about it again until I understood everything completely.
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->

Signed: <Yernur>
Date: 16.11.2026
