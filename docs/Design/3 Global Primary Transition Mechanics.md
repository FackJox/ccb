# Global Primary Transition Mechanics

## Layer Reality

We work with **2-layer compositions** (BG + FG) for most scenes, occasionally 3 layers (BG + FG1 + FG2). There are no separate MG (middle-ground) layers—crowds, soldiers, and architectural details are baked into BG images.

**Available motion on layers:**
- Opacity (fade in/out)
- Transform (scale, translate, rotate)
- Crossfade between BG images

---

## Primary Mechanic 1 — **Lens (Mask via Violet Light)**

This is the core move of Violet Square Noir.

**Concept:**
Violet light (#A248FF) behaves like a _lens_ that reveals the next scene. Instead of fading between static images, we "wipe" with light and shadow.

**With our assets:**
- Use a **soft, organic mask** of stage-violet that:
    - Expands to reveal the next BG **behind** the current one
    - Or contracts to "close" a scene
- **BG** crossfades; **FG** transitions independently (quicker or delayed)
- Always tied to scroll (Storyteller physics), eased with `ease-brand-enter` / `ease-brand-exit`

---

## Primary Mechanic 2 — **Scene Crossfade with Shared Element**

We leverage **reused assets** as visual bridges:

- shared/couple-closeup appears in both Ch2 and Ch6
- shared/couple-standing appears in Ch4 and Ch6
- shared/exterior-windows-silhouette appears in Ch6 and Ch7

**Practically:**
- When transitioning between scenes using the same shared FG, keep it **pinned** while BG crossfades
- Creates visual continuity without complex morphing
- Example: Ch6D → Ch6E: couple-closeup fades out while exterior-windows fades in

---

## Primary Mechanic 3 — **FG Layer Swap**

Used for state changes within a scene.

**Key example — Chapter 4 (Mirror):**
- 4A: C4BG + mirror-intact
- 4B: C4BG + mirror-broken + couple-standing
- Transition: Quick crossfade of mirror FG layers (intact → broken) with `ease-brand-transform`

**Rules:**
- BG stays static during FG swap
- Swap duration: 200-300ms (sharp, not floaty)
- Can add 2-3px jitter for "impact" moments (mirror crash)

---

## Accent Mechanic — **Parallax Drift**

Used sparingly since we only have 2-3 layers.

- BG moves slower than FG on scroll
- Typical ratio: BG at 0.8x scroll speed, FG at 1.0x
- Creates subtle depth without complex layer stacks
- Most effective on scenes with clear FG separation (Ch1, Ch4, Ch9)

---

## Per-Chapter Transition Notes

### 1 → 2
**Held Breath → The Offer**

- **Method:** Violet lens mask + BG crossfade
- **BG:** C1BG fades, violet glow expands from center, C2BG fades in through mask
- **FG:** C1FG1 + C1FG2 fade out; C2FG1 fades in
- **Text:** "'Will you follow?'" bridges the transition

---

### 2 → 3
**The Offer → Consent as Choreography**

- **Method:** Portal zoom + BG crossfade
- **BG:** Slow zoom into C2 couple, C2BG darkens, C3BG fades in
- **FG:** couple-closeup shrinks/fades; C3FG (dip pose) scales up from center

---

### 3 → 4
**Consent → The Crack**

- **Method:** Scene crossfade + text bridge
- **BG:** C3BG → C4BG crossfade
- **FG:** C3FG fades; mirror-intact appears
- **Text:** Mirror description bridges

---

### 4 → 5
**The Crack → Authority Enters**

- **Method:** Vertical wipe + theme shift
- **BG:** C4BG wipes down to reveal C5BG (boots POV)
- **FG:** mirror-broken + couple-standing fade; C5FG1 (boots) fades in from bottom
- **Color:** Interior warmth → cooler street tones

---

### 5 → 6
**Authority Enters → Violet Window**

- **Method:** Lens (violet window glow expands)
- **BG:** C5BG2 darkens; violet glow appears at top; exterior-windows-silhouette revealed
- **FG:** boots fade; hero silhouette composition holds
- **This is the signature transition** — take 900-1200ms

---

### 6 → 7
**Violet Window → Heat & Tide**

- **Method:** Scene sequence (multiple BG crossfades within chapter)
- Ch6 already contains scene changes (ballroom ↔ exterior ↔ closeup)
- Ch7 continues with crowd/interior alternation
- **FG:** shared/exterior-windows-silhouette reused, creates continuity

---

### 7 → 8
**Heat & Tide → Release**

- **Method:** Theme/color shift + slow fade
- **BG:** C7BG2 → C8BG crossfade
- **Color:** Violet intensity drops; warmer, dimmer tones
- **Text:** "Final note faded, the city exhaled" as typography bridge

---

### 8 → 9
**Release → Residue & Dawn**

- **Method:** Light expansion (dawn)
- **BG:** C8BG3 darkens further; pale parchment light expands from corner; C9BG revealed
- **FG:** C9FG (couple brooms) fades in
- **Color:** Near-black → warm dawn tones

---

## Transition Summary Table

| Transition | Primary Method | Duration | Complexity |
|------------|---------------|----------|------------|
| 1 → 2 | Violet lens mask | 600ms | L2 |
| 2 → 3 | Portal zoom | 500ms | L2 |
| 3 → 4 | Crossfade | 450ms | L1 |
| 4 → 5 | Vertical wipe | 500ms | L2 |
| 5 → 6 | Violet lens (signature) | 1000ms | L3 |
| 6 → 7 | Scene sequence | varies | L3 |
| 7 → 8 | Color shift + fade | 700ms | L2 |
| 8 → 9 | Dawn light expansion | 800ms | L2 |

---

## Asset Constraints

**What we CAN do:**
- Crossfade between any BG images
- Layer FG elements over BG with independent opacity/transform
- Reuse shared assets across transitions for continuity
- Apply violet mask/lens effects as overlays
- Scale/translate layers for zoom/parallax effects

**What we CANNOT do:**
- Animate individual crowd members (baked into BG)
- Separate parallax on MG elements (no MG layers)
- Complex morphing between different illustrations
- Independent soldier/patrol animation

**Workarounds:**
- Treat crowd BGs as "breathing" organisms via subtle scale pulsing
- Use text animation to carry energy when visuals are static
- Lean on violet light overlays to add dynamism to complete scenes
