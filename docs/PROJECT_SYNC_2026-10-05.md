# UNTOLD project sync — 2026-10-05

## Verdict

**Decision sync recorded. R0 implementation remains incomplete. PAID-QUALITY GATE: FAIL.**

Compared against GitHub main `a9064873c6aeba8f5108f43dc2c1839852f8074f`, `docs/PRODUCT_GROWTH_ROADMAP.md`, and the existing implementation. This review branch is not main or a deployment. The prior production source inspected was v7 / `fbc7148300da60d63903542052b9d2b73e8716fd`; no new production E2E was performed by this sync.

## Decision and implementation comparison

| Requirement | Classification | Evidence before sync | Delta / actual status |
|---|---|---|---|
| Preserve project, relationship MVP and deferred scope | ALREADY PRESENT | Roadmap product principle and change precedence | Preserved; no new repository, product or category |
| Question-first direct plain-language reading | ALREADY PRESENT (policy), MISSING (consistent implementation) | Reading voice section; `question-lenses.ts` and `reading-scenarios.ts` still use generic branches | Explicit output contract added to policy; implementation checkpoint covers six preset IDs only |
| Cross-card synthesis, position and orientation grounding | MISSING | Existing synthesis concatenates definitions; conclusion mainly follows first-card tone | Contract and incomplete targeted implementation retained; full quality migration not claimed |
| Natural Korean, no interchangeable/repeated paragraphs | ALREADY PRESENT (intent), MISSING (testable gate) | Plain-language rule existed, no comparative quality rubric | Question-substitution test, non-repetition and naturalness requirements added |
| R0 priority | STALE | “interpretation/design polish” alongside launch/brand tasks | Interpretation quality + E2E stability now explicit first priority |
| 50–100-question before/after validation | MISSING | No mandatory sample size/rubric in roadmap | Added mandatory gate; 56 fixtures exist, only 34 supported preset replays; NOT 56 supported questions |
| ₩990 benchmark, not price | MISSING | No explicit distinction in roadmap | Quality benchmark only; no pricing or checkout decision |
| Complete question → deck → result → modal → share → retry E2E | ALREADY PRESENT (broad QA), MISSING (quality-linked completion gate) | Default development gate lists Browser QC | Added explicit end-to-end gate with KO/EN and Fortune Cookie regression; browser/device QA still unverified |
| Future free → landing → teaser → paid report funnel | ALREADY PRESENT | Roadmap R1–R3 and free/deeper/paid sections | Retained as candidate, blocked behind R0 quality gate |
| No deterministic financial/medical/legal predictions | ALREADY PRESENT | Product principle covers all three; Control Tower subsection mentions finance/health | Reaffirmed all three in contract, without expanding supported domains |
| Latest quality decision prevails over older wording | MISSING | General precedence protects confirmed decisions but does not identify this new decision | Explicit dated precedence added; unrelated confirmed choices preserved |
| Grid mandate versus later fan-restoration request | CONFLICT | “Full-deck visibility UX” requires grid and rejects horizontal navigation | Old geometry marked historical; fan request recorded. UI not changed in this sync |
| No new decks/features/monetization before gate | ALREADY PRESENT (staged scope), MISSING (explicit quality dependency) | Staged R0–R6 releases | Dependency made explicit; no payment/ads/analytics/deploy added |

## Root cause and implementation checkpoint carried forward

The core reading is deterministic. There is no free-text question input, model API, system prompt, model response parser, temperature or token budget in this flow. Changing a model cannot fix a question that was never collected.

Before: preset question ID → chosen card IDs/orientations → first-card tone/question lens → generic state and per-card meaning → concatenated synthesis → renderer repeats conclusion and generic prompt. Positions/orientations are preserved as data but underused by the prose. `cardScene` shares minor-card advice by rank across suits. Unknown `getScenario` IDs have a legacy fallback; public route/shared-link validation limits exposure but this fallback remains technical debt.

Checkpoint after: six existing preset IDs (`ex-contact`, `contact-flow`, `ex-return`, `ex-misses-me`, `crush-feelings`, `define-us`) → explicit question/intent + independent upright/reversed symbolic signals + positioned evidence → one answer/combination/condition/action contract → existing result components. No API or new input UI was introduced. Emotion is separated from initiative; third-position advice cannot turn into a prediction. Conclusion repetition is removed for migrated questions. Existing card details, sharing payloads and interaction state machine remain.

This remains an **incomplete draft**, not a paid-quality replacement: the signal vocabulary is coarse; per-card application still contains generic role wording; most existing questions use the legacy path; deterministic repeats remain identical; oracle/closing copy has not been reconciled against every result. All 78 signal mappings need editorial review against the actual card prose. Do not approve release based on the structural tests.

## Evidence and verification

- `quality/before.json`: 56 fixed fixtures captured before engine edits by replaying production-source functions, NOT captured production browser responses.
- `quality/after.json`: same question IDs, cards and orientations replayed through the draft.
- 34 supported preset fixtures, 22 `NOT_SUPPORTED_BY_PRODUCT` entries. Their natural-language fixture text is a human-authored mapping to preset IDs, not evidence of NLP. Some wording contains detail the preset cannot ingest.
- `quality/BEFORE_AFTER.md`: ten sequential examples including remaining weaknesses; full per-card sections stay in JSON.
- `scripts/check-interpretation.cjs`: 5,616 structural contract sweeps across six question IDs, 78 cards, two orientations, three positions and two languages; 56 route/language smoke checks and 56 shared-payload round trips passed on 2026-10-05. Includes explicit nostalgia/contact, fast/conflict, friendship/romance, position/reversal and advice-role assertions.
- A–I editorial scoring: **NOT COMPLETED / NOT APPROVED**. No invented numeric quality scores or claimed paid-readiness average.
- Production PC/mobile E2E, real-device touch, accessibility, performance and metadata/indexability release checks: **NOT VERIFIED in this sync**. The earlier Sites browser workflow was blocked by unavailable required browser skill; source replay does not substitute for it.

## Remaining gate failures / next work

1. Finish question-specific interpretation and card-grounding review across the existing MVP; retain failures rather than relaxing the gate.
2. Resolve coverage honestly: career, money, legal/health, free text and several adversarial inputs are not currently accepted by the product. Do not silently map these to love or invent a refusal UI. Any scope expansion needs a separate decision.
3. Complete the requested A–I comparative editorial review, including repetition, Korean naturalness, per-question context and at least ten failure-aware examples. Paid readiness has no passing score yet.
4. Complete actual desktop/mobile production E2E and regressions before public launch. Fan restoration remains a separate outstanding UX fix, not completed by this sync.
5. Human approval remains required for public launch/deploy, domain change, analytics/ads/payment. No approval is being requested for a release while these gates fail.

## Files

Decision delta: `docs/PRODUCT_GROWTH_ROADMAP.md`, this audit.

Existing-task draft checkpoint: `lib/interpretation-contract.ts`, `lib/reading-scenarios.ts`, `components/reading-room.tsx`, `scripts/quality-cases.cjs`, `scripts/capture-quality.cjs`, `scripts/check-interpretation.cjs`, and `docs/quality/*`.

The sync itself changes decisions/status documentation only; it does not certify or deploy the prior implementation draft. Main's unrelated home navigation and deck changes must be preserved by basing the review branch on current main and including only the listed targeted files.
