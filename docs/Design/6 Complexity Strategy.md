# Complexity Strategy

## Complexity Levels per Chapter

Legend:

- **L1 – Functional**: fade/crossfade only, minimal motion

- **L2 – Expressive**: 2–3 motion types, supports mood but restrained

- **L3 – Signature**: full orchestration, only for the unforgettable beats


What this strategy defines:

1. Level per chapter

2. What's allowed (within our asset capabilities)

3. What's explicitly _not_ allowed (to prevent scope creep)


---

## Asset Reality

Before diving into per-chapter complexity, remember our constraints:

**Available motion techniques:**
- Opacity (fade in/out)
- Transform (scale, translate)
- Crossfade between layers
- FG swap within scenes
- Parallax (BG at 0.8x, FG at 1.0x scroll speed)
- Violet mask/lens overlays
- Typography animation

**NOT available:**
- Crowd animation (crowds baked into BG)
- Independent soldier/patrol motion
- Particle systems or shatter simulation
- 3D transforms or camera movement
- MG (middle-ground) layer separation

---

### Chapter 1 – The Held Breath

**Level: 2 — Expressive**

**Why:**
It's the opening mood, not the climax. We need atmosphere and depth, but this is not the hero light show.

**Allowed:**

- Fade-in of C1BG from #0B0508

- C1FG1 (Ceci) fade-in with slight scale (1.02→1.0)

- C1FG2 (Jack) fade-in at scroll point

- BG/FG parallax (±4px / ±8px)

- Violet glow overlay at exit

- Progressive text reveals on parchment slabs


**Not allowed:**

- No complex masking sequences

- No morphing or 3D effects

- No fast motion—this is slow build


> Think: **"slow curtain lift"**, not "title sequence of an action movie."

---

### Chapter 2 – The Offer (Sheet Music)

**Level: 2 — Expressive**

**Why:**
This is a consent-contract scene, highly emotional but intimate, not spectacle.

**Allowed:**

- C2BG pinned + slight zoom (1.0→1.03)

- C2FG1 → couple-closeup crossfade

- Progressive text reveal with subtle offsets

- Parallax on FG elements


**Not allowed:**

- No lens effects in this chapter

- No aggressive transforms

- No multi-stage transitions—keep it simple


> Feels like **camera creeping closer across a table**, not a morphing VR world.

---

### Chapter 3 – Consent as Choreography (Dip Pose)

**Level: 2 — Expressive (almost 1.5)**

**Why:**
It's conceptually central but visually minimal. This is where restraint _is_ the style.

**Allowed:**

- C3BG + C3FG fade-in

- Subtle BG/FG parallax

- Staggered appearance of text chunks

- Slight darkening at exit


**Not allowed:**

- No complex masks

- No zoom effects—composition is static

- No multiple simultaneous motions—couple is the show


> This should feel **monastic**: all attention on the dip pose.

---

### Chapter 4 – The Crack (Mirror & Count)

**Level: 2 — Expressive**

**Why:**
Important beat, but it's the bridge to the true signature moments.

**Allowed:**

- Quick crossfade: mirror-intact → mirror-broken (200ms + 2px jitter)

- couple-standing fade-in

- Typographic beats "Un. Deux. Trois." with fade + drift-up

- Windows area slight brightness increase


**Not allowed:**

- No animated shards (mirror break is a simple swap)

- No complex 3D effects

- No particle systems


> Energetic but readable: **"a strong cut," not a VFX reel.**

---

### Chapter 5 – Authority Enters (Boots)

**Level: 1 — Functional**

**Why:**
This is pure context. We need clarity, not choreography—boots, order, unease, move on.

**Allowed:**

- C5BG with C5FG1 (boots) fade from bottom

- C5BG → C5BG2 crossfade

- Simple text slides/fades

- Violet hint at exit


**Not allowed:**

- No masking, no significant zoom

- No rich scroll-driven sequences; it's short and direct

- No multi-stage complexity


> Think **"cutaway shot"** between two key scenes. Minimal effort, maximum clarity.

---

### Chapter 6 – Violet Window (Hero)

**Level: 3 — Signature**

**Why:**
This is the **poster**. If we only fully orchestrate one thing, it's this.

**Allowed (full toolkit):**

- Scene sequence: C4BG composition → exterior-windows-silhouette → C2BG+couple-closeup → back to exterior

- Violet lens mask expanding for scene transitions

- Slow zoom into silhouettes (1000ms fade)

- Color shift: warm interior → violet-intense exterior

- Coordinated text and light timing

- Long crossfades (900-1200ms for hero beat)


**Not allowed:**

- No bounce or spring ease (breath, not bounce)

- No jarring effects or glitch

- No independent animation on crowd (crowd is baked into exterior-windows BG)


> This is **the shot people remember**. It earns the big toolkit.

---

### Chapter 7 – Heat & Tide (Crowd vs Patrol)

**Level: 3 — Signature**

**Why:**
This is the emotional and political climax combined. It shares "hero" status with Chapter 6.

**Allowed:**

- Scene alternation: C7BG (crowd) ↔ exterior-windows ↔ C7BG2 (interior)

- Multiple crossfades creating scene rhythm

- Subtle scale pulse on crowd BG (0.99→1.01 to suggest breathing)

- Text as emotional beats with timing coordination

- Violet intensity shift throughout


**Not allowed:**

- No independent crowd member animation (crowd as single organism)

- No new motion vocabulary—reuse established easing

- No complex morphing between scenes


> This is your **"dance + revolution montage"**: scene rhythm, not chaos.

---

### Chapter 8 – Release (Exhale, Dark Hold)

**Level: 2 — Expressive**

**Why:**
It's the comedown after Level 3 sections. It must feel quieter by design.

**Allowed:**

- Scene alternation: C8BG (soldiers) ↔ C8BG2 (dancers) ↔ C8BG3 (night interior)

- Typography bridge in large Canela ("When the final note faded...")

- Slow color fade from violet to near-black

- Very gentle crossfades (longer durations)


**Not allowed:**

- No complex masks or multi-part transitions

- No new motion tricks introduced here

- No fast interactions—it's slow and heavy


> **Soft landing zone** before the epilogue; emotionally loaded but visually restrained.

---

### Chapter 9 – Residue & Dawn (Brooms → CJ → Hold)

**Level: 2 — Expressive (with tiny L3 moment at final hold)**

**Why:**
This is the epilogue: still important, but it needs to feel smaller and more intimate than Chapters 6–7.

**Allowed:**

- Dawn light expansion effect at entry

- C9BG + C9FG parallax (couple with brooms)

- Scene sequence: dawn room → CJ door → brooms floor

- Soft zoom on final hold

- Stacked poem text with deliberate pacing


**Not allowed:**

- No complex multi-layer orchestrations

- No heavy parallax stacks

- No new "hero" moments competing with violet window


> It's **quiet magic**, not another fireworks show.

---

## Sanity Check: Page-wide Mix

- **Level 3 (Signature):**

    - Chapter 6 – Violet Window

    - Chapter 7 – Heat & Tide
        → **2 signature chapters** (perfect target)

- **Level 2 (Expressive):**

    - Chapters 1, 2, 3, 4, 8, 9
        → **6 expressive chapters**

- **Level 1 (Functional):**

    - Chapter 5 only (short)
        → **1 purely functional bridge**


This aligns with the rule-of-thumb:

- ~65–70% of the journey is **Level 2**

- ~20–25% is **Level 3** concentrated in the middle

- ~10–15% **Level 1** for structural, contextual beats


If anyone tries to crank Chapter 5 or 3 up to Level 3, the answer is **no**: those chapters work precisely because they're _quiet_.

---

## Motion Budget Summary

| Chapter | Level | Duration Weight | Primary Motion |
|---------|-------|-----------------|----------------|
| 1 | L2 | ~11% | Fade, parallax, progressive reveal |
| 2 | L2 | ~9% | Zoom, crossfade |
| 3 | L2 | ~7% | Parallax, hold |
| 4 | L2 | ~11% | FG swap (mirror), typography |
| 5 | L1 | ~9% | Crossfade only |
| 6 | L3 | ~15% | **Full toolkit** |
| 7 | L3 | ~12% | Scene alternation, scale pulse |
| 8 | L2 | ~14% | Alternation, typography bridge |
| 9 | L2 | ~12% | Light expand, final hold |

---

## Asset Constraints Reminder

**What we CAN do with motion:**
- Crossfade between any BG images
- Layer FG elements with independent opacity/transform
- Apply violet mask/lens as overlay
- Scale/translate for zoom/parallax
- Treat complete scenes as "breathing" via subtle scale pulse

**What we CANNOT do:**
- Animate individual figures within BG images
- Create separate parallax on crowd/patrol elements
- Complex morphing between illustrations
- 3D camera movement or perspective shifts
- Particle/shatter effects
