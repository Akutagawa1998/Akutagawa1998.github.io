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
