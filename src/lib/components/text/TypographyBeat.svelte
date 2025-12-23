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

  <!-- Subtle violet glow accent line -->
  <div class="accent-line" aria-hidden="true"></div>
</div>

<style>
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

    /* Slight letter spacing for gravitas */
    letter-spacing: 0.04em;

    /* Allow GSAP to animate */
    will-change: opacity, transform;
  }

  /* Accent line - subtle violet glow beneath text */
  .accent-line {
    position: absolute;
    bottom: 0.75rem;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    max-width: 400px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(162, 72, 255, 0.4) 20%,
      rgba(162, 72, 255, 0.6) 50%,
      rgba(162, 72, 255, 0.4) 80%,
      transparent 100%
    );
    opacity: 0.7;
  }

  /* ==================== SIZE VARIANTS ==================== */

  .normal {
    font-size: clamp(1.25rem, 4vw, 1.75rem);
    padding: 1.5rem 2rem;
  }

  .normal .accent-line {
    width: 40%;
    max-width: 200px;
  }

  .large {
    font-size: clamp(1.75rem, 5vw, 2.5rem);
    letter-spacing: 0.06em;
  }

  .hero {
    font-size: clamp(2.5rem, 8vw, 4rem);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 3rem 2rem;
  }

  .hero .accent-line {
    width: 80%;
    max-width: 600px;
    height: 2px;
  }

  /* ==================== VARIANT STYLES ==================== */

  /* Beat variant - dramatic reveal moments */
  .beat {
    /* Subtle violet atmospheric glow */
    background: radial-gradient(
      ellipse 80% 50% at 50% 100%,
      rgba(162, 72, 255, 0.08) 0%,
      transparent 70%
    );
  }

  /* Consent variant - intimate, warmer feel */
  .consent {
    /* Warmer, more intimate glow */
    background: radial-gradient(
      ellipse 60% 40% at 50% 100%,
      rgba(244, 227, 201, 0.05) 0%,
      transparent 60%
    );
    font-style: italic;
  }

  .consent .accent-line {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(244, 227, 201, 0.3) 20%,
      rgba(244, 227, 201, 0.5) 50%,
      rgba(244, 227, 201, 0.3) 80%,
      transparent 100%
    );
  }

</style>
