# Untold — Love Tarot

English-language love tarot MVP for yoonjisaid-coder/tarot-site.

## Features
- Full 78-card Waite–Smith deck; shuffle before selection, unique cards per main spread, upright/reversed orientations.
- Eight reading routes, original 12-card Clarity Deck and 30-card Message Deck.
- Their feelings, contact, ex, reconciliation, relationship future, yes/no, three-card and daily reflections.
- 78 individual card-meaning pages, daily fortune cookie, about/credits and privacy.
- No app login, payment, analytics or live AI API. Fortune-cookie date/message only uses local storage.
- Responsive layouts, keyboard-operable picks, reduced-motion support.

## Development
Uses the existing Sites Vinext/React/TypeScript starter with Tailwind CSS and CSS card animations.
`pnpm install`, `pnpm dev`, `pnpm build`.
The Next.js-compatible app source can be ported later; the checked-in runtime currently targets Sites/Cloudflare Workers.

## Artwork
Faces: historical Waite–Smith art by Pamela Colman Smith, via the public-domain artwork collection in https://github.com/alamahant/TarotCaster at 72c11d50e16b8c844421d7f063bc913914ae87d9, `decks/OriginalRiderWaite/00.jpg`–`77.jpg`. Files are resized for delivery. Attribution and provenance appear at /about. No code from that repository was copied.
Back: original AI-generated burgundy/gold celestial design, optimized to WebP. No modern publisher card back is used.

## Verification and limits
TypeScript, production build, 78 artwork/name mapping checks, 1,000 unique-deck shuffles, all question/position/orientation combinations and local asset references checked during creation.
No browser/device QA has been performed in this initial turn. Review the private deployed experience before public launch.
Interpretations are authored symbolic prompts and deterministic combinations, not verified private feelings or predictions. The selected name Untold has not been cleared for trademark/domain use.

## Next release decisions
Review shuffle/pick feel on phone and desktop; refine artwork/style and interpretation voice; confirm brand/domain before public SEO launch. Payment, advertising, analytics and the general-tarot twin site remain future work.

## Full-deck and Korean update
All 78 cards are rendered together. Wide screens fit the full deck; below 1200px, a horizontally scrollable three-row deck preserves card size. Arrow controls, native touch panning and mouse dragging are supported, with movement-threshold click suppression. Clarity and Message decks also show their complete card counts. Add `?lang=ko` for Korean; the reading language switch preserves chosen cards. Korean names, both orientations, reading contexts, oracle text, card-meaning pages and supporting pages are included. TypeScript/data checks and production build verified; browser/device gesture QA remains pending.

## Situation-based reading update
- Four situations and 21 focused relationship questions, preserving legacy reading URLs.
- One continuous 78-card semicircular fan; ResizeObserver switches narrow surfaces to bounded rotation via arrows, pointer dragging, or keyboard focus.
- All three decks shuffle before picking and allow reshuffling before selection.
- Korean interpretations combine card identity/orientation, question, position, concrete card scenes and practical observations. Matrix validation covers 10,608 combinations, each with 569–753 Korean characters, including question-specific interpretation lenses.
- Card meanings use the existing accessible Dialog primitive in both reading results and the 78-card catalogue; opening details does not navigate away.
- Fortune cookies present six pre-shuffled, distinct choices and retain the selected daily message locally.
- Updated Untold copy; heart/moon UI decorations removed (historical card artwork remains intact).
- Browser checks: full-deck spread and mouse picks; 78 → 12 → 30 deck flow; secondary reshuffles; result modal open/close preserved chosen cards; six-cookie selection.

Latest QA: desktop DOM hit testing found exposed selectable regions for all 78 cards. At a 390px embedded viewport, both end cards were pointer-selected after arrow rotation; dragging changed the rotation without adding a selection. Real-device touch behavior remains unverified. Production builds exclude the temporary QA page.

## Question-first copy and cookie alignment
- Scoped cookie flex alignment prevents shared reading-table styles from left-aligning the result block. Korean wrapping keeps words together where space permits.
- Rewrote 24 question interpretation lenses and the selection/result instructions in plain Korean. Removed repeated suit and generic position paragraphs; the earlier character-count figures above describe the previous version, not a quality target for this one.
- Separated 30 daily cookie notes from 30 relationship closing messages; existing saved cookie indices remain valid.
- User-supplied reference: Tight Saju's problem-specific entry pages. Competitor prices, traffic and claims have not been independently verified in this update.
- Apply now: question-first entry labels and concrete interpretations. Keep the current love/reunion scope and existing free flow.
- Future decisions, not implemented: free-to-deeper paid reports, career/money variants, and original card-by-intent SEO articles. Reuse the engine with genuinely topic-specific meanings, not renamed spreads. Past/present/future must not be labeled a three-month forecast.
- Do not add fabricated activity counts, testimonials, scarcity or guaranteed relationship/investment outcomes.
