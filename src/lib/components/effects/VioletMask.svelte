<script lang="ts">
  interface Props {
    active?: boolean
    intensity?: number
    class?: string
  }

  let { active = false, intensity = 0.6, class: className = '' }: Props = $props()
</script>

<div
  class="violet-mask {className}"
  class:active
  style:--intensity={intensity}
  aria-hidden="true"
></div>

<style>
  .violet-mask {
    position: fixed;
    inset: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 0%,
      rgba(162, 72, 255, calc(var(--intensity) * 0.5)) 50%,
      rgba(162, 72, 255, var(--intensity)) 100%
    );
    pointer-events: none;
    opacity: 0;
    z-index: 100;
    transition: opacity 1.05s cubic-bezier(0.33, 0.0, 0.15, 1.0);
    /* Lantern sway origin - slightly off-center like a hanging lamp */
    transform-origin: 52% 5%;
  }

  .violet-mask.active {
    opacity: 1;
    animation:
      lantern-pulse 3.2s cubic-bezier(0.33, 0.0, 0.15, 1.0) infinite,
      lantern-sway 4.8s cubic-bezier(0.45, 0.0, 0.15, 1.0) infinite;
  }

  /* Slow intensity pulse - like flame breathing */
  @keyframes lantern-pulse {
    0%, 100% {
      filter: brightness(1);
      --pulse-intensity: 1;
    }
    25% {
      filter: brightness(1.08);
      --pulse-intensity: 1.05;
    }
    50% {
      filter: brightness(0.92);
      --pulse-intensity: 0.9;
    }
    75% {
      filter: brightness(1.04);
      --pulse-intensity: 1.02;
    }
  }

  /* Gentle positional sway - like a hanging lantern */
  @keyframes lantern-sway {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(0.5%, 0.3%) scale(1.01);
    }
    66% {
      transform: translate(-0.4%, -0.2%) scale(0.995);
    }
  }
</style>
