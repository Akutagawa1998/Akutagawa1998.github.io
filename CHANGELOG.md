## [1.5.1] - 2026-11-24

### Features

- Fixed: on the live site the two backdrop panels between the classic page and the NDS view never showed, so the pages still cut from one to the other. They work locally and now on the live site too.
- Fixed in Safari: while the console opened, the lower half's buttons and Circle Pad vanished and its screen turned grey for about a third of a second, then popped back when the opening ended. Every frame is now the same in Safari and Chrome.

### Design Rationale

- The panels: `_sass/_nds-veil.scss` sized them with `calc(var(--nv-h) / 2 + 1px)`. In production jekyll-minifier rewrites `calc()`: it spaces out every hyphen before the first `)` and strips the spaces around `+` and `-` after it, publishing `calc(var( -  - nv - h)/2+1px)`. That is invalid, so the panels had no height. The sizes are plain lengths now (`51vh`, `50vh`, and `dvh` where supported), with no `calc()`.
- The console: 1.5.0 built it as a `preserve-3d` scene and left the depth sorting to the browser. Chrome sorts per pixel; Safari put the buttons layer, which lies in the same plane as the lower half's face, behind that face. Now every plane carries its whole transform itself (camera included) and the planes are stacked with `z-index` in a fixed order, so no browser sorts anything. The order is always right for this object: the lid is nearer than the lower half while it covers it and beside it afterwards.
- The lid's faces use `backface-visibility`, which both engines apply to a plain face. The top screen is also switched by the clock, at the instant the lid is edge-on to the camera (a line with no area), because Chrome keeps drawing separately composited parts of a back-facing element and showed the black glass through the closed lid.

### Notes & Caveats

- Both bugs passed the checks before 1.5.0 because those ran on the development build in Chrome. The development build is not minified, and Chrome sorts the old scene correctly. This release was checked on the production build (minified and purged) in Chrome and in WebKit, the engine of Safari on Mac, iPhone and iPad.
- WebKit was checked from real window captures. `WKWebView.takeSnapshot` repaints the page in software: it ignores `backface-visibility` and depth sorting, and showed faults the real compositor does not have while hiding the one it does.
- One rule of the site itself is still damaged by the minifier and is not part of this fix: `_sass/_components.scss` sets the About picture's `max-height` with `calc(var(--about-profile-max-height) - var(--about-caption-space))`, which is published as `calc(var( -  - about - profile - max - height) - …)` and ignored.
- The instants at which the top screen is shown and hidden (55.55% of the opening, 34.75% of the closing) are solved from the poses and easings in `assets/nds/nds.css`. Change them together.
- Firefox has not been looked at.

## [1.5.0] - 2026-11-19

### Features

- The home page no longer opens with the "Do you like Pokémon?" prompt. It always loads as the classic page.
- The navbar's "nds view" switch is now bold pixel text (Pixel Operator Bold, the NDS view's font) and breathes like a standby light to invite a click: it dims to 30% and back every 2.4 s. It stops once the NDS view has been opened, and stays steady under the pointer or keyboard focus.
- Going to the NDS view and coming back are now one continuous transition:
  - Classic page to NDS view: two panels of the NDS backdrop close over the page from the top and the bottom (0.34 s). The NDS view loads on that same backdrop; the closed console rises into view, lying tilted back so its thickness shows, then opens while it turns to face you (1.1 s), and the screens power on.
  - NDS view to classic page (HOME): the screens go dark, the lid closes, the console drops away (1.02 s), and the classic page appears from behind the backdrop as the two panels open (0.44 s).
- While it opens and closes the console is a solid object: both halves have thickness, there is perspective, and a shadow lies on the table under it.

### Design Rationale

- A modal on every first visit stood between the visitor and the page. A breathing link advertises the NDS view without blocking anything.
- "Opened once" is kept in localStorage (`nds-seen`, written by /nds/), so the hint does not come back on later visits. The prompt used sessionStorage and asked again in every new tab.
- The two pages are separate documents, so each plays its own half of the transition and they meet on one shared picture: the bare NDS backdrop. That works in every browser; cross-document view transitions would have left Firefox with a hard cut.
- The console is 3D only during the transition. At rest it is the same flat pixel art as before, so nothing is resampled or blurred: the last frame of the opening and the resting console are pixel-identical (compared in Chrome).
- Thickness comes from stacking each half's silhouette in layers 6 px apart behind its face. The silhouette has stepped pixel corners, which flat side panels cannot follow; a stack reads as a solid wall from any angle.
- A first version folded the flat art with `scaleY` (the head-on projection of a turning half). It had no thickness and no perspective and read as paper, so it was replaced.

### Notes & Caveats

- Removed `_includes/pokemon_gate.liquid`, `assets/nds/gate.css` and `bin/test-pokemon-gate.mjs`. The sessionStorage key `pk-gate` is no longer read or written.
- `_pages/nds.html`: each shell half now sits in a `.body3d` wrapper, and the top screen moved out of `.live` into `.lidlive`, so it can turn with the lid. At rest the wrappers have no styles.
- The backdrop colours exist twice: in `assets/nds/nds.css` and in `_sass/_nds-veil.scss` (the classic pages do not load the NDS stylesheet). Change them together.
- HOME now takes 1.02 s to leave the NDS view (0.22 s before). The wait is `--t-close` in `assets/nds/nds.css`, which `nds.js` reads.
- HOME leaves a note in sessionStorage (`nds-return`) that the classic page reads once; a note older than 5 s is ignored.
- With `prefers-reduced-motion` nothing moves: the switch does not breathe and both pages appear at once, as before. With storage blocked the switch keeps breathing and coming back shows no panels; the links work either way.
- The pixel font is now preloaded on every classic page, because the navbar uses it everywhere.
- Checked in Chrome only. Safari and Firefox have not been looked at.

## [1.4.2] - 2026-10-27

### Features

- NDS view: paged text now turns pages in Safari and on iPhone and iPad. Before, only the first page of an About card or a People page could be read there: "More about me" stopped mid-sentence ("in your email, and"), and Research interests lost its second page. Chrome was not affected.

### Design Rationale

- Pages are the overflow columns of a one-column multi-column box. WebKit builds no columns when `column-count` is 1, so the text ran on below the box, where it was clipped, and the page count came out as 1. A `column-width` wider than the box gives one column of the box's width in every engine. Measured in the system WebKit (Safari 18.6), "More about me" now has 3 pages and Research interests 2, broken where Chrome breaks them.

## [1.4.1] - 2026-10-23

### Features

- Home page prompt: YES and NO each fill their half of the menu box, so a click anywhere in the box answers. Before, only the word itself did, and a click beside it did nothing. The box looks exactly as before (pixel-identical).
- NDS view: nothing covers the Pokémon any more. Mew and Gengar no longer pass behind the console. The console, the HOME hint and the key legend are walls, and on meeting one the floater turns off it in a random direction. In a chase it may veer sideways but not back toward the pointer, and it warps only when there is no way out. Espeon and Umbreon turn back before the HOME hint, and the floater keeps above the walker's strip, so the two never overlap either.

### Design Rationale

- Collisions are swept along each axis (where the floater was against where it would be), so a fast dodge cannot jump through a thin panel. Walls are grown by the panels' 9 px pixel frame plus two sprite pixels, which is more than the floater's bob.
- A turn keeps the floater's speed, so the dodge still runs at the pointer's speed (measured in open space: 496 px/s for a 500 px/s pointer, 1186 px/s for 1200). In a chase the new heading is held for 0.4–0.8 s, so the floater does not zigzag along a wall.

### Notes & Caveats

- When the window leaves no open ground beside the console big enough for the sprite, the floater is hidden rather than covered, and it comes back when the window grows.

## [1.4.0] - 2026-10-23

### Features

- Home page: "Do you like Pokémon?" opens first, as a Pokémon-style message box with a YES / NO menu (`_includes/pokemon_gate.liquid`, `assets/nds/gate.css`). YES opens the NDS view; NO (or Esc) keeps the classic page. While it is open the page behind is blurred and cannot be clicked (a modal `<dialog>` with a `::backdrop` blur). The question types itself out (any key finishes it); arrows or W/S move the ▶, Enter, Space or L choose, K answers NO. Mew peeks over the box (Gengar in dark mode).
- NDS view: Pokémon companions around the console (`assets/nds/pals.js`). By day Mew drifts around the console, passes behind it and dodges the pointer at the pointer's own speed (warping away if caught up with), and Espeon paces the bottom edge of the window. With SELECT's dark mode, Gengar and Umbreon take their places.

### Design Rationale

- The question is asked once per browser session (sessionStorage; opening the NDS view counts as an answer), only on mouse-and-keyboard screens at least 720 px wide, because the NDS view is a desktop layout, and never to crawlers, so search results and phones get the page directly.
- The sprites are 1x PNGs (about 300 B each) extracted from the owner's grid drawings (grid fitted per image, cells sampled at their centres, background flood-filled from the border). They are drawn at a whole number of device pixels per sprite pixel, so every pixel renders the same size. The floater is painted before the console (z-index 0); the walker is above it (4) and below the HOME hint (5).
- The dodge matches the pointer's smoothed speed (measured: a 500 px/s pointer gives 499 px/s, 1200 px/s gives 1185 px/s, at a steady gap), and a fast pointer is noticed 0.2 s of its travel ahead. Behind the console the floater cannot see the pointer.

### Notes & Caveats

- al-folio's theme code puts `transition: all 750ms !important` on every element while it applies a theme (also on load). The prompt opts out; otherwise its menu would still compute as hidden when it takes focus. The menu is hidden with opacity, so YES stays focusable.
- Reduced motion: the companions stand still and the question appears at once.
- Pokémon names and designs are trademarks of Nintendo, Creatures and GAME FREAK. The sprites are fan pixel art supplied by the site owner.

## [1.3.3] - 2026-10-23

### Features

- NDS view: text is set in Pixel Operator (CC0, self-hosted in `assets/nds/fonts/` with its licence), a proportional pixel font with a real bold. DotGothic16's Latin is monospaced (every letter 0.5 em), which gave narrow letters wide gaps; it now only supplies the arrows and triangles Pixel Operator lacks.
- NDS view: the A/B/X/Y hint glyphs are 7x7 pixel sprites, and every hint row is a centred flex row, so each glyph sits on the centre line of its text (measured within 1 px everywhere).

### Design Rationale

- `size-adjust: 114.29%` on the Pixel Operator faces renders the existing 14 px text on the font's native 16 px grid, so layouts and line lengths stay as they were. Uppercase tracking is one font pixel (1/16 em).

## [1.3.2] - 2026-10-23

### Features

- NDS view: one legible dot font (DotGothic16) for all text. Pixelify Sans made C/O and E/R hard to tell apart at label sizes. Emphasis is a highlighter band, since the font has one weight and faked bold smears it.
- NDS view: "Enter for detail" shows only on the card under the cursor; "More about me" is a title bar without a preview; News uses the freed space to show its latest item in full; the Back control is a plain "B Back" label instead of a boxed key.

## [1.3.1] - 2026-10-23

### Features

- NDS view: while an About card is open on the top screen, the D-pad reads it (left/right turn pages, up/down switch cards) until B closes it. The cards always show "Enter for detail", and Enter acts as A.
- NDS view: dragging the Circle Pad steers a pixel arrow over the top screen. Whatever it rests on takes the cursor and A clicks it (the way touch users reach top-screen links). The mouse pointer is a pixel arrow over the top screen and a pointing finger over the touch screen.
- NDS view: the publications list uses pixel versions of the venue marks; the item page keeps the official logos.
- Classic site: the navbar social icons sit on the nav text's centre line at matched sizes, and "nds view" is a plain nav link.

### Notes & Caveats

- The CHI and EMNLP pixel marks are redrawn at 16 x 16 (sakura, palm and sunset), because the official artwork does not survive the downscale. The ACL mark is the official one snapped to its two colours.

## [1.3.0] - 2026-10-23

### Features

- NDS view at `/nds/`: the homepage as a New 3DS-style console (`_pages/nds.html`, `assets/nds/`). The top screen shows content (trainer card, About text, item pages). The bottom screen operates (About cards, section lists).
- Controls: WASD = D-pad (moves one cursor across both screens; A/D switch sections), I/J/K/L = X/Y/B/A, the mouse over the top screen drives the Circle Pad. HOME (or H) returns to the classic site, SELECT toggles dark mode (black console), START opens an AI-mode placeholder.
- Navbar: an "NDS view" switch on the classic site.
- The al-folio demo posts are excluded from the build, so the blog shows its empty state.

### Design Rationale

- The console is authored at a fixed 852 x 967 px (1 mm = 6 px of an unfolded New 3DS) and scaled as one unit, so its proportions match the hardware at any window size. Pages are CSS overflow columns, so long text turns pages instead of scrolling.
- NDS styles and script live in `assets/nds/`, outside PurgeCSS's `assets/css/*.css` glob (many class names only exist in JS-built DOM), and are excluded from jekyll-minifier.
- START dispatches a cancelable `ds:start` event with both screen elements, so the planned AI terminal can mount without touching the console code.

### Notes & Caveats

- Venue icons are cropped from the official ACL 2026, CHI 2025 and EMNLP 2024 logos (third-party trademarks, used to label venues).
- On phones the whole console just scales down; a phone-specific layout is still to do.
- Demo posts are excluded, not deleted: after removing them, drop the matching `exclude:` lines.

## [1.2.0] - 2026-10-22

### Features

- About: added a line on Kiwi (kiwiai.org) and Kiwi Code.
- Projects: replaced the kiwi-icon design card with a 几维 / Kiwi card linking to kiwiai.org and a new pixel-art thumbnail (`assets/img/kiwi_card.png`); dropped the now-empty `design` category.
- Blog: shown in the navbar right after publications, with an empty state; cleared the template tag/category bar.

### Design Rationale

- The Kiwi thumbnail is generated from the official mascot SVG (pixelated by per-block coverage) so it stays on-brand while matching the night-scene pixel style of the other project cards.

### Notes & Caveats

- The blog lists al-folio's demo posts until they are removed (see the cleanup step); the empty state appears once `_posts/` has no posts.
- `/kiwi-icon/` is still published but no longer linked from the projects page.

## [1.1.0] - 2026-10-22

### Features

- Stripped EXIF/GPS metadata from the profile photo (`assets/img/IMG_0331.jpg`), losslessly.
- Stopped publishing repo-only files: drafts (`webpage_brief/`, `webpage_2026/`), agent/IDE config and internal docs are now in `_config.yml` `exclude:`.
- Disabled unused features: Altmetric/Dimensions/InspireHEP badges, MathJax, external RSS sources, JSON resume loading; cleared template blog/disqus names.
- Tightened the Content-Security-Policy to the hosts the site actually loads (cdn.jsdelivr.net, Google Fonts).
- Pinned kept GitHub Actions to commit SHAs, added explicit `permissions:`, removed the unpinned `yaml-update-action` step and the PR dispatch step; added Dependabot for actions.
- Added `rel="noopener noreferrer"` to `target="_blank"` links, switched remaining `http://` links to https, bound Docker dev ports to 127.0.0.1, pinned the Dockerfile base image.
- Repositories page now shows the owner's GitHub profile instead of template data.

### Design Rationale

- `exclude:` is a denylist, so anything new at the repo root is published by default; listing repo-only files explicitly is the minimal fix that keeps the al-folio layout.
- CSP keeps `'unsafe-inline'` because al-folio relies on inline scripts; restricting script hosts still blocks loading arbitrary third-party code.
- Actions are pinned to the SHA of the major tag already in use, so behavior is unchanged.

### Notes & Caveats

- Re-enabling a feature that loads from a new host requires adding that host to the CSP in `_includes/head.liquid`.
- Removing a file in a commit does not remove it from git history; see the history-rewrite step for that.
