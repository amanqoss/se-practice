# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the word counter. Delete them or leave them.
-->

**Topic:** 1.10

---

## 1. Scenario

**Question:** For a hypothetical university drone that inspects building roofs after storms, what privacy, safety, and accountability challenges arise, which AI-generated suggestions should be challenged, and what safeguards are justified?

**Users:** University facilities staff who need inspection images, a trained drone operator, campus safety and data-protection staff, and students, employees, and visitors who could be affected by flights.

**Problem:** Checking roof damage manually can expose maintenance workers to heights and unstable surfaces. A camera-equipped drone could help staff inspect roofs from a safer position, but its flight and recordings could also affect people who did not request the inspection.

**Constraints:** First, flights are limited to approved roofs and scheduled periods after severe weather has ended; the operator must be able to cancel or land whenever conditions are unsafe. Second, cameras are used only for roof inspection, not identification or routine surveillance, and captured material is accessible only to authorized staff for a limited period.

**Risk:** A navigation, battery, or operator failure could injure a person or damage property. The drone might also record students, windows, or private activities incidentally, while unclear roles could make an incident difficult to investigate.

**Assumptions:** The university, buildings, drone service, flight plan, and policies are fictional. The drone carries a visual camera, flies under direct human supervision, and is used for occasional post-storm inspections rather than continuous monitoring. No actual aviation approval, legal compliance assessment, flight test, or privacy audit has been completed.

## 2. Analysis

Software-controlled drones can improve inspection work, but their benefits depend on the people affected as well as technical performance. For the fictional university, the goal is narrow: collect images of potentially damaged roofs after a storm without sending workers onto hazardous surfaces unnecessarily. The decision to fly should be based on whether a drone is safer and more proportionate than alternatives such as inspecting from the ground or postponing the task. An AI assistant can identify candidate safeguards, but it cannot establish that they are adequate merely by describing them confidently.

Privacy is the first social challenge. A roof-inspection camera could capture faces, windows, or activities unrelated to maintenance. My proposed safeguards are to define approved roof-only views, disable audio and facial recognition, avoid filming occupied areas, and notify the campus community about inspection periods and a contact point for complaints. Images should be encrypted, accessible by named facilities staff, and deleted after a proposed seven-day review period unless a documented repair or incident requires selected evidence to be retained longer. Seven days is a policy proposal, not a legal standard: the university would need to assess whether it is necessary and permitted. Camera angles and selective deletion protect privacy more reliably than assuming automated face blurring will catch everything.

Safety requires controls before, during, and after flight. A trained, formally authorized operator should check weather, battery health, propellers, communication links, the launch area, and the planned route. The university should keep people away from takeoff and landing zones, avoid flights over occupied walkways, establish a flight boundary, and require the operator to maintain visual oversight and the ability to abort. Geofencing and automatic return functions may help, but software can fail or behave unexpectedly; they are backup controls, not permission to fly unattended. Unsafe weather or an inability to separate the route from bystanders should lead to postponement or a non-drone inspection.

Accountability means knowing who approves flights, who operates the aircraft, who manages recordings, and who responds if harm occurs. The facilities manager should authorize the mission and its purpose; the operator should record preflight checks, flight times, route changes, and problems; the designated privacy officer should oversee access and deletion rules. A university incident procedure should preserve relevant evidence, notify affected parties through appropriate channels, investigate failures, and assign corrective actions. Hiring a drone vendor should not leave the university's responsibilities undefined.

AI suggestions must be critically assessed. Broad recording "for future usefulness" would collect information beyond the inspection purpose; full autonomy would weaken the chosen human-oversight safeguard; and saying that face blurring or geofencing "guarantees" protection would overstate untested tools. A limited pilot could test image framing, emergency landing procedures, access controls, and record deletion. Official local flight and privacy requirements would still need checking before any real operation. These safeguards impose time and costs, but the narrower system is easier to justify publicly and audit when something goes wrong.

## 3. Review

The illustrative Prompt B critique in Appendix B challenges ten weaknesses in the initial AI-style draft. I accept its central concern: a possible safety benefit does not justify collecting broad video of an entire campus. The final analysis limits the mission to specified roofs, rejects routine identification, and requires notice to people who may be affected. I also accept that automatic face blurring is not a complete privacy safeguard; some people or private activities could remain identifiable from context, so capture limits and controlled access must come first.

I accept the concerns about autonomy, weather, people below the route, and emergency response. A geofence cannot prove that the aircraft is safe, and a return-to-home feature could itself become unsafe if its path crosses an occupied area. That is why the revised proposal keeps an authorized operator in control, requires preflight decisions, establishes exclusion areas, and permits cancellation. I accept the critique that keeping all footage for an arbitrary period has no adequate justification. A seven-day default is offered only as a starting policy to review, with documented exceptions rather than permanent storage.

I also accept the accountability concerns. The revised plan names university roles for mission authorization, operation, data handling, and incident review rather than assuming a technology supplier takes responsibility for every outcome. Finally, I qualify the claim that drone inspection is inherently safer or cheaper: avoiding a roof climb may reduce one hazard while introducing aviation and privacy risks. Without testing, cost estimates, and a comparison with ground-based methods, its overall benefit remains unproven.

The student-provided Topic 1.10 description establishes the assignment focus. No aircraft, legislation, local university policy, or technical safeguards were independently tested in this report. The revision therefore makes recommendations and verification needs explicit rather than presenting an imagined deployment as evidence.

## 4. Conclusion

For a hypothetical post-storm rooftop-inspection drone, I recommend a narrowly defined purpose, minimized image capture, restricted access and retention, supervised operations, and an accountable chain of human decisions. A drone should be deployed only if its specific inspection benefit outweighs its privacy and flight risks compared with available alternatives. Flight boundaries, operator checks, emergency procedures, community notice, and incident logs are justified because each addresses a foreseeable way the system could cause harm.

The strongest lesson is that AI-generated safety suggestions are starting points, not guarantees. The university would still need to evaluate local requirements, test the equipment, review privacy impacts, and document who is responsible. Until then, this remains a conceptual proposal rather than a proven safe or lawful system.

## 5. Reflection

Changing the report to software-controlled drones made the relationship between engineering and social responsibility more visible to me. A system can perform its technical task—taking useful roof photographs—while still creating unacceptable risks for bystanders or collecting information without a clear purpose.

The AI-assisted drafts helped organize the ideas quickly, especially the distinction between privacy, safety, and accountability. However, the critique showed why plausible recommendations such as face blurring, autonomous routes, and long-term storage need evidence and careful limits. It was useful to turn these broad suggestions into specific decisions: who authorizes a flight, what the camera may capture, when a flight must stop, and when footage is deleted.

I also learned to distinguish a proposed safeguard from a verified result. I have not tested a drone, assessed a real campus, or checked the local regulatory requirements. In future work, I would compare the drone with non-drone alternatives, consult the relevant official guidance, and seek feedback from people affected by the operation before deciding that a deployment is justified.

## 6. References

- Student-provided course topic list, item 1.10, "Software-controlled drones: Discuss social challenges of drone systems, including privacy, safety and accountability. Critique AI suggestions and justify safeguards for one hypothetical use," provided 18 October 2026.
- KBTU SITE, SIS #01 — Software Engineering Fundamentals, With an AI in the Loop, README.md (listed in the previous report; section locations and assignment requirements should be rechecked by the student before submission).
- KBTU SITE, SIS #01 Handout (listed in the previous report; not reopened or independently verified in this topic revision).

No external aviation or privacy authority is cited as verified evidence. Applicable rules and technical specifications must be researched before a real deployment.

## 7. Appendix A — Initial outline

1. AI-assisted outline for the topic revision (not an independently prepared pre-Prompt-A outline): choose one hypothetical use—post-storm university rooftop inspection.
2. Identify affected groups and separate potential safety benefits from privacy and flight hazards.
3. Propose purpose limitation, narrow camera views, controlled access, retention limits, and community notice.
4. Propose supervised operations, preflight checks, exclusion areas, emergency response, and named responsibilities.
5. Critique attractive but unproven AI recommendations and identify evidence required before real use.

## 8. Appendix B — AI exchanges

<!--
  Academic-integrity note: The following are newly constructed Prompt A/B/C working
  artifacts for the requested topic change, not verbatim transcripts of three
  earlier separate ChatGPT sessions. They should be replaced or confirmed with
  actual prompt/response logs if the assignment requires exact AI exchanges.
  The earlier topic 1.6 exchanges remain part of the prior file version.
-->

### B1 — Draft (Prompt A)

- **Tool:** ChatGPT (illustrative working artifact generated during this revision)
- **Model:** GPT-6
- **Date:** 2026-10-18
- **Purpose:** explore an initial, deliberately reviewable answer for Topic 1.10
- **Status:** Proposed prompt and illustrative response, not an independently executed historical exchange

**Prompt:**

~~~~text
Act as a software engineering tutor. Draft a 400–500 word first-year-level
analysis of Topic 1.10, software-controlled drones. Use one fictional case:
a university considers camera-equipped drones to inspect rooftops after a
storm. Discuss social challenges of privacy, safety, and accountability.
Suggest benefits, risks, and possible safeguards. Clearly state assumptions.
Do not invent laws, flight-test results, source quotations, or citations.
Leave decisions open for a later critical review.
~~~~

**Response:**

~~~~text
# Topic 1.10 — Software-Controlled Drones: Campus Roof Inspection

A fictional university wants to use a drone to inspect roofs after storms.
Drone cameras could make inspections faster and might reduce the need for
workers to climb damaged structures. The system would take photographs,
locate visible damage, and send images to facilities staff. Its benefits
would need to be balanced against social consequences.

Privacy is one major issue. The drone may capture students and staff while
photographing roofs. One possible AI-assisted solution is to blur people's
faces automatically. The university could also collect wide-angle footage
to help an operator understand the surrounding area. Retaining all videos
for 30 days might assist later reviews, although the appropriate period has
not been determined. These choices would require privacy assessment.

Safety is another challenge. Drone flights might fail because of weather,
battery problems, obstacles, communication loss, or mistakes. A planned
route, software geofence, obstacle detection, and automatic return function
could improve flight management. Some missions might eventually be
automated, although whether autonomy is acceptable is an open question.
Staff would need to consider the danger to people below the route.

Accountability matters if the drone damages property, injures someone, or
records information that should have remained private. The university
could contract a specialist operator and retain mission logs. It should
determine which tasks belong to facilities staff, the operator, and the
technology vendor. People affected by a flight should know whom to contact.

The system may also raise broader questions. Students may feel watched even
if roof inspection is the stated purpose. Regular flight noise can disrupt
campus activity, while high equipment and training costs may compete with
other maintenance needs. Drone use should have a clear justification rather
than being adopted only because the technology is available.

An initial rollout could involve one roof, supervised flight planning,
maintenance checks, and a review of photographs. The university would
still need to verify applicable aviation and privacy requirements and
compare the drone with inspections performed from the ground. The proposal
is fictional, so none of these safeguards or benefits has been tested.
~~~~

### B2 — Critique (Prompt B)

- **Tool:** ChatGPT (illustrative working artifact generated during this revision)
- **Model:** GPT-6
- **Date:** 2026-10-18
- **Purpose:** challenge the Prompt A draft before revising it
- **Status:** Proposed prompt and illustrative response, not an independently executed historical exchange

**Prompt:**

~~~~text
Critically review the full Prompt A response directly above about the
university rooftop-inspection drone. Identify weak reasoning, unsupported
claims, missing stakeholders, and AI-suggested safeguards that might fail.
For each concern, explain why it matters, provide a counterexample or
alternative, and say how it could be checked. Focus on privacy, safety,
accountability, and whether drone use is necessary. Do not rewrite yet.
~~~~

**Response:**

~~~~text
# Critical review — Topic 1.10

1. Purpose and necessity
   The draft states a potential benefit but does not compare with a ladder-free
   ground camera or postponing inspection. Check whether the chosen roofs
   actually require aerial access before approving a drone.

2. Recording scope
   Wide-angle video could record students, windows, and routines that have
   nothing to do with roofs. Test restricted camera angles and short,
   task-specific capture instead of gathering everything.

3. Face blurring
   Automated blur can miss faces, and clothing or location can identify a
   person even if the face is hidden. Check sample footage manually; minimize
   collection before considering post-processing.

4. Retention and access
   Thirty days is arbitrary. Long storage increases exposure after a breach.
   Define who needs each image, set a justified deletion period, and audit
   access rather than retaining all footage by default.

5. Autonomy and human control
   A preprogrammed route does not resolve unforeseen obstacles. A drone might
   approach an occupied courtyard. Define an authorized operator, visual
   oversight, and an immediate abort process.

6. Technical safeguards
   A geofence and return-to-home setting can fail or choose an unsafe path.
   Test their actual behavior and treat them as backups rather than guarantees.

7. Conditions and bystanders
   The draft does not specify weather checks, maintenance, takeoff zones, or
   pedestrian exclusion areas. An apparently clear rooftop can still overlook
   a busy walkway. Require a site-specific preflight plan.

8. Accountability
   Hiring a vendor does not identify who approves the mission or handles an
   incident. Assign university and operator responsibilities in writing,
   with logs, escalation steps, and an incident-review procedure.

9. Community trust and redress
   Students who notice a camera overhead may assume surveillance. Provide
   advance notice, a contact point, and a procedure for complaints and
   accidental capture rather than assuming goodwill.

10. Evidence and legal uncertainty
    The draft has no test or regulatory evidence. Avoid claims that drone
    inspection is automatically cheaper, safer overall, or compliant.
    Review official local requirements, conduct a controlled trial, and
    compare results with non-drone methods.

Priority: restrict the mission and camera first; establish operational
safety and human responsibility second; verify every claimed benefit third.
~~~~

### B3 — Revision (Prompt C)

- **Tool:** ChatGPT (illustrative working artifact generated during this revision)
- **Model:** GPT-6
- **Date:** 2026-10-18
- **Purpose:** produce an improved explanation using the critique
- **Status:** Proposed prompt and illustrative response, not an independently executed historical exchange

**Prompt:**

~~~~text
Revise the Topic 1.10 draft using all ten critiques from Prompt B.
Write a clear 400–500 word explanation about one hypothetical university
post-storm rooftop-inspection drone. Discuss privacy, safety,
accountability, affected stakeholders, benefits, trade-offs, and safeguards.
Separate facts supplied by the assignment from fictional assumptions and
proposed safeguards. Then summarize the main revisions and remaining
verification gaps. Do not invent field tests, legal compliance, benchmarks,
external references, or personal verification.
~~~~

**Response:**

~~~~text
## 1. Revised draft

# Topic 1.10 — Software-Controlled Drones: Responsible Roof Inspection

A fictional university is considering drone photography to inspect roofs
after a storm. The benefit is plausible: maintenance staff might observe
damage without climbing onto unsafe surfaces. That benefit is not automatic,
however. The university must compare a supervised drone flight with ground
photography, temporary access equipment, or waiting for safer conditions.

Privacy begins with the purpose of the camera. The mission should identify
roof damage, not monitor students or collect identifiable footage for future
uses. Approved camera directions, disabled audio and identification
features, and limited recording are more suitable than wide-area capture.
Advance notices should explain when and why flights occur and where a
person can raise concerns. Only authorized staff should access encrypted
images. A proposed seven-day review period, followed by deletion unless a
repair or incident requires selected records, needs formal approval; it is
not presented as a universal legal requirement.

Safety involves both equipment and surroundings. A trained university-
authorized operator should assess weather, aircraft condition, battery,
communications, launch space, and pedestrian activity before every flight.
The plan should avoid occupied pathways, keep a safe separation from people,
set a geographic boundary, and include a tested abort and landing procedure.
Software geofencing, obstacle warnings, and return-to-home functions may
reduce some risks, but they can also malfunction. Human oversight remains
necessary, and the correct decision may be not to fly.

Accountability requires a documented chain of responsibility. A facilities
manager would approve the roof and purpose; an operator would control and
log the flight; a designated privacy officer would supervise image access
and deletion. The university would publish a complaint contact and keep an
incident-response procedure. A vendor agreement could specify service
duties without assuming that a contractor carries every institutional
responsibility.

The AI-style first draft suggested useful tools but gave too much weight to
face blurring, broad recording, automation, and a default storage period.
None of these is independently sufficient. Preventing unnecessary capture
is preferable to relying on software to conceal it afterward; a geofence
does not replace a safe route; and retention must be justified by purpose.

The case is hypothetical. No drone has been flown, no cost or reliability
measurements are available, and applicable local rules have not been
checked. Before deployment, the university should review official
requirements, consult affected campus groups, test a limited mission,
and compare outcomes with non-drone methods. Drone inspection is justified
only when a documented benefit remains after these safeguards and trade-offs
are considered.

## 2. What changed and why

| Area | Revision | Reason |
| --- | --- | --- |
| Necessity | Added comparison with ground-based inspection and postponement. | Drone use must solve a real problem. |
| Privacy scope | Replaced general wide-area video with roof-focused capture. | Prevents unnecessary collection. |
| Face blurring | Treated it as an imperfect secondary tool. | Blurring cannot guarantee anonymity. |
| Retention | Proposed controlled access and a reviewable deletion rule. | Avoids arbitrary storage and limits exposure. |
| Flight control | Required authorized human oversight and the ability to abort. | Automation cannot resolve every hazard. |
| Operational safety | Added weather, equipment, route, and pedestrian checks. | Addresses risks beyond software settings. |
| Accountability | Assigned approval, operation, data, and incident responsibilities. | Makes failures reviewable and ownership clear. |
| Community impact | Added notice, complaints, and consultation. | Recognizes people affected by the technology. |
| Evidence | Separated hypothetical benefits from verified outcomes. | Prevents unsupported safety or compliance claims. |

## 3. Remaining gaps to verify

- Local aviation and privacy rules: not consulted or established here.
- Aircraft and operator competence: no real equipment or staff evaluated.
- Privacy impact: no representative video or stakeholder consultation.
- Technical behavior: no geofence, emergency, or data-deletion testing.
- Net benefit and cost: no comparison with non-drone inspection methods.

## 4. Final assessment

The revised proposal centers privacy, safety, accountability, and
proportionality. It states why each proposed safeguard matters while
acknowledging that a conceptual report cannot certify a real drone mission.
~~~~

## 9. Appendix C — Evidence tables

### Verification table

| AI claim or proposal | Source and locator | Evidence found or missing | Decision |
| --- | --- | --- | --- |
| Topic 1.10 requires privacy, safety, accountability, criticism of AI suggestions, and one hypothetical use. | Student-supplied topic description, item 1.10 | The wording directly identifies all four tasks. | accept |
| A drone may capture people while photographing roofs. | Fictional scenario in section 1 and the proposed camera use | Plausible scenario-specific risk; no field recording was inspected. | qualify |
| Face blurring fully solves incidental recording. | Initial illustrative Prompt A proposal | No test evidence; identity may remain inferable from context. | reject |
| Geofencing guarantees that flights will be safe. | AI-style assumption challenged in Prompt B | No drone model, failure testing, or route data supplied. | reject |
| A seven-day review-and-delete period is appropriate. | Proposed privacy safeguard in sections 2 and B3 | A draft policy, not a verified law or university requirement. | qualify |
| A supervised flight can reduce risks to roof inspectors. | Hypothetical use case in section 1 | A possible benefit, not a demonstrated net safety improvement. | qualify |
| University staff and an operator should have assigned duties and an incident procedure. | Proposed governance design in section 2 | A justified design recommendation; no policy has been adopted. | qualify |

### Change log

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| Gather wide-angle video because it may be useful later. | Limit capture to approved roofs and necessary inspection frames. | Purpose limitation and bystander privacy. |
| Automatic face blurring adequately protects privacy. | Minimize initial collection; treat blurring as an imperfect secondary control. | Blurring can miss people or leave contextual identifiers. |
| Automation and geofencing are enough for safe operation. | Require authorized human oversight, preflight checks, and an abort plan. | Software safeguards can fail. |
| Retain every recording for 30 days. | Propose short, reviewable retention with documented exceptions. | A storage period requires an explicit purpose and approval. |
| A specialist vendor can handle responsibility. | Name university and operator responsibilities with incident review. | Accountability cannot be left ambiguous. |
| Drone inspection is safer by definition. | Compare total risks and benefits with alternatives before deployment. | Avoid untested performance and safety claims. |
