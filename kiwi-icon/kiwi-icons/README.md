# Kiwi icon kit

This offline kit contains **45 ready-to-use icons**: 24 original interface SVGs, 2 unchanged Kiwi brand SVGs, and 19 transparent 256×256 mascot PNGs extracted from the approved registered frames-v3 artwork. It also contains a manifest, provenance, and SHA-256 checksums.

## Download and deploy

Download `kiwi-icon-kit.zip` from the icon library and unzip it. Copy the extracted `kiwi-icons/` directory into your application's public/static directory. The ZIP's directory layout matches the deployed paths. Individual icons can also be downloaded directly from the library.

`manifest.json` is version 1. Each item has `id`, English `label`, `chinese`, `category`, `format`, and `src`; feature icons additionally have `featureName`. Paths begin with `kiwi-icons/` and have no leading slash. Resolve them against your deployment base path, including subdirectory deployments:

`const url = import.meta.env.BASE_URL + item.src;`

Use mascot/brand assets as `<img src={url} alt="Kiwi" width="32" height="32" />`. Use an empty `alt` if adjacent text already labels the same content. For icon-only buttons, provide an accessible name on the button. Icons and mascot poses supplement status text; a PNG pose alone does not communicate an error, offline state, or success reliably.

## Feature SVGs

Every feature icon uses `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, a 2-unit stroke, and round caps/joins. Recommended UI sizes are 20 or 24 px. Use the KiwiIcon component to inherit your text/theme color. Standalone SVG files include `color="#234631"` as their forest-green default, while the geometry still uses `stroke="currentColor"`. An SVG loaded with `<img>` is a separate document and keeps that default rather than inheriting its parent's text color. If you inline a downloaded SVG, override or remove its root color to inherit the surrounding theme. Choose a color with sufficient contrast against the actual background.

The feature names are: `chat`, `thinking`, `send`, `attach`, `document`, `folder`, `search`, `settings`, `code`, `book`, `course`, `progress`, `check`, `warning`, `error`, `offline`, `notification`, `play`, `pause`, `download`, `minimize`, `expand`, `success`, `help`. The `src/components/KiwiIcons/iconData.mjs` source is the shared geometry used by both React and this export.

## Brand and mascot artwork

`brand/kiwi-icon.svg` and `brand/kiwi-portrait.svg` are byte-for-byte copies of the existing P2 app tile and P3 portrait assets in `public/kiwi-mascot/`. Their shapes, colors, and embedded reduced-motion behavior are preserved.

Mascot PNGs are static, full registered atlas cells. Cropping preserves the source pixels at 1:1 scale and transparent padding; it does not redraw, recolor, warp, or retime artwork. Several status/interaction states share an animation atlas and therefore resemble one another. State names describe their intended UI use, not new symbolic badges. For animated avatars, loaders, or hover/click stamp behavior, use the repository's KiwiMascot/KiwiLoader/KiwiStamp components and their animation README rather than these static PNGs.

| State | Source atlas | Zero-based frame |
| --- | --- | ---: |
| idle | portrait-blink | 0 |
| thinking | portrait-turn | 23 |
| listening | portrait-turn | 18 |
| speaking | portrait-nod-sleep | 4 |
| walk | full-walk | 6 |
| hop | full-hop-flight | 7 |
| fly | full-hop-flight | 13 |
| success | full-hop-flight | 16 |
| error | portrait-nod-sleep | 8 |
| offline | portrait-doze | 23 |
| sleep | portrait-doze | 18 |
| wave | full-wave-bow | 7 |
| bow | full-wave-bow | 17 |
| curious | portrait-turn | 17 |
| heart | full-wave-bow | 15 |
| notification | portrait-turn | 12 |
| peek | stamp-peek | 0 |
| retract | stamp-peek | 23 |
| pop | full-hop-flight | 10 |

## Rebuild and verify

Run `node scripts/export-kiwi-icons.mjs` from the repository. The command uses Node built-ins and an existing Python interpreter with Pillow. It first tries `KIWI_PYTHON`, then the bundled Codex Python, then `python3`/`python`. For another environment, set `KIWI_PYTHON=/path/to/python`; the exporter never installs packages or accesses the network. Existing approved atlas PNGs and their manifest are required.

`provenance.json` records source file hashes, brand-copy hashes, selected atlas cells, and exported PNG hashes. `checksums.json` records every delivered asset and metadata file except itself and the ZIP, avoiding circular hashes. ZIP entries use fixed timestamps and sorted paths, so rerunning with identical inputs and toolchains produces identical files. Keep source artwork approvals and repository licensing alongside any redistribution.
