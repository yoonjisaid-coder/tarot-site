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
