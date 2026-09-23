# Product & Growth Roadmap

Updated: 2026-09-23

This document extends the existing Untold / tarot-site plan. It does not replace the current love-tarot MVP, its interaction model, or its existing scope.

## Product principle

Build one compounding funnel inside the existing product:

**searchable free content → useful free tool/reading → deeper result → paid report → return visit**

Free results must stand on their own. Paid products sell additional depth, synthesis, history/context, and decision-support framing rather than withholding the basic answer.

Interpretations are reflective/symbolic content, not factual verification of another person's private feelings, guaranteed predictions, medical/legal/financial advice, or certain future outcomes. Do not use fear, fabricated scarcity, fake testimonials/activity counts, or guaranteed outcomes.

## Already reflected in the current project

- Existing love/relationship focus: feelings, contact, ex, reconciliation, relationship future, yes/no, three-card and daily readings.
- Interactive shuffle → pick → reveal flow with the full 78-card deck.
- 78 individual card-meaning pages as an SEO foundation.
- Fortune Cookie as a repeatable free experience.
- Korean/English content support and mobile-first interaction.
- Problem/question-first reading entry points inspired by problem-specific competitor landing pages.
- No forced login/payment in the free MVP.
- Deterministic interpretation structure; no live AI dependency required for the core free experience.
- Clear guardrails against fabricated activity/testimonials/scarcity and guaranteed outcomes.
- Existing engine/data/components remain the base. Do not create a separate project for the growth work below.

## Add to the roadmap

### 1. Searchable content layer

Accumulate evergreen, indexable pages on the first-party domain instead of treating social posts as disposable content.

Initial clusters:
- Tarot: 78 card meanings, upright/reversed meanings, love/relationship intent, combinations and spreads where content is genuinely distinct.
- Love/relationships: their feelings, contact, reconciliation, crush, relationship future and related question-led explainers.
- Later eastern-fortune expansion: saju basics, ilju/day-pillar content, career, money/wealth and relationship topics only when the corresponding calculation/content engine is ready.

Rules:
- One search intent per useful page; no thin programmatic doorway pages.
- Social content with durable search value becomes or links to a canonical site article/tool.
- Internal links connect article → relevant free reading/tool → deeper report where appropriate.
- Search demand and user complaints may be researched across Google, YouTube, Reddit and other useful sources when needed. Do this ad hoc; do not build a separate Agent-Reach infrastructure.

### 2. Free → deeper → paid information architecture

Free reading:
- Complete basic interpretation.
- Card-specific context and practical reflection prompts.
- Relevant card details and related free content.
- Shareable result where appropriate.

Deeper result / preview:
- Additional cross-card synthesis.
- Question-specific patterns and tensions.
- Clear preview of what the paid report adds.
- Never blur or intentionally cripple the free answer.

Paid report (future release, after payment/brand decisions):
- Longer personalized synthesis.
- Multiple sections and cross-reading context.
- Optional history/past-pattern reflection when the relevant input/model exists.
- Topic-specific report, not a renamed generic spread.
- Clearly state the additional information before purchase.

Return loop:
- Daily/periodic reading or fortune cookie.
- Saved result only when storage/account design provides real user value.
- New question or changed situation.
- Future topic/period update.
- Email only if it delivers an explicit benefit such as saved results, requested updates, or genuinely useful new content. No email gate merely to inflate a list.

### 3. Intent-specific landing pages

Preserve love/relationship as the current product priority. Build/validate relationship landing pages first.

Candidate relationship intents:
- Their feelings
- Will they contact me?
- Reconciliation / ex
- Crush
- Relationship future

Career and money/wealth landing pages are later expansions. They require genuinely topic-specific interpretation/content and should reuse the engine rather than create separate products/projects.

Saju/ilju pages belong to the same overall business funnel when eastern-fortune functionality is introduced; do not bolt unimplemented saju claims onto the current tarot engine.

### 4. Monetization by page intent

- Informational SEO pages: user value and internal navigation first; ads may be added where they do not disrupt reading.
- Free tools/readings: complete free utility first; ads can support free use without obstructive placement.
- High-intent question pages: free reading → transparent deeper preview → paid report when implemented.
- Digital products: only when they provide a distinct reusable asset or depth not already present for free.
- Do not place monetization elements mechanically on every page.

### 5. Analytics and iteration

After public launch/analytics setup, evaluate:
- Search impressions/clicks by intent.
- Entry page → free reading start.
- Reading completion.
- Result → related content / deeper preview.
- Repeat visit.
- Paid conversion once payment exists.

Use observed search queries and behavior to decide the next content/landing-page batch. Do not expand merely to maximize URL count.

## Default development gate

Every meaningful release follows this order:

1. Planning — user problem, search intent, business role, existing-component reuse.
2. Current official documentation verification — framework/platform/API requirements before implementation.
3. Implementation — smallest useful change inside the existing repository.
4. Design QC — visual hierarchy, non-generic/brand-consistent design, real references when useful.
5. PC/mobile Browser QC — actual navigation, shuffle, pick, reveal, modal, share/copy and responsive behavior.
6. SEO/accessibility/performance QC — metadata/indexability/internal links, keyboard/semantics, loading and asset weight.
7. Security QC when needed — especially payment, accounts, personal data, external APIs or server-side writes.
8. Source of truth — commit verified decisions/code/docs to this repository.

A release is not considered complete merely because it builds successfully.

## Deferred / unnecessary infrastructure

Do not add at this stage:
- Ruflo.
- A separate Second Brain.
- Token-saving proxy infrastructure.
- A standalone Agent-Reach system.
- New orchestration tools without a concrete revenue/product requirement.
- Separate repositories/products for career, money, saju or content marketing when the existing engine/site can absorb them.

Add tooling only when an identified bottleneck justifies its maintenance cost.

## Release sequence

### R0 — Current MVP stabilization
Keep the existing Untold love-tarot MVP. Finish real PC/mobile browser/device QA, interpretation/design polish, brand/domain decision and public-launch readiness.

### R1 — Search foundation
Strengthen the 78-card SEO pages and relationship-intent content; metadata, indexability, internal linking, sitemap/structured-data decisions, accessibility and performance QC. Connect durable social topics back into these pages.

### R2 — Free acquisition funnel
Improve question-led landing → reading start → complete free result → related content/deeper-preview flow. Add analytics only when public deployment is ready and consent/privacy requirements are handled.

### R3 — Paid-report validation
Define one paid relationship report first. Specify free-vs-paid information boundaries, sample output, report generation logic, price hypothesis and refund/support wording before implementing checkout. Validate report quality before multiplying SKUs.

### R4 — Return loop
Add useful revisit mechanisms (daily/periodic content, saved results or requested updates). Add email only if one of these experiences clearly benefits from it.

### R5 — Adjacent intent expansion
Reuse proven components for career and money/wealth. Research actual search intent/user complaints before building. Each vertical needs its own interpretation/content layer.

### R6 — Eastern-fortune expansion
Add saju/ilju searchable content and tools only with a validated calculation/content model. Connect them into the same free → deeper → paid → return funnel. Cross-system synthesis is a later premium capability, not a launch dependency.

## Competitor lessons absorbed, not copied

From problem-specific fortune/tarot products: use concrete user-problem entry points, free searchable education, and a visible step from free value to deeper paid value.

Do not copy competitor claims, copy, artwork, prices, or unverified accuracy claims. “Past verification” may be explored later as a reflective interaction only if supported by the actual system; never present generated statements as proof of predictive accuracy.


## Project-change precedence (mandatory)

Before applying any new shared operating method, competitor lesson, growth tactic or implementation pattern:
1. Read the latest project Source of Truth and current implementation.
2. Separate confirmed/current decisions from deferred and discarded ideas.
3. Check the proposed change for conflicts.
4. Preserve confirmed project decisions when a conflict exists; do not silently redesign or overwrite them.
5. Absorb shared operating methods only where they strengthen the existing direction.
6. Record only verified changes back into the Source of Truth.

The current Untold love/relationship MVP remains the active product scope. Adjacent fortune verticals remain staged expansions unless explicitly promoted by a later confirmed decision.

## Reading voice: direct, concrete, plain-language

Untold should not sound mystical merely for atmosphere. Interpretation copy must answer the user's question quickly and plainly.

Use this result order:
- **Answer first:** what the cards point to.
- **Timing/status next:** fast/slow, near-term/later, and a bounded time window when the reading is specifically about timing.
- **Why:** the concrete card symbols/patterns behind that reading.
- **Variable:** what could accelerate, delay or change the situation.
- **Action/reflection:** one practical next point when useful.

Avoid vague filler such as “에너지가 열려 있어요”, “우주의 흐름을 믿어보세요”, “가능성이 느껴져요” when a clearer sentence can be written. Prefer language such as “연락 가능성은 낮지 않습니다. 다만 바로 움직이는 카드보다 지연을 뜻하는 카드가 강해서, 이번 주보다 2~6주 안쪽으로 읽는 편이 자연스럽습니다.”

Do not convert symbolic readings into factual certainty. Use clear uncertainty markers only where needed: “카드상”, “이 리딩에서는”, “~로 읽힙니다/보입니다”. Do not bury every sentence in disclaimers.

## Timing readings (add within the existing love-tarot product)

Timing is a first-class relationship question, not a separate product/project.

Initial timing intents:
- 연락은 언제 올까?
- 재회 흐름이 움직이는 시기는 언제일까?
- 새로운 연애는 언제 시작될까?
- 관계가 진전되는 시기는 언제일까?

Timing output must use ranges rather than exact guaranteed dates. The engine may combine card number, suit/element, Major Arcana, orientation and the question context into a deterministic timing band. Define and test the correspondence table before publishing timing claims.

Free timing reading should itself be useful. A simple reading can return:
1. speed: 빠름 / 보통 / 지연,
2. strongest window: e.g. 며칠, 1–3주, 2–6주, 1–3개월, 3개월 이후,
3. reason from the selected card,
4. delay/acceleration variable.

A deeper multi-card reading may add: current pace → delay/acceleration factor → strongest timing window. Paid depth may later combine timing with the wider relationship flow, but the basic timing answer must not be paywalled into uselessness.

Timing copy must never say that a contact, reunion or relationship **will** occur on a guaranteed date. If the spread does not support the event itself, do not manufacture a date; state that timing is not meaningfully readable until the event possibility is established in that reading.

## Full-deck visibility UX (R0 change)

The current narrow-screen rotating semicircular fan hides much of the 78-card deck at once. Keep the core interaction — shuffle → see the face-down deck → personally choose cards — but change the presentation so users can visually understand the whole deck without horizontal/rotational exploration as the default.

Requirements:
- Desktop: all 78 face-down cards visible within the deck-selection area at once; no horizontal scrolling or arrow rotation required. Test a compact grid/table layout (13×6 is a natural starting point) and retain clear hover/focus/selected feedback.
- Mobile: show the whole 78-card field as the default composition rather than hiding cards offscreen horizontally. Card hit targets, accidental taps and legibility must be tested on real/narrow devices; use responsive spacing/scale and selection feedback rather than returning to a hidden horizontal carousel.
- Preserve shuffle, unique selection, selection order, keyboard operation and reduced-motion/accessibility behavior.
- Do not shrink cards so far that selection becomes unreliable. Browser/device QC decides the final responsive dimensions.
- The 12-card Clarity and 30-card Message decks should follow the same “whole deck is understandable at a glance” principle where practical.

This is an R0 UX correction and takes precedence over preserving the existing rotating-fan presentation itself; the confirmed product interaction is manual card choice, not the fan geometry.
