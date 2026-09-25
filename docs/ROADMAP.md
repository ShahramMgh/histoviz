# histoviz — Roadmap

An interactive dashboard for *The Iranian Plateau: 100,000 years of human history*.
A living, sourced, multilingual atlas: horizontal timeline + map, rich per-event content.

## Data model (per event)
Each event in `js/data.js` may carry:

| field | status | meaning |
|---|---|---|
| `id` | ✅ done | stable id (`e001`…) for permalinks, relations, research merge |
| `e`,`y`,`d`,`t`,`p`,`x`,`c` | ✅ done | era, sort-year, display-date, title, place, summary, category |
| `lat`,`lng` | ✅ done | map pin |
| `un`,`db` | ✅ done | UNESCO note / debated flag |
| `body` | 🟡 schema ready | long "read more" text (may be multi-paragraph) |
| `img[]` | 🟡 schema ready | `{file, alt, credit, link}` — Wikimedia Commons, hotlinked |
| `refs[]` | 🟡 schema ready | `{label, url}` — sources / further reading |
| `related[]` | 🟡 schema ready | ids of related events |
| `region` | 🟡 schema ready | Zagros / Susiana / Fars / Sistan / … |

## Phases

### Phase 1 — Platform (done)
- [x] Split into modular files (`index.html`, `css/style.css`, `js/data.js`, `js/enrich.js`, `js/app.js`)
- [x] Stable event ids
- [x] Rich **"Read more"** detail panel (body, photos, references, related events, prev/next, permalinks)
- [x] Extended per-event **schema** wired into the UI (renders whatever data exists)
- [x] **Theme switcher** — Light / Dark / Auto / Parchment (persisted)
- [x] Renamed to **The Iranian Heritage**
- [x] Bigger timeline canvas + taller map
- [x] **3D animated timeline** — perspective stage, scroll-reveal, hover lift/tilt, active pop, pulsing dots, wheel-to-horizontal scroll, drag-to-pan

### Phase 1b — Admin event editor (done)
- [x] Enable with `?admin=1` (persists per browser; `?admin=0` disables)
- [x] Add / edit / delete events: year + BCE/CE, title, category, place, lat-lng (or **pick on map**), summary, full description, image (URL or Wikimedia `File:`), credit, UNESCO note, debated flag
- [x] Saved in `localStorage`; **Export** to JSON for permanent commit to `data.js`
- [x] New **"Later heritage"** era (651 CE – present) for post-Sasanian additions

### Phase 1c — "Next level" upgrade (built, pending live test)
- [x] **Richer era ribbon** — per-era icons, event counts, depth/gradient, hover lift
- [x] **Admin-editable curated events** — overrides system in `localStorage`; an **Edit ✎** button in the detail panel edits any event (base included); admins only for curated, owners for their own
- [x] **Full-page event view** (`#full=<id>`) — immersive hero + article + gallery + references + related
- [x] **Rich article editor** (admins) — contentEditable toolbar (H2/bold/italic/lists/quote/link/image) + gallery + references manager, saved per event
- [x] **Map of Time** — full-screen serpentine (boustrophedon) view: one era-coloured path winding through every event
- [x] **Constellation of Time (3D)** — Three.js fly-through; events on a time-helix, click a star to fly to it, drag-orbit, auto-tour (lazy-loaded, graceful fallback)
- [x] Shared `window.HV` API so views stay modular

### Phase 2 — Map & timeline layers
- [ ] **Marker clustering** (fixes many events stacking on the same coordinates)
- [ ] **Trade routes** overlay (Silk Road, Persian Royal Road, lapis-lazuli route)
- [ ] **Layer control** to toggle overlays
- [ ] Quick filters: **UNESCO only**, **Debated only**
- [ ] Region filter (needs `region` data)
- [ ] Empire **territory overlays** tied to the active era
- [ ] Timeline **date-range brush** + mini overview; optional **climate band**
- [ ] Permalinks (shareable URL that opens a specific event) + prev/next keyboard nav

### Phase 3 — Deep research enrichment (all 118 events)
- [ ] For every event: extended `body`, 2–4 vetted `refs`, `related` links
- [ ] Wikimedia Commons image per event where one exists (hotlinked + credited)
- [ ] Add **new events** the research surfaces
- [ ] Adversarially verify dates/claims; keep `debated` flags honest

### Phase 4 — Extras
- [ ] Autoplay chronological "tour" (pan map along the timeline)
- [ ] Coverage chart (events per era) · lightbox gallery · "cite this"
- [ ] Print / PDF export · offline PWA · contribution guide (add events via JSON/PR)

### Phase 5 — Multi-language (LAST step)
- [ ] i18n framework + language switcher
- [ ] **EN / FR / FA / AR**, with full **RTL** support for Persian & Arabic
- [ ] Translate UI chrome, then era/category names, then event content
