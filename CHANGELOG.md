## [1.2.0] - 2026-10-22

### Features

- About: added a line on Kiwi (kiwiai.org) and Kiwi Code.
- Projects: replaced the kiwi-icon design card with a Kiwi / kiwiai.org card and a new pixel-art thumbnail (`assets/img/kiwi_card.png`); dropped the now-empty `design` category.
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
