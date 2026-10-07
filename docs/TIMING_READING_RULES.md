# Timing readings — implementation record

Implemented 2026-09-24 within the existing love-tarot product. Paid reports and other fortune verticals remain deferred. Existing PRODUCT_GROWTH_ROADMAP decisions remain authoritative.

## Correspondence rules

The executable source is `lib/timing.ts`. Bands are: a few days–1 week, 1–3 weeks, 2–6 weeks, 1–3 months, and 3+ months. These are editorial symbolic conventions, not measured probabilities or validated forecasts.

- Wands and Swords begin faster, Cups moderate, Pentacles slower.
- Number cards adjust the base band; Eight of Wands has a rapid-movement exception, not an eight-day promise.
- Major Arcana use an explicit per-card table and reasons. Unresolved conditions withhold dates.
- Pages, Queens and Kings describe readiness rather than a fixed period. Knights use movement-related bands.
- Conflict/stoppage cards withhold dates. Reversed cards delay an available band by one step; they do not create dates where none exists.
- Reunion, new love and relationship progress use at least the 2–6-week band. These describe possible first movement, not completion of an event.
- Contact refusal and boundaries must be respected in advice.

Reference consulted for the existence of differing tarot timing conventions: Joy Vernon, Tarot Timing Information Chart, https://joyvernon.com/images/Tarot%20Timing%20Information%20Chart.pdf. Untold's precise ranges are its own convention, not a reproduced or empirically validated chart.

## UI and reading changes

- Four timing intents: contact, reunion, new love, relationship progress.
- Preserve tarot → advice → message decks and manual selection.
- Desktop classic deck: 13 columns × 6 rows. Mobile: six columns, no horizontal carousel. At 320px use tighter gaps, with at least 44px card targets in tested browser layout.
- Standard reading: answer → card explanation → relationship application → advice. Timing adds status and variables.
- Preserve result-sharing and card-detail dialogs.

## Verification

TypeScript no-emit check; deterministic rules/share round-trip test for 78 cards × 2 orientations × 4 timing questions (624 cases). This tests implementation consistency, not predictive accuracy.

Browser preview tested at 320, 390 and 1280px iframe widths: 78 cards, no horizontal overflow; 320px targets approximately 44.16 × 44px; desktop 13 columns. Completed the three-deck contact-timing flow, opened card details, and verified manual-copy fallback from the sharing button. Native OS share sheets and physical-device touch behavior were not tested.

Reproduce rules test:

```sh
node node_modules/typescript/bin/tsc lib/timing.ts lib/reading-scenarios.ts lib/shared-result.ts --outDir /tmp/untold-rule-check --module commonjs --moduleResolution node --target ES2022 --skipLibCheck
node scripts/check-timing.cjs /tmp/untold-rule-check
```

## Update 2026-10-08 (interpretation R3)

**This is UNTOLD's own editorial timing system. It is not a traditional tarot rule and is not presented to users as one.** Tarot traditions disagree on timing correspondences; these bands exist so readings answer "언제쯤" consistently, not to predict dates.

What the result shows: one most-likely window plus a confidence label (높음 / 보통 / 낮음) and the card-based reason. Early/late edges are no longer shown by default, because summing them (e.g. 1주~2개월) carried little information.

Windows per question type (`UNITS` in `lib/reading-engine.ts`):

| Type | Fast → slow bands |
|---|---|
| 연락 (contact) | 며칠~1주 · 1~2주 · 2~4주 · 1~2개월 · 2~3개월 이상 |
| 재회 (reunion talk reopening) | 2~4주 · 1~2개월 · 2~3개월 · 3~6개월 · 반년 이상 |
| 관계 진전 (progress) | 1~2주 · 2~4주 · 1~2개월 · 2~3개월 · 3개월 이상 |
| 새 인연 (new love) | 1~2개월 · 2~3개월 · 3~4개월 · 4~6개월 · 반년 이후 |

Three-card readings (`timingFor` in `lib/reading-engine.ts`):

- Each non-obstacle card gets a pace from its reading class (from `lib/card-cores.ts`): action 0; clear judgment, warmth, turning point 1; memory, stable base, recovery 2; pause, attachment, conflict, unmet expectation 3. Unclear (FOG) and ending (END) cards carry no pace.
- Suit/element: Wands one step faster, Pentacles one step slower; Cups and Swords unchanged. Major arcana use their class only.
- Orientation: reversed is one step slower.
- Spread: the center is the rounded mean of the paced cards; a heavy obstacle card adds one step. Confidence is 높음 when the paced cards are within one step, 보통 within two, otherwise 낮음.
- No window is given when the verdict is low (the obstacle must ease first), unclear, or when an ending card is a main signal.

Single-card timing questions keep the band logic above (`lib/timing.ts`, 624-case gate unchanged) and now print the most-likely window with confidence: 보통 by default, 낮음 for reversed or court cards, 높음 only for the upright Eight of Wands.

Dates are never generated.
