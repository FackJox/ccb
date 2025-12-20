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
  }

  .violet-mask.active {
    opacity: 1;
  }
</style>
