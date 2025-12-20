# Chapter Motion Boards

Per-chapter motion annotations with **Entry / Focus / Exit** for each chapter. References actual assets only.

**Layer notation:**
- 📦 BG: Background layer
- 📦 FG: Foreground layer(s)
- ⚡ Trigger: Scroll position or event
- ⚓ Anchor: Pinned element during scroll

---

## Chapter 1 – The Held Breath

**Assets:** C1BG + C1FG1 (Ceci) + C1FG2 (Jack)
**Story copy:** Opening through "Let them look. Let the city breathe again."

| Frame | Motion | Notes |
|-------|--------|-------|
| **Entry** | Fade, Parallax | ⚡ On Load: BG fades in from #0B0508. FG Ceci (C1FG1) fades in center-left with slight scale (1.02→1.0). Text blocks appear on parchment slabs. |
| **Focus (1A→1B)** | Fade, Offset | ⚡ On Scroll: Jack (C1FG2) fades in from right. Subtle parallax: FG moves ±8px vs BG ±4px. Text slabs stack with 40ms stagger. |
| **Focus (1B→1C)** | Parallax | Text continues stacking. "Let them look. Let the city breathe again." in larger Canela, centered low. |
| **Exit** | Fade, Zoom | BG darkens. Soft zoom toward center (Ceci). Violet glow begins to appear, prepping Ch2 transition. |

---

## Chapter 2 – The Offer

**Assets:** C2BG + C2FG1 (couple at table) + shared/couple-closeup
**Story copy:** "Jack set it down…" through "Her palm hovered near his wrist…"

| Frame | Motion | Notes |
|-------|--------|-------|
| **Entry** | Mask, Fade | ⚡ From Ch1: Violet lens completes. C2BG fades in. C2FG1 (table scene) appears. First text block pins top-left. |
| **Focus (2A)** | Offset, Zoom | ⚡ On Scroll: Slight zoom (1.0→1.03) on table scene. Text blocks stack with progressive reveal. |
| **Focus (2A→2B)** | Crossfade | C2FG1 fades; couple-closeup fades in. BG stays. "Consent lives in small sentences." appears. |
| **Exit** | Zoom | Slow zoom into couple-closeup. Text about hands hovering. Prep for Ch3. |

---

## Chapter 3 – Consent as Choreography

**Assets:** C3BG (ballroom) + C3FG (couple dip pose)
**Story copy:** "They began again…" through mirror introduction

| Frame | Motion | Notes |
|-------|--------|-------|
| **Entry** | Fade, Scale | ⚡ From Ch2: Zoom resolves. C3BG + C3FG fade in. Couple dip pose centered. |
| **Focus (3A)** | Parallax | ⚓ Couple as anchor. Subtle BG/FG parallax. Text: "Her weight forward, his back; his lead, her follow." |
| **Focus (3B)** | Hold | Same composition. Text about pattern older than names. Mirror text begins. |
| **Exit** | Fade | Slight darkening. Text about mirror slipping bridges to Ch4. |

---

## Chapter 4 – The Crack

**Assets:** C4BG + shared/mirror-intact + shared/mirror-broken + shared/couple-standing
**Story copy:** Mirror crash through "Un. Deux. Trois."

| Frame | Motion | Notes |
|-------|--------|-------|
| **Entry (4A)** | Fade | ⚡ From Ch3: C4BG + mirror-intact appear. Tension building. |
| **Focus (4A→4B)** | FG Swap | ⚡ On Scroll at crash point: mirror-intact → mirror-broken (quick 200ms crossfade + 2px jitter). couple-standing fades in. |
| **Focus (4B)** | Typography | "Un. Deux. Trois." as large sequential Canela beats. Each word: fade in center → drift up. 100-150ms delay between. |
| **Exit** | Fade, Zoom | Text about voice through windows. Zoom toward implied windows. Prep for street POV. |

---

## Chapter 5 – Authority Enters

**Assets:** C5BG (square) + C5FG1 (boots) + C5BG2 (night street)
**Story copy:** "Boots entered the square…" through "Ceci moved first."

| Frame | Motion | Notes |
|-------|--------|-------|
| **Entry (5A)** | Wipe, Fade | ⚡ From Ch4: Vertical wipe reveals C5BG. C5FG1 (boots) fades in from bottom. Authority POV. |
| **Focus (5A)** | Hold | Text about boots, patrol. Minimal motion—this is a context beat. |
| **Focus (5B-D)** | Crossfade | ⚡ On Scroll: C5BG → C5BG2 (night street). Text progression: captain's order, Ceci's response. |
| **Exit** | Fade, Color | Street darkens. Violet reflection hint appears. "Ceci moved first." as transition line. |

---

## Chapter 6 – Violet Window (Hero)

**Assets:** C4BG + shared/mirror-broken + shared/couple-standing, shared/exterior-windows-silhouette, C2BG + shared/couple-closeup
**Story copy:** "Ceci moved first…" through "Only shadows remained…"

| Frame | Motion | Notes |
|-------|--------|-------|
| **Entry (6A)** | Crossfade | Reuse C4BG composition with mirror-broken + couple-standing. Continuation from Ch4/5. |
| **Focus (6A→6B)** | Fade | Same composition, text progression about killing lanterns, violet surge. |
| **Focus (6C)** | Signature | ⚡ **HERO BEAT:** exterior-windows-silhouette fades in (1000ms). Violet light intensifies. This is the poster shot. |
| **Focus (6D)** | Crossfade | Interior intimate: C2BG + couple-closeup. "Follow me." "Always." Large quotes. |
| **Focus (6E)** | Return | Back to exterior-windows-silhouette. "Someone clapped on the count." |
| **Exit** | Hold | Silhouette held. Violet at peak. Prep for crowd scenes. |

---

## Chapter 7 – Heat & Tide

**Assets:** C7BG (crowd square), shared/exterior-windows-silhouette, C7BG2 (interior windows)
**Story copy:** "The patrol tried to push through…" through "A question. A vow."

| Frame | Motion | Notes |
|-------|--------|-------|
| **Entry (7A)** | Crossfade | ⚡ From Ch6: C7BG (crowd scene) fades in. Complete scene, no separate layers. |
| **Focus (7A)** | Subtle scale | Text about patrol, crowd moving. BG can pulse subtly (0.99→1.01 scale) to suggest crowd breathing. |
| **Focus (7B)** | Crossfade | exterior-windows-silhouette returns. Continuity with Ch6. Text about heat. |
| **Focus (7C-D)** | Crossfade | C7BG2 (interior windows). Intimate text. "A question. A vow." |
| **Exit** | Fade | Violet intensity begins dropping. Color shift warmer. |

---

## Chapter 8 – Release

**Assets:** C8BG (street soldiers), C8BG2 (dancing crowd), C8BG3 (night interior)
**Story copy:** "From the street, they looked untouchable…" through "In the dark, Ceci rested her forehead…"

| Frame | Motion | Notes |
|-------|--------|-------|
| **Entry (8A)** | Crossfade | C8BG (street scene). Complete composition. |
| **Focus (8A↔8B)** | Alternating | ⚡ On Scroll: Alternate between C8BG (soldiers retreat) and C8BG2 (dancers triumph). |
| **Focus (8C↔8D)** | Continue | Same alternation pattern. Text about tide taking space. |
| **Focus (8E)** | Crossfade | C8BG3 (night interior). "Final note faded." Typography bridge in large Canela. |
| **Exit** | Fade | Near-black. "Forehead against his." Very slow, tender. |

---

## Chapter 9 – Residue & Dawn

**Assets:** C9BG (dawn room) + C9FG (couple brooms), C9BG2 (CJ door), C9BG3 (brooms floor)
**Story copy:** "At dawn, they broomed glass…" through "New as dawn."

| Frame | Motion | Notes |
|-------|--------|-------|
| **Entry (9A)** | Light expand | ⚡ From Ch8: Dawn light expands from corner. C9BG + C9FG fade in. Warm tones. |
| **Focus (9A-B)** | Parallax | ⚓ Couple with brooms as anchor. Subtle BG/FG parallax. Text about brooming glass. |
| **Focus (9C)** | Crossfade | C9BG2 (CJ door). "Someone had chalked a bright CJ…" Text as caption beside door. |
| **Focus (9D)** | Crossfade | C9BG3 (brooms floor). Final lines as stacked poem. |
| **Exit (Final)** | Hold | ⚡ **FINAL HOLD:** Very slow parallax drift. "Old as anything. New as dawn." Long dissolve to end. |

---

## Layout Patterns

### Progressive Blocks ("Fragments")

- **Form:** Rough-edged parchment (#F4E3C9) rectangles, 1-3 lines of text (Literata)
- **Placement:** Stack vertically as reader scrolls, offset 4-8px for torn-flyer feel
- **Hierarchy:** First clause sometimes in Canela small caps

### Story Columns

- **Form:** Fixed-width vertical column (4-5 grid columns) for longer text passages
- **Use:** When text needs to flow between visual changes (Ch7 split-stage, Ch8)
- **Top line:** Canela heading, body in Literata

---

## Motion Summary by Chapter

| Chapter | Complexity | Primary Motion | Notes |
|---------|------------|----------------|-------|
| 1 | L2 | Fade, parallax | Slow build, establish mood |
| 2 | L2 | Zoom, crossfade | Intimate, restrained |
| 3 | L2 | Parallax, hold | Monastic focus on couple |
| 4 | L2 | FG swap, typography | Sharp mirror beat |
| 5 | L1 | Crossfade | Context beat, minimal |
| 6 | L3 | Mask, crossfade | **Hero chapter** |
| 7 | L3 | Scene alternation | Political/intimate interweave |
| 8 | L2 | Alternation, fade | Decompression |
| 9 | L2 | Light expand, hold | Epilogue, gentle fade |
