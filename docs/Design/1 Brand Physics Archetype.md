
**Primary archetype:** **Storyteller** — _Atmospheric & Linear_  
**Secondary archetype:** **Sophisticate** — _Fluid & Viscous_

> **Organism test:**  
> This brand moves like a dancer in a smoky ballroom at 3 a.m.—heavy fabric, controlled pivots, long exhalations. Never bouncy, never twitchy.

**Implications**

- **Time feels continuous.** Motion suggests _unbroken scenes_ rather than UI “states.” Scroll = camera dolly, not slot machine.
    
- **Weight is real.** Things don’t pop; they _arrive_, like bodies stepping into light. Exits feel like fading smoke, not quick cuts.
    
- **Violet is a force.** Light behaves like a liquid: it spills, pools, and recedes. It’s the closest thing this brand has to “magic physics.”
    
- **Consent = synchronization.** When two elements move in sync, it signals agreement; misaligned timing reads as tension or resistance.
    

---

### 0.2 Motion Tokens

Define these as canonical tokens. Everything maps back here.

#### Easing Tokens

- `ease-brand-enter`  
    `cubic-bezier(0.33, 0.0, 0.15, 1.0)`
    
    - Quick enough to feel like a breath in, long tail on exit.
        
    - Used for: text appearing, illustrations drifting into place, violet light swells.
        
- `ease-brand-exit`  
    `cubic-bezier(0.25, 0.0, 0.35, 1.0)`
    
    - Slightly heavier, more viscous exit. Feels like smoke dispersing or a curtain falling.
        
    - Used for: scene fade-outs, elements sinking into darkness, modals closing.
        
- `ease-brand-transform`  
    `cubic-bezier(0.45, 0.0, 0.15, 1.0)`
    
    - Starts firm, ends slow—like a dancer pivoting then holding.
        
    - Used for: state changes (card → full-bleed scene), crowd density shifts, FLIP layout morphs.
        

> **Hard rule:**  
> No spring / bounce / overshoot easing. This world is velvet and gravity, not rubber.

#### Duration Scale

- **Micro-interactions** (buttons, hover reveals, tiny flourishes)
    
    - `brand-micro-fast`: **120–160ms** (opacity-only, color changes)
        
    - `brand-micro`: **200–260ms** (small moves, glow, underline grows)
        
- **Content / Section transitions**
    
    - `brand-section`: **450–650ms**
        
        - Default for text blocks sliding/fading, illustration entrances.
            
    - `brand-section-held`: **750–900ms**
        
        - Used when we want a “held breath” before content settles (e.g., after mirror crash).
            
- **Signature moments**
    
    - `brand-signature`: **900–1200ms**
        
        - Violet window flood, crowd tide, final dawn hold.
            
        - Can include a **100–150ms delay** before movement starts to create that “heartbeat snag.”
            

> **Tempo heuristic:**  
> If it feels like a series of cuts, slow it down. If it feels like molasses, shorten the first 40% of the easing curve.

#### Motion Density

- **Global setting:** **Balanced → Rich, with strict hierarchy.**
    
    - **Narrative lanes (scrollytelling hero):** Rich
        
        - Multiple elements can move, but always tied to scroll and emotion beats.
            
    - **UI chrome (nav, controls):** Minimal
        
        - Simple fades, color shifts, micro slides—no choreographed circus in the header.
            
    - **Signature beats:** Cinematic
        
        - Mirror crash, violet window, crowd tide, dawn aftermath. We’re allowed layered parallax, light sweeps, and synchronized motions here.
            

**Density rules:**

- Every scene has **one primary moving element** (light, characters, or crowd) and **one secondary** (text or small detail). Never animate everything at once.
    
- If a beat is about **consent or intimacy**, motion slows and simplifies:
    
    - Fewer elements moving, lighter parallax, long easing tails.
        
- If a beat is about **crowd vs authority**, we animate **mass, not individuals**:
    
    - The crowd pulses as one organism. Soldiers feel rigid and slightly out-of-sync, then fragment.
        

---

### 0.3 Semantic Motion Rules (for future phases)

These are the “no-argue” laws you’ll reuse in Chapter Maps, Scroll Timelines, and Storyboards:

1. **Violet = Fate / Magnetism**
    
    - When violet light **enters**, it’s always a **slow swell** (≥ 600ms).
        
    - When violet **leaves**, it falls away faster than the characters, like the spell breaking.
        
2. **Light = Emotional Volume**
    
    - More light = more shared understanding, not just more brightness.
        
    - Confusion or threat → light narrows into slits, spotlights, or shards.
        
3. **Consent = Synchronized or Mirrored Motion**
    
    - Mutual agreement: elements move in the **same direction / tempo**.
        
    - Tension: characters / layers move on slightly offset timings or opposing directions.
        
4. **Authority = Rigid Motions, Quickly Invalidated**
    
    - Patrol / “control” elements move in straight lines, abrupt starts/stops.
        
    - The crowd and Ceci/Jack curves and sways; their motion **absorbs** and **dissolves** straight motions over time.
        
5. **Memory / Recurrence = Ghost Trails**
    
    - Repeated lines or lives (“Follow me”, “Always”) can echo with faint afterimages or type ghosts fading behind the current line.
        

---
