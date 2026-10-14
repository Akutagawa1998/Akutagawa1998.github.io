# Kiwi Icon & Motion Library

An English-first companion library based on the selected P2 app icon and P3 portrait: forest-green silhouettes, a long tan beak, cream eyes, and quiet sage surfaces. The preview keeps English primary everywhere. **Chinese hints** is optional and off by default; it adds secondary explanations without replacing English controls or accessible names.

[中文接入说明](README.zh-CN.md)

The current motion player uses actual drawn raster frames. Each pose is a drawing; playback selects atlas cells rather than rotating or stretching one unchanged mascot. Static marks and interface symbols are also available in SVG/PNG.

## Start with the downloaded frontend kit

Download **Full frontend kit** from the preview, unzip it, and read `START-HERE.txt`.

```sh
npm install
npm run dev
npm run check
npm run build
```

The ZIP is a minimal React/Vite project with the preview, both component folders, local font styles, and matching public assets. Its build produces `dist/`. It has no backend, login, model calls, or publishing script. It does **not** include the full repository's `mascot:build` or artwork-generation commands.

The source kit's full-kit download link points back to the hosted kit, so the ZIP does not recursively contain a copy of itself. English and Chinese guides are included locally.

## Work in the full kiwi-ui repository

```sh
npm install
npm run mascot:preview
```

Open `http://localhost:3001/mascot-preview.html` (or the port printed by Vite). The independent preview needs no backend or authentication.

To build only the library for the `/kiwi-icon/` website path:

```sh
npm run mascot:build
```

This produces **`dist-mascot/`**, with `index.html`, frame/icon assets, `README.md`, `README.zh-CN.md`, and `kiwi-icon-kit.zip`. The default deployment base is `/kiwi-icon/`. The full repository build script supports another slash-delimited base:

```sh
KIWI_SHOWCASE_BASE=/another-path/ npm run mascot:build
```

Serve the output under its configured path. Uploading that folder or publishing a homepage entry is a host workflow; the components do not publish anything themselves. Download links use `import.meta.env.BASE_URL` so the page and assets stay together under a subpath.

The full app remains available through `npm run build`; it also includes `mascot-preview.html`. Storybook lives at **Kiwi Design System / Components / Kiwi Mascot**.

## Static icon kit

The manifest at **`public/kiwi-icons/manifest.json`** currently lists **45 items**:

| Group | Assets |
| --- | --- |
| Brand | 2 static SVG identity marks |
| Product symbols | 24 SVGs for communication, learning content, tools, status, and controls |
| Kiwi poses | 19 static PNG poses selected from the current drawn-frame library |

Each manifest item records `id`, English `label`, optional Chinese text, `category`, `format`, and base-relative `src`; product SVGs also record `featureName`.

The icon gallery supports search, categories, size, cream/sage/forest/transparent preview surfaces, individual source downloads, and 256px browser PNG export for SVG items. Product symbols follow `currentColor`; brand marks and pose PNGs keep their artwork colors. Use a light backplate when a forest-green mascot sits on a dark surface.

**Download kit .zip** in the icon gallery downloads the static-only package at `kiwi-icons/kiwi-icon-kit.zip`. **Full frontend kit** in the integration section downloads the React preview/components and both static and animated assets at `kiwi-icon-kit.zip`.

```tsx
import { KiwiIcon } from './components/KiwiIcons';
import { IconLibrary } from './components/KiwiIcons/IconLibrary';

<button aria-label="Open chat">
  <KiwiIcon name="chat" size={24} decorative />
</button>

<KiwiIcon name="book" size={32} title="Learning materials" />
<IconLibrary showChineseHints={false} />
```

`KiwiIcon` accepts `name`, `size` (24 by default), `title`, `decorative`, and ordinary SVG props. A supplied `title` gives the SVG an accessible image name unless explicitly decorative. The geometry is authored locally; no user HTML is inserted.

Use an exported static file without React:

```html
<img src="/kiwi-icon/kiwi-icons/features/chat.svg" width="24" height="24" alt="Chat" />
```

Inside Vite, resolve its path from the deployment base:

```tsx
<img src={`${import.meta.env.BASE_URL}kiwi-icons/features/chat.svg`} width={24} height={24} alt="Chat" />
```

## React motion components

Copy **both** `src/components/KiwiMascot/` and the matching public frame assets when integrating motion. Copy `src/components/KiwiIcons/` plus `public/kiwi-icons/` for the icon kit. The shared component packages do not require MUI, routing, an app backend, or a model provider. Their entry points import their own styles.

```tsx
import { KiwiMascot, KiwiLoader, KiwiStamp } from './components/KiwiMascot';

// Text already conveys the state, so the artwork is decorative.
<div className="chat-status">
  <KiwiMascot state="thinking" variant="portrait" size={48} />
  <span role="status">Kiwi is thinking…</span>
</div>

<KiwiMascot state="listening" size={48} decorative={false} label="Kiwi is listening" />
<KiwiLoader width={240} label="Preparing course materials" />
<KiwiLoader width={240} progress={0.56} label="Preparing course materials · 56%" />
<KiwiStamp size={64} label="Open Kiwi chat" onActivate={openChat} />
```

Reserve a stable avatar box; 24/32/48/96px examples are in the preview. `portrait`, `icon`, and `full` remain the composition names. Each state's actual atlas and supported drawing composition comes from `KIWI_FRAME_ANIMATIONS[state]`; changing `variant` does not invent an unprovided drawing sequence. An idle `icon` uses the selected static app mark.

### KiwiMascot props

| Prop | Type / default | Behavior |
| --- | --- | --- |
| `state` | `KiwiState` / `idle` | One of the states below |
| `variant` | `portrait \| full \| icon` / `portrait` | Composition request |
| `size` | number / 48 | Width and height in CSS pixels |
| `frame` | number / omitted | Zero-based integer atlas cell; disables automatic playback and clamps to the available range |
| `motion` | `auto \| reduced \| paused` / `auto` | System preference, stable pose, or frozen playback |
| `decorative` | boolean / true | Hide redundant artwork from the accessibility tree |
| `label` | string / `Kiwi` | Accessible name when non-decorative |
| `className`, `style` | React style props | Host layout |
| `onAnimationComplete` | callback / omitted | Once for a finite action; never for a loop |

A manual `frame` takes precedence over the reduced-motion static choice, allowing artwork inspection without animation. It does not mean a complete action has finished. Remount with a new `key` to replay a finite action from the start.

### KiwiLoader props

| Prop | Default | Behavior |
| --- | --- | --- |
| `progress` | omitted | Indeterminate journey; finite values clamp to 0..1, non-finite values are indeterminate |
| `label` | `Kiwi is thinking…` | Visible text and accessible name |
| `width` | 200 | Target width, bounded by the parent |
| `motion` | `auto` | Same motion preference |

Indeterminate work exposes `role="status"`. Reaching the end of the decorative path is **not** task completion and does not generate a percentage. Real progress exposes `role="progressbar"` with a 0..100 accessible value. Supply actual progress; remove or replace the loader when the real task completes.

The current loading story has 244 time slots at 24Hz, about 10.167 seconds. Walking, the new hop/wing drawings, and travel placement are composed separately. A nominal foot reference of Y=222 for the 64px hop, placed at canvas Y=14.5, meets ground Y=70. Individual drawings retain about 0.75px of foot variation at that display size; do not claim every foot pixel is identical.

### KiwiStamp props

| Prop | Default | Behavior |
| --- | --- | --- |
| `size` | 64 | Artwork size; native button target is at least 44×44px |
| `label` | `Open Kiwi Chat` | English action name or a host-supplied accessible name |
| `motion` | `auto` | Same motion preference |
| `onActivate` | omitted | Runs immediately on click, Enter, or Space |
| `disabled` | false | Native disabled behavior |
| `className`, `style` | omitted | Host placement |

Hover or focus reveals a short-neck peek. Leaving while unfocused reverses from the drawing actually on screen; re-entering continues from the current drawing. Clicking starts the new small-hop `pop` and activates the host immediately. The host owns panel focus, Escape dismissal, `aria-expanded`/`aria-controls` where applicable, and returning focus when chat closes.

This is a **DOM collapsed-chat button**. Native macOS Dock, Windows tray, or restoration of a minimized desktop window requires a desktop host such as Electron/Tauri. A hidden webpage cannot receive hover events through its OS icon.

## States and the drawing timeline

| States | Intended use |
| --- | --- |
| `idle`, `thinking`, `listening`, `speaking` | Presence, request wait, input, and actual output |
| `walk`, `hop`, `fly` | Small steps, a complete hop, and short-wing attempts |
| `success`, `error`, `offline` | Real completion, recoverable failure, confirmed connection loss |
| `sleep`, `wave`, `bow`, `curious`, `heart`, `notification` | Dozing, greeting, thanks, curiosity, appreciation, and acknowledging a real update |
| `peek`, `retract`, `pop` | Edge reveal, reverse retreat, and click activation |

The current library contains **8 active art atlases / 192 source cells**, organized into **19 scene clips**. Five sequences are registered from retained v2 sources; three new v3 sources draw gradual eye closure, the short-neck pole-free peek, and a restrained hop/short-wing action. Reuse, reverse order, exposure holds, and unused drawings are explicit; this is not 19 independently redrawn full atlases.

The public `fps` field is a **24Hz timeline clock**, not measured device FPS or a promise of 24 new drawings every second. A drawing can occupy multiple slots. Duration is `sequence.length / fps`; repeated indices hold the same source drawing.

| Scene | Exposure / continuity | Duration |
| --- | --- | ---: |
| `walk` | Each drawing occupies 2 slots | 2s |
| `hop` | New 24-cell hop, 3 slots each, 12-slot landing hold | 3.5s |
| `pop` | Reuses new hop, 2 slots each, 12-slot final hold | 2.5s |
| `thinking` | Turn, pause, return through adjacent drawings | 8.875s |
| `sleep` | Gradual closure, 6s closed-eye hold, gradual reopening | 13.875s |
| `notification` | Turn, acknowledge, return | 4.875s |
| `bow` / `heart` | Drawings 14..17 down, hold, 16..14 back | 2.667s / 3.667s |
| `peek` / full `retract` | Exact forward/reverse timelines including holds | About 2.333s each |

Inspect the current configuration rather than copying a stale timing table:

```tsx
import { KIWIMASCOT_STATES, KIWI_FRAME_ANIMATIONS, KIWI_STATE_META } from './components/KiwiMascot';
console.table(KIWIMASCOT_STATES.map(state => ({
  state,
  atlas: KIWI_FRAME_ANIMATIONS[state].atlas,
  sourceCells: KIWI_FRAME_ANIMATIONS[state].frameCount,
  timelineHz: KIWI_FRAME_ANIMATIONS[state].fps,
  slots: KIWI_FRAME_ANIMATIONS[state].sequence.length,
  durationMs: KIWI_STATE_META[state].durationMs,
})));
```

## Fixed-camera inspection and source registration

**Inspect frames** pauses at a real atlas cell. Use the slider, previous/next buttons, or thumbnails. **Camera guides** adds fixed bounds, a centerline, and a Y=232/256 reference. **Compare frames** shows separate opaque drawings in equal-sized cameras; **Pin current frame** keeps the reference fixed. There is no crossframe dissolve or runtime bounding-box recentering. Replay exits comparison and restores the actual scene order.

Original source PNGs remain unchanged in the full repository. `registration.json` records source hashes, `isolationRect`, integer `targetPaste`, and measured anchors. Packing crops an isolated source rectangle and places unchanged pixels at scale 1:1 on a transparent 256px camera. It does not resize, rotate, recolor, synthesize, or interpolate the artwork.

Portrait bases use Y=232 and X about112; walk registration stabilizes eye/head coordinates while retaining a small gait arc. Peek fixes its right edge at X=220 and crown at Y=70. The new hop follows the recorded eye trajectory about105→116→70→115→105 for crouch, takeoff, landing compression, and settling; it retains the separately drawn legs and short wings.

Current atlases and cells live under `public/kiwi-mascot/frames-v3/`: lossless WebP/PNG atlases and `ATLAS/frame-000.png` through `frame-023.png`. Animated `kiwi-STATE.webp` files can be used directly in an `<img>`, but do not expose component pause/completion callbacks or automatically switch for reduced motion. A host using image-only animation must provide a corresponding static PNG alternative.

The full repository supports `npm run mascot:frames:manifest` and `npm run mascot:frames:pack` (Python + Pillow), including `-- --only hop` for a timed-clip rebuild. Regeneration requires the full source registration/originals; those tools and raw reference artwork are intentionally omitted from the minimal downloaded kit.

## Chat status, accessibility, and other frameworks

Drive the avatar from actual host state: waiting/tools → `thinking`, real streamed output → `speaking`, settled → `idle`, failure → `error`, confirmed offline → `offline`. Cancel the request in the host before returning to idle. Celebrate once for a real completion, not for every token. Keep errors readable and retry controls available.

Loops never call `onAnimationComplete`; finite actions complete once. Reduced motion selects a stable drawing and completes finite callbacks asynchronously. Pause, hidden-page, and offscreen states suspend playback. Components unmount cleanly; the preview also disposes its React root during Vite hot updates.

Keep decorative artwork hidden when adjacent text already says the same thing. Give standalone artwork a useful label, throttle progress announcements, retain visible keyboard focus, and keep touch targets large enough. The demo chat is local and non-modal, with immediate activation, Escape collapse, and focus returned to its launcher.

For Vue/Svelte/plain HTML, static SVG/PNG files need no React. A complete motion port must implement sequence order, holds, timing, loop/finite state, cancellation, pause, reduced motion, and loading failures. Do not substitute the superseded v1 SVG transforms. Next.js App Router needs a client boundary for browser hooks and events.

## Evidence and version history

v1's rigid SVG motion was rejected. v2 used drawn images but the user identified position drift and convulsive timing. v3 adds fixed-camera registration, explicit exposure rhythm, adjacent-frame returns, and interruption-aware reversal. Historical v1/v2 READMEs and source evidence stay preserved.

The v3 motion delivery passed a final 80-file/754-test run, related 7-file/71-test run, semantic TypeScript check, production and Storybook builds, source hashes/bounds and encoded-duration checks. `artifacts/kiwi-mascot-v3-2026-10-14/` retains those records, including 8 active atlases, 192 PNG cells, and 27 WebPs. These records describe the motion revision; the later English/icon/site packaging has its own validation record and must not inherit an unrun test claim.

Art approval and native-device compatibility are separate from passing code checks. The standalone preview and components do not upload data or make model calls. Existing production chat requests belong to the host application. A kiwi-ui repository push remains subject to the user's explicit approval; homepage publishing is a separate host workflow.
