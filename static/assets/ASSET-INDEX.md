# CCB Scrollytelling Asset Index

## Overview

- **Total Chapters**: 9
- **Total Frames**: 31
- **Viewport**: 852 × 393 (iPhone 14/15 Pro landscape)
- **Background Color**: #24102F (dark purple)

---

## Shared Assets

Assets used across multiple chapters. Reference these from `shared/` to avoid duplication.

### Shared Foreground Elements

| File | Description | Used In Frames |
|------|-------------|----------------|
| `shared/fg/couple-closeup.png` | Ceci & Jack dancing embrace (closeup) | 2B, 6D |
| `shared/fg/couple-standing.png` | Ceci & Jack standing/pointing pose | 4B, 6A, 6B |
| `shared/fg/mirror-intact.png` | Ornate gold mirror (intact) | 4A |
| `shared/fg/mirror-broken.png` | Ornate gold mirror (shattered) | 4B, 6A, 6B |

### Shared Background Elements

| File | Description | Used In Frames |
|------|-------------|----------------|
| `shared/bg/exterior-windows-silhouette.png` | Building exterior with purple windows, dancing silhouette, crowd below | 6C, 6E, 7B |

---

## Chapter Asset Breakdown

### Chapter 1: The Held Breath
**Frames**: 1A, 1B, 1C
**Scene**: Ceci claims the confiscated hôtel hallway

| Asset | Type | Description |
|-------|------|-------------|
| `C1/C1BG.png` | Background | Room interior with large window |
| `C1/C1FG1.png` | Foreground | Ceci sitting/kneeling in purple dress |
| `C1/C1FG2.png` | Foreground | Jack standing with violin |

**Layer Composition**:
- 1A: C1BG + C1FG1
- 1B: C1BG + C1FG1 + C1FG2
- 1C: C1BG + C1FG1 + C1FG2

**Text Content**:
- 1A: "The violin faltered once, a heartbeat snag..." / "In the lamplight, flour still ghosted her wrists..." / "She lifted her chin—three-count nested in the pause..."
- 1B: "From the corner, where a restless lantern cluster hissed..." / "He knew it before he knew her name. He knew it the way a city knows rain."
- 1C: "They were supposed to be alone, 'rehearsing,'..." / "Windows bare to the square..." / "Let them look. Let the city breathe again"

---

### Chapter 2: The Offer
**Frames**: 2A, 2B
**Scene**: Ink, sheet music, "Will you follow?"

| Asset | Type | Description |
|-------|------|-------------|
| `C2/C2BG.png` | Background | Dark room interior with arches |
| `C2/C2FG1.png` | Foreground | Couple at table with sheet music |
| `shared/fg/couple-closeup.png` | Foreground | Couple dancing embrace (closeup) |

**Layer Composition**:
- 2A: C2BG + C2FG1
- 2B: C2BG + couple-closeup

**Text Content**:
- 2A: "Jack set it down, unwound twine..." / "Ceci studied the marks as if the music could bruise..."
- 2B: "Consent lives in small sentences..." / "Her palm hovered near his wrist without touching..."

---

### Chapter 3: Consent as Choreography
**Frames**: 3A, 3B
**Scene**: Hover, nod, first steps

| Asset | Type | Description |
|-------|------|-------------|
| `C3/C3BG.png` | Background | Ballroom wide view with chandelier |
| `C3/C3FG.png` | Foreground | Couple in dramatic dip pose |

**Layer Composition**:
- 3A: C3BG + C3FG
- 3B: C3BG + C3FG

**Text Content**:
- 3A: "They began again. Her weight forward, his back; his lead, her follow." / "A pattern older than their names."
- 3B: "When the mirror on the far wall slipped its wire and crashed, the silence struck like a held breath—but Ceci didn't flinch."

---

### Chapter 4: The Crack
**Frames**: 4A, 4B
**Scene**: Mirror shatter & call to the city

| Asset | Type | Description |
|-------|------|-------------|
| `C4/C4BG.png` | Background | Ballroom corner with ornate wall |
| `shared/fg/mirror-intact.png` | Foreground | Mirror before shattering |
| `shared/fg/mirror-broken.png` | Foreground | Mirror after shattering |
| `shared/fg/couple-standing.png` | Foreground | Couple standing pose |

**Layer Composition**:
- 4A: C4BG + mirror-intact
- 4B: C4BG + mirror-broken + couple-standing

**Text Content**:
- 4A: "When the mirror on the far wall slipped its wire and crashed, the silence struck like a held breath—but Ceci didn't flinch."
- 4B: "'Un. Deux. Trois.'" / "Her voice carried out the open windows and pulled the square into rhythm."

---

### Chapter 5: Authority Enters
**Frames**: 5A, 5B, 5C, 5D
**Scene**: Boots in the square

| Asset | Type | Description |
|-------|------|-------------|
| `C5/C5BG.png` | Background | Square scene with arched building |
| `C5/C5BG2.png` | Background | Night street with market stalls |
| `C5/C5FG1.png` | Foreground | Soldier boots/legs |

**Layer Composition**:
- 5A: C5BG + C5FG1
- 5B: C5BG2
- 5C: C5BG2
- 5D: C5BG2

**Text Content**:
- 5A: "Boots entered the square below—sharp, official, unwelcome." / "A street patrol. Jack caught the shift in Ceci's posture: not fear. Calculation."
- 5B: "A street patrol. Jack caught the shift in Ceci's posture: not fear. Calculation."
- 5C: "'End this!' a captain barked. 'Curtains closed. Lights out.'"
- 5D: "Ceci's chin lifted by a fraction—recognition, defiance, maybe destiny." / "Ceci moved first."

---

### Chapter 6: Violet Window
**Frames**: 6A, 6B, 6C, 6D, 6E
**Scene**: Phantom stage silhouette (Hero Beat)

| Asset | Type | Description |
|-------|------|-------------|
| `C4/C4BG.png` | Background | Reused ballroom corner |
| `shared/fg/mirror-broken.png` | Foreground | Shattered mirror |
| `shared/fg/couple-standing.png` | Foreground | Couple standing |
| `shared/bg/exterior-windows-silhouette.png` | Background | Building exterior with violet windows |
| `C2/C2BG.png` | Background | Dark room (reused for 6D) |
| `shared/fg/couple-closeup.png` | Foreground | Couple closeup |

**Layer Composition**:
- 6A: C4BG + mirror-broken + couple-standing
- 6B: C4BG + mirror-broken + couple-standing
- 6C: exterior-windows-silhouette
- 6D: C2BG + couple-closeup
- 6E: exterior-windows-silhouette

**Text Content**:
- 6A: "Ceci's chin lifted by a fraction—recognition, defiance, maybe destiny. Ceci moved first."
- 6B: "She killed the main lanterns..." / "The glass flared like a phantom stage." / "Their bodies became silhouettes—tall, fused, impossible to parse."
- 6C: "Their bodies became silhouettes..." / "A gasp rose from the square..." / "Only shadows remained: Ceci and Jack, framed in violet fire."
- 6D: "She stepped into him, closer than the dance required..." / "'Always,' he answered..."
- 6E: "They waltzed, framed by darkness..." / "She pressed her palm to his chest..." / "Someone clapped on the count..."

---

### Chapter 7: Heat & Tide
**Frames**: 7A, 7B, 7C, 7D
**Scene**: "Follow Me," "Always," Crowd vs Patrol

| Asset | Type | Description |
|-------|------|-------------|
| `C7/C7BG.png` | Background | Dancing crowd in square (complete scene) |
| `C7/C7BG2.png` | Background | Interior with windows showing crowd outside (complete scene) |
| `shared/bg/exterior-windows-silhouette.png` | Background | Exterior view |

**Layer Composition**:
- 7A: C7BG
- 7B: exterior-windows-silhouette
- 7C: C7BG2
- 7D: C7BG2

**Text Content**:
- 7A: "Someone clapped on the count..." / "The patrol tried to push through..."
- 7B: "Heat traveled through him like memory." / "Ceci slid her fingers to Jack's forearm..."
- 7C: "Heat gathered and traveled..." / "A question. A vow. A lifetime rethreading itself."
- 7D: "Jack exhaled her name—'Ceci...'—more confession than breath."

---

### Chapter 8: Release
**Frames**: 8A, 8B, 8C, 8D, 8E
**Scene**: Final note, city exhale, shared breath in the dark

| Asset | Type | Description |
|-------|------|-------------|
| `C8/C8BG.png` | Background | Street scene with soldiers and crowd (complete scene) |
| `C8/C8BG2.png` | Background | Dancing crowd closeup (complete scene) |
| `C8/C8BG3.png` | Background | Night interior looking out at street (complete scene) |

**Layer Composition**:
- 8A: C8BG
- 8B: C8BG2
- 8C: C8BG
- 8D: C8BG2
- 8E: C8BG3

**Text Content**:
- 8A: "From the street, they looked untouchable..." / "The rhythm swallowed their authority..."
- 8B: "The tide of dancers took the space they vacated..." / "From the street, they looked untouchable..."
- 8C: "The rhythm swallowed their authority..."
- 8D: "The tide of dancers took the space they vacated..."
- 8E: "When the final note faded, the city exhaled with them..." / "In the dark, Ceci rested her forehead against his..."

---

### Chapter 9: Residue & Dawn
**Frames**: 9A, 9B, 9C, 9D
**Scene**: Glass, ribbon, marked door, dawn hold

| Asset | Type | Description |
|-------|------|-------------|
| `C9/C9BG.png` | Background | Dawn room interior |
| `C9/C9FG.png` | Foreground | Couple holding brooms, intimate pose |
| `C9/C9BG2.png` | Background | Abandoned room with "CJ" on door |
| `C9/C9BG3.png` | Background | Brooms and purple cloth on floor |

**Layer Composition**:
- 9A: C9BG + C9FG
- 9B: C9BG + C9FG
- 9C: C9BG2
- 9D: C9BG3

**Text Content**:
- 9A: "At dawn, they broomed glass from the ballroom floor together..."
- 9B: "For a long time, the smell of tobacco and mist hung in the air."
- 9C: "On the backstage door, someone had chalked a bright CJ with a streak of flour—no one claiming it; everyone knowing."
- 9D: "Upstairs, their brooms stopped; their feet met." / "A hold." / "Her breath met his." / "Old as anything." / "New as dawn."

---

## Frame Sequence

Complete narrative flow with asset references:

| Frame | Assets | Text Boxes |
|-------|--------|------------|
| 1A | C1BG + C1FG1 | 3 |
| 1B | C1BG + C1FG1 + C1FG2 | 2 |
| 1C | C1BG + C1FG1 + C1FG2 | 3 |
| 2A | C2BG + C2FG1 | 2 |
| 2B | C2BG + couple-closeup | 2 |
| 3A | C3BG + C3FG | 2 |
| 3B | C3BG + C3FG | 1 |
| 4A | C4BG + mirror-intact | 1 |
| 4B | C4BG + mirror-broken + couple-standing | 2 |
| 5A | C5BG + C5FG1 | 2 |
| 5B | C5BG2 | 1 |
| 5C | C5BG2 | 1 |
| 5D | C5BG2 | 2 |
| 6A | C4BG + mirror-broken + couple-standing | 1 |
| 6B | C4BG + mirror-broken + couple-standing | 3 |
| 6C | exterior-windows-silhouette | 3 |
| 6D | C2BG + couple-closeup | 2 |
| 6E | exterior-windows-silhouette | 3 |
| 7A | C7BG | 2 |
| 7B | exterior-windows-silhouette | 2 |
| 7C | C7BG2 | 2 |
| 7D | C7BG2 | 1 |
| 8A | C8BG | 2 |
| 8B | C8BG2 | 2 |
| 8C | C8BG | 1 |
| 8D | C8BG2 | 1 |
| 8E | C8BG3 | 2 |
| 9A | C9BG + C9FG | 1 |
| 9B | C9BG + C9FG | 1 |
| 9C | C9BG2 | 1 |
| 9D | C9BG3 | 6 |

---

## Folder Structure

```
assets/
├── ASSET-INDEX.md
├── shared/
│   ├── bg/
│   │   └── exterior-windows-silhouette.png
│   └── fg/
│       ├── couple-closeup.png
│       ├── couple-standing.png
│       ├── mirror-broken.png
│       └── mirror-intact.png
├── C1/
│   ├── C1BG.png
│   ├── C1FG1.png
│   └── C1FG2.png
├── C2/
│   ├── C2BG.png
│   └── C2FG1.png
├── C3/
│   ├── C3BG.png
│   └── C3FG.png
├── C4/
│   └── C4BG.png
├── C5/
│   ├── C5BG.png
│   ├── C5BG2.png
│   └── C5FG1.png
├── C7/
│   ├── C7BG.png
│   └── C7BG2.png
├── C8/
│   ├── C8BG.png
│   ├── C8BG2.png
│   └── C8BG3.png    (was C9BG)
└── C9/
    ├── C9BG.png     (was C10BG)
    ├── C9FG.png     (was C10FG)
    ├── C9BG2.png    (was C11BG1)
    └── C9BG3.png    (was C11BG2)
```

---

## Text Content

All text has been extracted from storyboard frames above.
