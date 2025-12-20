## Design Direction: Violet Square Noir

### The Big Idea

A cinematic waltz in ink and violet light—two silhouettes in a Paris window, replayed as an immersive scroll.

**Keywords**

- Velvet noir
    
- Street-level glamour
    
- Smoke, flour, lilac silk
    
- Chiaroscuro silhouettes
    
- Violet stage light
    
- Revolt-as-dance
    
- Fate, not fantasy
    

**Tone**  
Luxury noir / editorial-movie-poster hybrid. Think: couture show in a half-ruined ballroom during a revolution—refined, but the plaster is still falling.

---

## Typography

**Display:** **Canela** (or equivalent high-contrast editorial serif)

- **Why:** Soft curves with razor-thin hairlines—perfect for “old glamour under pressure.” It feels like a perfume ad that wandered into a radical pamphlet. The high contrast mirrors candlelight on cheekbones and broken mirrors.
    
- **Usage:** Titles, chapter markers, large pull quotes, the C/J monogram treatments, and on key scrollytelling beats (“Un. Deux. Trois.” as full-screen typographic moments).
    

**Body:** **Literata** (or similar warm, bookish serif)

- **Why:** It reads like a novel, not a blog. Slightly calligraphic modulation keeps it human and intimate—appropriate for consent, breath, and small choices that matter. It can handle long paragraphs without feeling digital or clinical.
    
- **Usage:** Main narrative text, captions, footnotes, epistolary inserts (letters, notes) at slightly tighter leading.
    

**Tension between them**  
Canela is polished stage-light glamour; Literata is the worn page of a hidden letter. Together: performance vs interiority—exactly the Ceci/Jack split.

---

## Color

**Primary:** **#0B0508 — “Velvet Soot”**

- **Role:** Dominant background. A near-black with a whisper of wine. It keeps everything in dusk-mode, like a stairwell lit from a distant square. 60–70% of the interface should sit on this, especially the main scrollytelling canvas.
    
- **Meaning:** Night, secrecy, alleyways, backstage corridors. It grounds the heat.
    

**Secondary:** **#F4E3C9 — “Bakery Parchment”**

- **Role:** Text panels, chapter blocks, and inset epistolary moments (notes, chalk marks, sheet music). Used as a page-like slab that slides over Velvet Soot.
    
- **Meaning:** Flour dust, old paper, candlelit skin. It brings warmth and humanity.
    

**Accent:** **#A248FF — “Stage Violet”**

- **Role:** This is the story’s soul-marker. Used for:
    
    - Window light washes
        
    - Progress indicator on scroll
        
    - C/J monogram details
        
    - Interactive states (hover underlines, key buttons)
        
- **Meaning:** Fate, magnetism, the unexplainable pull between Ceci and Jack. This is the violet fire in the windows.
    

**Supporting Neutrals (very sparing):**

- Deep brass **#9B7A46** for subtle rules/dividers (like a tarnished frame).
    
- Desaturated blood **#6A1E29** as a rare highlight for danger/violence (never glamorized, always consequential).
    

---

## Motion

**Timing Philosophy**

- **Primary easing:** `cubic-bezier(0.33, 0.0, 0.15, 1.0)`
    
    - Quick in, long out—a breath exhaled.
        
- **Durations:**
    
    - Core transitions: **450–650ms**
        
    - “Held breath” moments (mirror crash, patrol arrival, final C/J mark): **900–1200ms** with a micro-pause before movement begins.
        
- **Scroll-tied motion:** Parallax and opacity shifts mapped directly to scroll position—no arbitrary auto-play. The user “conducts” the scene.
    

**Character of Motion**

- **Breath, not bounce.** Nothing springs or bounces. Elements **fade and drift** like smoke or fabric.
    
- **Snag moments.** When the violin falters or the mirror drops, introduce a tiny 2–3px jitter or a single-frame “stutter” on the illustration and a brief pause in scroll-based transitions—like the room catching its breath.
    
- **Violet Swell.** When the patrol enters, the violet accent washes slowly into the scene, then recedes as they are pushed back—motion as power shift, not decoration.
    
- **Consent as choreography.** Interactions that represent consent (hover on “Will you follow?”, “Follow me,” “Always”) get soft, deliberate transitions: a gentle glow or underline that grows in, never flashes.
    

---

## Logo

Think of this as the identity for the experience, not a generic brand. Working title: **“Violet Square”**.

|Aspect|Specification|
|---|---|
|Primary lockup|**C/J monogram** set in Canela small caps, separated by a slender slash, chalk-textured, in #F4E3C9 on #0B0508, with a faint smear of #A248FF behind—as if thumb-smudged.|
|Alternatives|1) Wordmark “VIOLET SQUARE” in tracking-wide Canela, 2) Minimal “C/J” enclosed in a rough circular chalk mark.|
|Clearspace / min size|Clearspace equal to the height of the “J” around all sides; minimum digital size: 32px height for legibility of the slash and chalk texture.|
|Common lockups|Horizontal: C/J monogram left + “VIOLET SQUARE” right. Stacked: C/J above, title below. Icon-only: just the C/J mark or chalk circle for favicons, scroll markers.|

---

## Illustration & Icon Style

This must feel like a series of film stills, not generic vector art.

|Property|Value|
|---|---|
|Stroke|Mostly **no harsh outlines**; where outlines exist, they’re thin, slightly irregular, like ink pen on textured paper.|
|Fill|Flat or gently gradiented blocks of shadow, with heavy use of black/near-black shapes; faces often in semi-shadow with minimal detail—emphasis on posture and gesture.|
|Palette|Velvet Soot (#0B0508), Bakery Parchment (#F4E3C9), Stage Violet (#A248FF), Brass (#9B7A46), Blood-muted (#6A1E29). Violet is always light-as-substance (windows, ribbon, smoke), never just a flat UI chip.|
|Detail level|**Medium-high but selective.** Grain, smoke, fabric folds, flour dust in the light beam. Faces simplified, eyes often implied rather than rendered. Focus detail on soul-markers: messy hair, cigarette curls, sash, scars when shown.|

**Illustration Content Rules**

- **Consent foregrounded:** bodies angled toward one another, hands hovering just before touch, visible nods or matched steps. No forced framing.
    
- **Substances as texture:** cigarettes for smoke and line, not glorified props; no decadent still-lifes of bottles. The aftermath looks tired, not glamorous.
    
- **Violence = consequence:** if shown, it’s in aftermath—broken glass, abandoned boots, scuffed walls—not impact.
    
- **Soul-markers embedded:**
    
    - Ceci’s lilac sash + messy pinned hair
        
    - Jack’s tousled hair, tobacco smoke tracing the violet light
        
    - Optional crescent wrist scar catching purple light in a close-up panel
        

Icons (for UI controls like “Scroll”, “Mute”, “Chapters”) should be minimal line-based, as if scratched into wood with chalk-filled grooves.

---

## Layout Patterns

### Hero

|Element|Pattern|
|---|---|
|Hero|Full-bleed dark canvas (#0B0508) with a central **window frame** motif. Inside: Ceci & Jack as silhouettes in violet light, mid-step, seen from across the square. Title “VIOLET SQUARE” in Canela large, bottom-left, with a small C/J chalk mark near the corner. A subtle instruction like “Scroll to fall into the square” in tiny Literata, off to the side—intimate, not shouty.|

### Sections (Scrollytelling Structure)

|Element|Pattern|
|---|---|
|Sections|Vertical scroll with **anchored narrative beats**: each “scene” is a band where the text block (on Bakery Parchment slab) overlaps the illustration. Text slides in from the side over a static or slowly evolving illustration. Occasional “full blackout” breaks—just a line of text in large Canela over Velvet Soot—to punctuate (“Un. Deux. Trois.”, “Ceci moved first.”).|

### Cards

|Element|Pattern|
|---|---|
|Cards|No generic cards. Instead: **“Fragments”**—rough-edged, parchment blocks with slightly irregular borders, like torn flyers. Used for: short side-notes (date, location—“Paris, 1789”), small character flashes (a line from Jack or Ceci), or historical footnotes. Hover reveals a mild shift of Stage Violet along the edge, like light catching paper.|

### Buttons & CTAs

|Element|Pattern|
|---|---|
|Buttons & CTAs|Solid #A248FF background on #0B0508, with Canela small caps, generous letterspacing. Rounded rectangles with subtly imperfect edges (slight noise on mask). Hover: violet deepens and a faint inner glow appears, like stage lights warming up. For secondary actions, invert: outline in Stage Violet with transparent interior and parchment text. No drop shadows; we rely on color and subtle glow.|

**Key Interactive Moments**

- **Scroll marker:** A slim vertical line at the side in Stage Violet that fills as you progress through the story; a tiny C/J icon climbs with the reader.
    
- **Consent lines as hotspots:** Lines like “Will you follow?” and “Follow me” can be interactive—on hover, a faint echo of the line appears behind it, shifted by 1–2px, suggesting another life where the line was spoken slightly differently.
    

---

## The Differentiation Test

**What’s the one thing someone will remember 24 hours later?**

The image of **two indistinct silhouettes fused in violet light at a Paris window, the city’s crowd and soldiers held in their orbit, marked only by a chalked “C/J”**—and the feeling that the entire interface moved like their dance: slow, deliberate, velvet-dark, and impossible to mistake for anything else.