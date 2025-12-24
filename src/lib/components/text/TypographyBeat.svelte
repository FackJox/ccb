<script lang="ts">
  /**
   * TypographyBeat - Dramatic full-width typographic moments
   *
   * Per Brand Guidelines: "full-screen typographic moments" and
   * "full blackout breaks—just a line of text in large Canela over Velvet Soot"
   *
   * Used for signature beats like "Un. Deux. Trois." and consent lines.
   */
  interface Props {
    content: string
    size?: 'normal' | 'large' | 'hero'
    variant?: 'beat' | 'consent'
    class?: string
  }

  let { content, size = 'large', variant = 'beat', class: className = '' }: Props = $props()
</script>

<div
  class="typography-beat {size} {variant} {className}"
  data-beat={variant === 'beat' ? '' : undefined}
  data-consent={variant === 'consent' ? '' : undefined}
>
  <span class="beat-text">{content}</span>
</div>

<style>
  /*
   * Utopia Fluid Typography
   * Reference viewport: 852px (landscape mobile frame)
   * Min viewport: 320px
   * Max viewport: 1200px
   *
   * Formula: clamp(min, min + (max - min) * ((100vw - minVp) / (maxVp - minVp)), max)
   * Simplified using vi unit: clamp(min, calc(base + growth * vi), max)
   */

  .typography-beat {
    /* Full width positioning - spans the viewport */
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 3rem;

    /* Typography - Canela display */
    font-family: 'Canela Bold', Georgia, serif;
    color: #F4E3C9; /* bakeryParchment */
    text-align: center;
    line-height: 1.2;

    /* Subtle text shadow for depth against dark bg */
    text-shadow:
      0 2px 8px rgba(0, 0, 0, 0.6),
      0 0 40px rgba(162, 72, 255, 0.15);
  }

  .beat-text {
    display: block;
    max-width: 90%;

    /* Fluid letter spacing - tighter on small screens */
    letter-spacing: clamp(0.02em, 0.04em, 0.06em);

    /* Allow GSAP to animate */
    will-change: opacity, transform;
  }

  /* ==================== SIZE VARIANTS (Utopia Fluid Scale) ==================== */

  .normal {
    /* Min: 1rem (16px) at 320px, Max: 1.75rem (28px) at 1200px */
    font-size: clamp(1rem, 0.8rem + 1.5vw, 1.75rem);
    padding: 1.5rem 2rem;
  }

  .large {
    /* Min: 1rem (16px) at 320px, Max: 2rem (32px) at 1200px */
    /* Aggressive scaling to fit long beat text on all viewports */
    font-size: clamp(1rem, 0.5rem + 2vw, 2rem);
    letter-spacing: clamp(0.01em, 0.03em, 0.05em);
  }

  .hero {
    /* Min: 1.5rem (24px) at 320px, Max: 4rem (64px) at 1200px */
    font-size: clamp(1.5rem, 0.5rem + 5vw, 4rem);
    letter-spacing: clamp(0.04em, 0.08em, 0.1em);
    text-transform: uppercase;
    padding: 3rem 2rem;
  }

  /* ==================== VARIANT STYLES ==================== */

  /* Consent variant - intimate feel */
  .consent {
    font-style: italic;
  }

</style>
