# Week 01 — Manual vs AI: Comparison

**Name:** Amankos Yernur 
**Group:** Mon 16:00 - 19:00  
**Date:** 13 September 2026

---

## 1. Facts

| | Manual (Part 1) | Rocket (Part 2) |
| --- | --- | --- |
| Language / stack used | Python | Python |
| Time to first version that ran | Not recorded | Not recorded |
| Time to all 4 test cases passing | Not recorded | Not recorded |
| Number of attempts / prompts needed | Not recorded | Not recorded |
| Lines of code you actually wrote | Not recorded | AI-generated; exact number not recorded |
| Did it handle invalid marks (case B)? | Not verified from the information provided | Yes, after validation was included |
| Did it handle an empty list (case D)? | Not verified from the information provided | Yes, after the no-valid-marks check was included |
| Did it use the ≥ 50 pass threshold? | Not verified from the information provided | Yes |
| Output format matches the spec? | Not verified from the information provided | Yes, after the fix |
| Can you explain every line of it? | To be confirmed by me | Yes — it uses basic lists, loops, conditions, and built-in functions |

> **Note:** The exact manual timings, attempt count, and manual outputs were not included in the uploaded file or chat, so I have not invented them.

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- | --- |
| A | `85, 23, 45, 90, 92` | Not recorded | avg 67.00 · high 92 · low 23 · pass 60.0% | avg 67.00 · high 92 · low 23 · pass 60.0% | Rocket: Yes |
| B | `88, 47, -5, 101, abc, 73, 50, , 100` | Not recorded | avg 71.60 · high 100 · low 47 · pass 80.0% | avg 71.60 · high 100 · low 47 · pass 80.0% | Rocket: Yes |
| C | `10, 20, 30` | Not recorded | avg 20.00 · high 30 · low 10 · pass 0.0% | avg 20.00 · high 30 · low 10 · pass 0.0% | Rocket: Yes |
| D | `abc, , xyz` | Not recorded | `No valid marks.` | clear message, no crash | Rocket: Yes |

## 3. What the AI added that I never asked for

- It added an explicit check to exclude Boolean values such as `True` and `False`, even though the task only mentioned numbers, text, empty values, and out-of-range marks.
- It added comments and demonstration data to make the program easier to understand and test.

## 4. What the AI got wrong or silently skipped

- One simplified version assumed that every value in the list was already a number. With case B, text such as `abc` or an empty value would make that version fail instead of ignoring the invalid item.
- The simplified version also did not protect against having no valid marks. Case D therefore needed an extra check so the program printed a clear message instead of trying to calculate statistics.

## 5. The defect I asked Rocket to fix

**Prompt I used:**

> Please fix the program so that only numeric marks from 0 to 100 are used. Ignore text, empty values, negative numbers, and values above 100 without crashing. If there are no valid marks, print a clear message. A pass is 50 or higher.

**Result:** Fixed.

**What this tells me:**

The AI can produce a solution quickly, but simplifying or rewriting the code can accidentally remove important requirements. I still need to test every required case after a change, especially invalid input and edge cases.

---

## 6. Reflection (200–300 words)

The AI genuinely sped up the work by giving me a clear program structure very quickly. It showed how to store valid marks in a separate list, calculate the average with `sum()` and `len()`, find the highest and lowest values with `max()` and `min()`, and calculate the pass rate. This saved time because I did not have to build every part from the beginning.

However, the AI also showed why its output still needs to be checked. When I asked for a simpler version, one version became too simple and assumed that every item was already a valid number. That looked correct for normal inputs, but it would fail on the invalid values in case B and did not properly handle case D. Fixing this meant going back to the requirements and adding validation again.

I would be more willing to put my name on the final tested version than on an earlier version, because the final version follows the specification and handles the edge cases. I would still want to understand the code before submitting or using it.

This experiment shows that a human engineer is still responsible for understanding the requirements, checking whether the AI has missed anything, testing normal and unusual inputs, and deciding whether the final result is actually correct. AI can make coding faster, but the human still has to verify the behaviour and take responsibility for the finished program.
