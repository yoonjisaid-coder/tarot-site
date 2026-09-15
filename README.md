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
